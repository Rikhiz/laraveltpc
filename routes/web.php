<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\StartggOAuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\AdminTournamentsController;
use App\Http\Controllers\TournamentController;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Session\Middleware\AuthenticateSession;

// Main home page (anonymous users)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// Authentication routes
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');

Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {
    // Halaman dashboard (Inertia)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Halaman tournaments (Inertia)
    Route::get('/tournaments', [AdminTournamentsController::class, 'index'])->name('tournaments');
});

Route::prefix('admin/tournaments')->group(function () {
    Route::get('/get', [AdminTournamentsController::class, 'getTournaments']); 
    Route::post('/calculate-leaderboard', [AdminTournamentsController::class, 'calculateLeaderboard']);
    Route::post('/fetch-by-slug', [AdminTournamentsController::class, 'fetchBySlug']);
    Route::post('/fetch-standings', [AdminTournamentsController::class, 'fetchStandings']);
    Route::get('/leaderboard', [AdminTournamentsController::class, 'getLeaderboard']);
    Route::get('/player/{id}', [AdminTournamentsController::class, 'getPlayerDetails']);
});
// Dashboard for authenticated users

// Profile routes (remove duplicates)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard routes
    Route::get('/admin', [DashboardController::class, 'index'])->name('admin.dashboard');
    
    // OAuth routes
    Route::prefix('oauth/startgg')->group(function () {
        Route::post('/callback', [StartggOAuthController::class, 'callback'])->name('oauth.startgg.callback');
        Route::get('/user', [StartggOAuthController::class, 'getUser'])->name('oauth.startgg.user');
        Route::post('/disconnect', [StartggOAuthController::class, 'disconnect'])->name('oauth.startgg.disconnect');
    });
    
    // Tournament management routes
    Route::prefix('admin/tournaments')->middleware('admin')->group(function () {
        Route::post('/', [TournamentController::class, 'store'])->name('tournaments.store');
        Route::delete('/{tournament}', [TournamentController::class, 'destroy'])->name('tournaments.destroy');
        Route::patch('/{tournament}/status', [TournamentController::class, 'updateStatus'])->name('tournaments.update-status');
    });
});

require __DIR__.'/auth.php';