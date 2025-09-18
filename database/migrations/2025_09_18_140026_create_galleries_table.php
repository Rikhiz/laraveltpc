<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('galleries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_id')
                ->constrained('tournaments') // relasi ke tabel tournaments
                ->onDelete('cascade');      // kalau tournament dihapus, gallery ikut hilang
            $table->string('title')->nullable(); // judul gambar (opsional)
            $table->text('description')->nullable(); // deskripsi gambar
            $table->string('image_path'); // lokasi file gambar (misalnya path di storage/public)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('galleries');
    }
};
