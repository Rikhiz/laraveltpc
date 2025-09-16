<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leaderboard extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'major',
        'minor',
        'mini',
        'total_points',
        'total_major_events',
        'total_minor_events',
        'total_mini_events',
        'counted_major_events',
        'counted_minor_events',
        'counted_mini_events',
    ];

    protected $casts = [
        'major' => 'integer',
        'minor' => 'integer',
        'mini' => 'integer',
        'total_points' => 'integer',
        'total_major_events' => 'integer',
        'total_minor_events' => 'integer',
        'total_mini_events' => 'integer',
        'counted_major_events' => 'integer',
        'counted_minor_events' => 'integer',
        'counted_mini_events' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accessors
    public function getPlayerNameAttribute()
    {
        return $this->user->name ?? 'Unknown Player';
    }
}