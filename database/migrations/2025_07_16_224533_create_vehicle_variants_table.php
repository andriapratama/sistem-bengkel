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
        Schema::create('vehicle_variants', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('name')->unique();

            $table->unsignedBigInteger('vehicleBrandId')->nullable();
            $table->foreign('vehicleBrandId')->references('id')->on('vehicle_brands')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_variants');
    }
};
