<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Tournament;
use App\Models\Relasitour;
use App\Models\User;
use App\Models\Leaderboard;
use Exception;

class AdminTournamentsController extends Controller
{
    private $startggUrl = 'https://api.start.gg/gql/alpha';

    /**
     * Get tournaments and leaderboard data
     */
    public function index()
    {
        try {
            $user = auth()->user();
            $tournaments = Tournament::with(['relasitours.user'])->get();
            $users = User::all();

            return Inertia::render('Admin/AdminPages', [
                'user' => $user,
                'users' => $users,
                'tournaments' => $tournaments,
                'currentPage' => 'tournaments',
                'session' => session()->all(),
            ]);
        } catch (Exception $e) {
            return back()->withErrors([
                'message' => 'Failed to fetch tournaments: ' . $e->getMessage()
            ]);
        }
    }
    // Ambil leaderboard
    public function getLeaderboard()
    {
        $leaderboards = Leaderboard::orderByDesc('total_points')->get();
        $tournaments = Tournament::with('relasitours.user')->get();

        return response()->json([
            'success' => true,
            'leaderboards' => $leaderboards,
            'tournaments' => $tournaments
        ]);
    }
    public function fetchBySlug(Request $request)
    {
        $slug = $request->input('slug');

        if (!$slug) {
            return response()->json([
                'success' => false,
                'message' => 'Slug is required'
            ], 400);
        }

        // Query Start.gg API pakai Guzzle atau Http
        $query = <<<GRAPHQL
    query EventBySlug(\$slug: String!) {
      event(slug: \$slug) {
        id
        name
        tournament {
          id
          name
        }
      }
    }
    GRAPHQL;

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('STARTGG_API_KEY'),
        ])->post('https://api.start.gg/gql/alpha', [
            'query' => $query,
            'variables' => ['slug' => $slug]
        ]);

        if ($response->failed()) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch from Start.gg',
                'error' => $response->body()
            ], 500);
        }

        return response()->json([
            'success' => true,
            'data' => $response->json()
        ]);
    }
    // Ambil detail player
    public function getPlayerDetails($slug)
{
    // Step 1: Ambil Event ID berdasarkan slug
    $eventResponse = Http::withHeaders([
        'Authorization' => 'Bearer ' . env('STARTGG_API_KEY'),
        'Content-Type'  => 'application/json',
    ])->post('https://api.start.gg/gql/alpha', [
        'query' => '
            query getEventId($slug: String) {
              event(slug: $slug) {
                id
                name
              }
            }
        ',
        'variables' => [
            'slug' => $slug
        ]
    ]);

    if ($eventResponse->failed() || !isset($eventResponse['data']['event'])) {
        return response()->json(['success' => false, 'message' => 'Event not found'], 404);
    }

    $eventId = $eventResponse['data']['event']['id'];
    $eventName = $eventResponse['data']['event']['name'];

    // Step 2: Ambil Standings (misalnya top 8)
    $standingsResponse = Http::withHeaders([
        'Authorization' => 'Bearer ' . env('STARTGG_API_KEY'),
        'Content-Type'  => 'application/json',
    ])->post('https://api.start.gg/gql/alpha', [
        'query' => '
            query EventStandings($eventId: ID!, $page: Int!, $perPage: Int!) {
              event(id: $eventId) {
                id
                name
                standings(query: {
                  perPage: $perPage,
                  page: $page
                }) {
                  nodes {
                    placement
                    entrant {
                      id
                      name
                    }
                  }
                }
              }
            }
        ',
        'variables' => [
            'eventId' => (int) $eventId,
            'page' => 1,
            'perPage' => 8
        ]
    ]);

    if ($standingsResponse->failed()) {
        return response()->json(['success' => false, 'message' => 'Failed to fetch standings'], 500);
    }

    $standings = $standingsResponse['data']['event']['standings']['nodes'];

    return response()->json([
        'success' => true,
        'event' => [
            'id' => $eventId,
            'name' => $eventName,
        ],
        'standings' => $standings
    ]);
}

    /**
     * Calculate points berdasarkan placement & kategori
     */
    private function calculatePoints($placement, $category)
    {
        $pointTable = [
            1 => [1 => 800, 2 => 560, 3 => 430, 4 => 220, 5 => 150, 7 => 120, 9 => 70, 13 => 50, 17 => 30], // major
            2 => [1 => 400, 2 => 300, 3 => 220, 4 => 150, 5 => 70, 7 => 50, 9 => 30, 13 => 15, 17 => 10],   // minor
            3 => [1 => 220, 2 => 150, 3 => 100, 4 => 70, 5 => 50, 7 => 30, 9 => 15, 13 => 10, 17 => 5],     // mini
        ];

        $catPoints = $pointTable[$category] ?? $pointTable[3];

        if ($placement === 1) return $catPoints[1];
        if ($placement === 2) return $catPoints[2];
        if ($placement === 3) return $catPoints[3];
        if ($placement === 4) return $catPoints[4];
        if ($placement >= 5 && $placement <= 6) return $catPoints[5];
        if ($placement >= 7 && $placement <= 8) return $catPoints[7];
        if ($placement >= 9 && $placement <= 12) return $catPoints[9];
        if ($placement >= 13 && $placement <= 16) return $catPoints[13];
        if ($placement >= 17) return $catPoints[17];

        return 0;
    }

    /**
     * Hitung leaderboard dari Relasitour
     */
    public function calculateLeaderboard()
    {
        try {
            Leaderboard::truncate();

            $allStandings = Relasitour::with(['user', 'tournament'])->get()
                ->groupBy(fn($s) => $s->user->name);

            foreach ($allStandings as $playerName => $standings) {
                $majorEvents = $standings->where('tournament.category', 1)
                    ->sortByDesc(fn($s) => $this->calculatePoints($s->placement, 1))
                    ->take(1);
                $minorEvents = $standings->where('tournament.category', 2)
                    ->sortByDesc(fn($s) => $this->calculatePoints($s->placement, 2))
                    ->take(2);
                $miniEvents = $standings->where('tournament.category', 3)
                    ->sortByDesc(fn($s) => $this->calculatePoints($s->placement, 3))
                    ->take(4);

                $majorPoints = $majorEvents->sum(fn($s) => $this->calculatePoints($s->placement, 1));
                $minorPoints = $minorEvents->sum(fn($s) => $this->calculatePoints($s->placement, 2));
                $miniPoints = $miniEvents->sum(fn($s) => $this->calculatePoints($s->placement, 3));

                Leaderboard::create([
                    'user_id' => $standings->first()->user->id ?? null,
                    'player_name' => $playerName,
                    'major' => $majorPoints,
                    'minor' => $minorPoints,
                    'mini' => $miniPoints,
                    'total_points' => $majorPoints + $minorPoints + $miniPoints,
                    'counted_major_events' => $majorEvents->count(),
                    'counted_minor_events' => $minorEvents->count(),
                    'counted_mini_events' => $miniEvents->count(),
                    'total_major_events' => $standings->where('tournament.category', 1)->count(),
                    'total_minor_events' => $standings->where('tournament.category', 2)->count(),
                    'total_mini_events' => $standings->where('tournament.category', 3)->count(),
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Leaderboard calculated successfully'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to calculate leaderboard: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update kategori tournament
     */
    public function updateTournamentCategory(Request $request, $tournamentId)
    {
        $request->validate([
            'category' => 'required|in:1,2,3' // 1=major, 2=minor, 3=mini
        ]);

        try {
            $tournament = Tournament::findOrFail($tournamentId);
            $tournament->update(['category' => $request->category]);

            return response()->json([
                'success' => true,
                'message' => 'Tournament category updated'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update tournament: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all tournaments with players
     */
    public function getTournaments()
    {
        try {
            $tournaments = Tournament::with(['relasitours.user'])->get();

            return response()->json([
                'success' => true,
                'tournaments' => $tournaments
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch tournaments: ' . $e->getMessage()
            ], 500);
        }
    }
}
