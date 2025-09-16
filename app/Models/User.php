<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function oauthTokens()
    {
        return $this->hasMany(OAuthToken::class);
    }

    public function isAdmin(): bool
{
    return $this->role === 'admin'; // Sesuaikan field role milikmu
}

    public function isPlayer(): bool
    {
        return $this->role === 'player';
    }
     // Relationships
    public function relasitours()
    {
        return $this->hasMany(Relasitour::class);
    }

    public function leaderboard()
    {
        return $this->hasOne(Leaderboard::class);
    }

    public function tournaments()
    {
        return $this->belongsToMany(Tournament::class, 'relasitour', 'user_id', 'tourid')
                    ->withPivot('placement');
    }
}