<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('leaderboards', function (Blueprint $table) {
            $table->integer('major')->default(0);
            $table->integer('minor')->default(0);
            $table->integer('mini')->default(0);
            $table->integer('total_points')->default(0);
            $table->integer('total_major_events')->default(0);
            $table->integer('total_minor_events')->default(0);
            $table->integer('total_mini_events')->default(0);
        });
    }

    public function down()
    {
        Schema::table('leaderboards', function (Blueprint $table) {
            $table->dropColumn([
                'major',
                'minor',
                'mini',
                'total_points',
                'total_major_events',
                'total_minor_events',
                'total_mini_events',
            ]);
        });
    }
};
