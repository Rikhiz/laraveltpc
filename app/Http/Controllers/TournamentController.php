<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\TournamentService;
use App\Models\Tournament;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TournamentController extends Controller
{
    private $tournamentService;

    public function __construct(TournamentService $tournamentService)
    {
        $this->tournamentService = $tournamentService;
        $this->middleware('admin');
    }

    /**
     * Halaman utama tournaments (Inertia)
     */
    public function index()
    {
        $tournaments = Tournament::all()->map(function ($t) {
            return [
                'id'        => $t->id,
                'name'      => $t->name,
                'slug'      => $t->slug,
                'event_id'  => $t->event_id,
                'kategori'  => $t->kategori,
                'created_at'=> $t->created_at,
            ];
        });

        return Inertia::render('Admin/AdminPages', [
            'user'        => Auth::user(),
            'tournaments' => $tournaments,
            'currentPage' => 'tournaments', // ⬅️ supaya render AdminTournaments
        ]);
    }

    /**
     * Tambah tournament (dipanggil via fetch/axios)
     */
    public function store(Request $request)
    {
        $request->validate([
            'slug'     => 'required|string|max:255',
            'kategori' => 'required|string|max:50',
        ]);

        try {
            $tournament = $this->tournamentService->addTournament(
                $request->slug,
                $request->kategori
            );

            return response()->json([
                'success'    => true,
                'message'    => 'Tournament added successfully!',
                'tournament' => $tournament
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Hapus tournament (dipanggil via fetch/axios)
     */
    public function destroy(Tournament $tournament)
    {
        try {
            $this->tournamentService->deleteTournament($tournament->id);

            return response()->json([
                'success' => true,
                'message' => 'Tournament deleted successfully!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Delete failed: ' . $e->getMessage()
            ], 400);
        }
    }
}
