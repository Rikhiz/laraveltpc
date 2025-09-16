<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use App\Models\OAuthToken;
use Carbon\Carbon;
use Inertia\Inertia;

class StartggOAuthController extends Controller
{
    private $clientId = '261';
    private $clientSecret = 'ce38071f34083fc6d0b504e491b52f5706b90ba88f8b795f1574cbf50276f26d'; // Ganti dengan secret yang benar
    private $redirectUri = 'https://tekkenpku.com/admin';
    private $baseUrl = 'https://api.start.gg';

    public function callback(Request $request)
    {
        $code = $request->code;

        if (!$code) {
            return response()->json(['error' => 'No authorization code provided'], 400);
        }

        try {
            $response = Http::asForm()->post("{$this->baseUrl}/oauth/token", [
                'client_id'     => $this->clientId,
                'client_secret' => $this->clientSecret,
                'grant_type'    => 'authorization_code',
                'code'          => $code,
                'redirect_uri'  => $this->redirectUri,
            ]);

            if ($response->failed()) {
                \Log::error('StartGG OAuth token exchange failed', [
                    'response' => $response->body(),
                    'status' => $response->status()
                ]);
                return response()->json(['error' => 'OAuth token exchange failed'], 400);
            }

            $data = $response->json();

            // Simpan ke DB
            OAuthToken::updateOrCreate(
                ['user_id' => Auth::id()],
                [
                    'access_token'  => $data['access_token'],
                    'refresh_token' => $data['refresh_token'] ?? null,
                    'expires_in'    => $data['expires_in'],
                    'token_type'    => $data['token_type'],
                    'expires_at'    => now()->addSeconds($data['expires_in']),
                ]
            );

            return response()->json(['success' => true, 'message' => 'Successfully connected to start.gg']);

        } catch (\Exception $e) {
            \Log::error('StartGG OAuth callback error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'OAuth process failed'], 500);
        }
    }

    public function getUser()
    {
        try {
            $token = OAuthToken::where('user_id', Auth::id())->first();
            
            if (!$token) {
                return response()->json(['connected' => false, 'user' => null]);
            }

            // Check if token needs refresh
            if ($token->isExpiringSoon() && $token->refresh_token) {
                $token = $this->refreshToken($token);
            }

            if ($token->isExpired()) {
                return response()->json(['connected' => false, 'user' => null]);
            }

            $response = Http::withToken($token->access_token)
                ->post("{$this->baseUrl}/gql/alpha", [
                    'query' => '
                      query CurrentUser {
                        currentUser {
                          id
                          slug
                          bio
                          name
                          email
                          images { url type }
                          authorizations { id type }
                        }
                      }
                    '
                ]);

            if ($response->failed()) {
                \Log::error('StartGG API request failed', ['response' => $response->body()]);
                return response()->json(['connected' => false, 'user' => null]);
            }

            $userData = $response->json();
            
            return response()->json([
                'connected' => true,
                'user' => $userData['data']['currentUser'] ?? null
            ]);

        } catch (\Exception $e) {
            \Log::error('StartGG get user error', ['error' => $e->getMessage()]);
            return response()->json(['connected' => false, 'user' => null]);
        }
    }

    public function disconnect()
    {
        try {
            OAuthToken::where('user_id', Auth::id())->delete();
            return response()->json(['success' => true, 'message' => 'Successfully disconnected from start.gg']);
        } catch (\Exception $e) {
            \Log::error('StartGG disconnect error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to disconnect'], 500);
        }
    }

    private function refreshToken(OAuthToken $token)
    {
        try {
            $response = Http::asForm()->post("{$this->baseUrl}/oauth/token", [
                'client_id'     => $this->clientId,
                'client_secret' => $this->clientSecret,
                'grant_type'    => 'refresh_token',
                'refresh_token' => $token->refresh_token,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                $token->update([
                    'access_token'  => $data['access_token'],
                    'refresh_token' => $data['refresh_token'] ?? $token->refresh_token,
                    'expires_in'    => $data['expires_in'],
                    'expires_at'    => now()->addSeconds($data['expires_in']),
                ]);
            }

            return $token;
        } catch (\Exception $e) {
            \Log::error('StartGG token refresh error', ['error' => $e->getMessage()]);
            return $token;
        }
    }

    // Method untuk mendapatkan data OAuth dalam dashboard
    public function getOAuthDataForDashboard()
    {
        $token = OAuthToken::where('user_id', Auth::id())->first();
        
        if (!$token || $token->isExpired()) {
            return [
                'oauthConnected' => false,
                'oauthUser' => null
            ];
        }

        try {
            // Refresh token jika perlu
            if ($token->isExpiringSoon() && $token->refresh_token) {
                $token = $this->refreshToken($token);
            }

            $response = Http::withToken($token->access_token)
                ->post("{$this->baseUrl}/gql/alpha", [
                    'query' => '
                      query CurrentUser {
                        currentUser {
                          id
                          slug
                          bio
                          name
                          email
                          images { url type }
                          authorizations { id type }
                        }
                      }
                    '
                ]);

            if ($response->successful()) {
                $userData = $response->json();
                return [
                    'oauthConnected' => true,
                    'oauthUser' => $userData['data']['currentUser'] ?? null
                ];
            }
        } catch (\Exception $e) {
            \Log::error('StartGG dashboard data error', ['error' => $e->getMessage()]);
        }

        return [
            'oauthConnected' => false,
            'oauthUser' => null
        ];
    }
}