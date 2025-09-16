<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Tournament;
use App\Http\Controllers\StartggOAuthController;

class DashboardController extends Controller
{

    public function index()
    {
        $users = User::all()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'player',
                'created_at' => $user->created_at
            ];
        });

        // Ambil data session
        $sessionData = [
            'user_id' => session('user_id'),
            'user_name' => session('user_name'),
            'user_email' => session('user_email'),
            'user_role' => session('user_role'),
        ];

        return Inertia::render('AdminPages', [
            'user'    => Auth::user(),
            'users'   => $users,
            'session' => $sessionData, // ⬅️ kirim ke React
        ]);
    }

    // public function index(Request $request)
    // {
    //     // Ambil semua users
    //     $users = User::all()->map(function ($user) {
    //         return [
    //             'id' => $user->id,
    //             'name' => $user->name,
    //             'email' => $user->email,
    //             'role' => $user->role ?? 'player',
    //             'created_at' => $user->created_at
    //         ];
    //     });

    //     // // Get tournaments data
    //     // $tournaments = Tournament::all()->map(function ($tournament) {
    //     //     return [
    //     //         'id' => $tournament->id,
    //     //         'name' => $tournament->name,
    //     //         'slug' => $tournament->slug,
    //     //         'event_id' => $tournament->event_id,
    //     //         'kategori' => $tournament->kategori,
    //     //         'created_at' => $tournament->created_at
    //     //     ];
    //     // });

    //     // // Get OAuth data
    //     // $startggController = new StartggOAuthController();
    //     // $oauthData = $startggController->getOAuthDataForDashboard();

    //             // Ambil semua session
    //     $sessionData = $request->session()->all();

    //     return Inertia::render('Admin/AdminDashboard', [
    //         'user' => Auth::user(),    // user yang login (dari session default Laravel)
    //         'users' => $users,         // semua users
    //         'session' => $sessionData, // semua isi session
    //     ]);


    //         // 'tournaments' => $tournaments,
    //         // 'oauthConnected' => $oauthData['oauthConnected'],
    //         // 'oauthUser' => $oauthData['oauthUser']
    //     // ]);
    // }
}
