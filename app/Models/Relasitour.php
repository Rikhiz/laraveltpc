<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Relasitour extends Model
{
    use HasFactory;

    protected $table = 'relasitour';
    
    protected $fillable = [
        'user_id',
        'tourid',
        'placement',
    ];

    protected $casts = [
        'placement' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tournament()
    {
        return $this->belongsTo(Tournament::class, 'tourid', 'tourid');
    }
}