<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ad_units', function (Blueprint $collection) {
            $collection->index('sizes');
            $collection->index('site_id');
            $collection->index('parent_id');
            $collection->index(['site_id', 'sizes']);
            $collection->index(['parent_id', 'sizes']);
            $collection->index(['site_id', 'parent_id', 'sizes']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ad_units');
    }
};
