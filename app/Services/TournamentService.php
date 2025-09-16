<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\Tournament;
use Illuminate\Support\Facades\Log;

class TournamentService
{
    private $apiKey;
    private $baseUrl = 'https://api.start.gg';

    public function __construct()
    {
        $this->apiKey = env('STARTGG_API_KEY');
    }

    public function addTournament(string $slug, string $kategori): Tournament
    {
        try {
            // Fetch tournament data from start.gg
            $tournamentData = $this->fetchTournamentData($slug);
            
            if (!$tournamentData) {
                throw new \Exception('Tournament not found on start.gg');
            }

            // Get event data
            $eventData = $this->getEventFromTournament($tournamentData, $kategori);
            
            if (!$eventData) {
                throw new \Exception('Event not found in tournament');
            }

            // Create tournament record
            $tournament = Tournament::create([
                'name' => $tournamentData['name'],
                'slug' => $slug,
                'event_id' => (string)$eventData['id'],
                'kategori' => $kategori,
                'start_date' => $tournamentData['startAt'] ? 
                    \Carbon\Carbon::createFromTimestamp($tournamentData['startAt']) : null,
                'end_date' => $tournamentData['endAt'] ? 
                    \Carbon\Carbon::createFromTimestamp($tournamentData['endAt']) : null,
                'description' => $eventData['description'] ?? null,
                'status' => $this->determineStatus($tournamentData),
            ]);

            return $tournament;

        } catch (\Exception $e) {
            Log::error('Tournament creation failed', [
                'slug' => $slug,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    private function fetchTournamentData(string $slug): ?array
    {
        $query = '
            query TournamentQuery($slug: String!) {
                tournament(slug: $slug) {
                    id
                    name
                    slug
                    startAt
                    endAt
                    events {
                        id
                        name
                        slug
                        description
                        startAt
                        state
                    }
                }
            }
        ';

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}/gql/alpha", [
            'query' => $query,
            'variables' => ['slug' => $slug]
        ]);

        if ($response->failed()) {
            Log::error('StartGG API request failed', [
                'response' => $response->body(),
                'status' => $response->status()
            ]);
            return null;
        }

        $data = $response->json();
        return $data['data']['tournament'] ?? null;
    }

    private function getEventFromTournament(array $tournamentData, string $kategori): ?array
    {
        $events = $tournamentData['events'] ?? [];
        
        if (empty($events)) {
            return null;
        }

        // If kategori is numeric, get by index
        if (is_numeric($kategori)) {
            $index = (int)$kategori - 1;
            return $events[$index] ?? null;
        }

        // Search by name/slug
        foreach ($events as $event) {
            if (stripos($event['name'], $kategori) !== false || 
                stripos($event['slug'], $kategori) !== false) {
                return $event;
            }
        }

        // Default to first event
        return $events[0];
    }

    private function determineStatus(array $tournamentData): string
    {
        $now = time();
        $startAt = $tournamentData['startAt'];
        $endAt = $tournamentData['endAt'];

        if ($endAt && $now > $endAt) {
            return 'completed';
        }

        if ($startAt && $now >= $startAt && (!$endAt || $now <= $endAt)) {
            return 'ongoing';
        }

        return 'upcoming';
    }

    public function deleteTournament(int $tournamentId): bool
    {
        try {
            $tournament = Tournament::findOrFail($tournamentId);
            
            // Delete related results if they exist
            // Assuming you have a Result model
            // Result::where('tournament_id', $tournamentId)->delete();
            
            $tournament->delete();
            
            Log::info('Tournament deleted', ['tournament_id' => $tournamentId]);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Tournament deletion failed', [
                'tournament_id' => $tournamentId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function updateTournamentStatus(int $tournamentId, string $status): bool
    {
        try {
            $tournament = Tournament::findOrFail($tournamentId);
            $tournament->update(['status' => $status]);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Tournament status update failed', [
                'tournament_id' => $tournamentId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}