<?php
namespace Database\Seeders;


use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Admin TPC',
            'email' => 'admin@tekkenpku.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Buat beberapa player untuk testing
        User::create([
            'name' => 'Player 1',
            'email' => 'player1@example.com',
            'password' => Hash::make('password'),
            'role' => 'player',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Player 2',
            'email' => 'player2@example.com',
            'password' => Hash::make('password'),
            'role' => 'player',
            'email_verified_at' => now(),
        ]);
    }
}