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
        Schema::create('service_order_details', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('name');
            $table->decimal('price', 15, 2)->nullable();

            $table->unsignedBigInteger('service_order_id')->nullable();
            $table->foreign('service_order_id')->references('id')->on('service_orders')->onDelete('set null');
            $table->unsignedBigInteger('service_id')->nullable();
            $table->foreign('service_id')->references('id')->on('services')->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_order_details');
    }
};
