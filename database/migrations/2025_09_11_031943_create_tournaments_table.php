<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tournaments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('total')->default(0);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->string('image_url')->nullable();
            $table->string('desc')->nullable();
            $table->string('prizepool')->nullable();
            $table->integer('max_pemain')->nullable();
            $table->string('url_yt')->nullable();
            $table->string('url_startgg')->nullable();
            $table->enum('status', ['Selesai', 'Pendaftaran Dibuka'])->default('Pendaftaran Dibuka');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tournaments');
    }
};
