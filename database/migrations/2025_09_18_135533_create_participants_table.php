<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tournaments_id')->constrained('tournaments')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->integer('placement')->nullable(); // juara 1,2,3 dst
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('participants');
    }
};
