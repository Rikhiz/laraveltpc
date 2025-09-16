<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('relasitour', function (Blueprint $table) {
            $table->id();
            $table->string('tourid'); // relasi ke tournaments.tourid
            $table->unsignedBigInteger('user_id'); // relasi ke users.id
            $table->integer('placement')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('tourid')->references('tourid')->on('tournaments')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('relasitour');
    }
};
