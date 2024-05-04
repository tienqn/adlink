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
        Schema::create('sites', function (Blueprint $collection) {
            $collection->index('publisher_id');
            $collection->index('domain');
            $collection->index('status');
            $collection->index('categories');
            $collection->index(['domain', 'status']);
            $collection->index(['publisher_id', 'status']);
            $collection->index(['category_ids', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sites');
    }
};
