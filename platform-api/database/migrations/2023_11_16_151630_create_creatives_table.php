<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCreativesTable extends Migration
{
    public function up(): void
    {
        Schema::create('creatives', function (Blueprint $table) {
            $table->index(['ad_set_ids']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('creatives');
    }
}
