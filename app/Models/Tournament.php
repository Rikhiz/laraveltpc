<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'tourid',
        'total',
        'category',
    ];

    protected $casts = [
        'total' => 'integer',
        'category' => 'integer',
    ];

    // Relationships
    public function relasitours()
    {
        return $this->hasMany(Relasitour::class, 'tourid', 'tourid');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'relasitour', 'tourid', 'user_id')
                    ->withPivot('placement');
    }

    // Accessors
    public function getCategoryNameAttribute()
    {
        $categories = [
            1 => 'Major',
            2 => 'Minor',
            3 => 'Mini'
        ];

        return $categories[$this->category] ?? 'Unknown';
    }
}