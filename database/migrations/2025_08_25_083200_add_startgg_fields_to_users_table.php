<?php
// Paste this content into the migration file that was created:
// database/migrations/XXXX_XX_XX_XXXXXX_add_startgg_fields_to_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('startgg_id')->nullable();
            $table->string('startgg_username')->nullable();
            
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'startgg_id',
                'startgg_username', 
           
            ]);
        });
    }
};