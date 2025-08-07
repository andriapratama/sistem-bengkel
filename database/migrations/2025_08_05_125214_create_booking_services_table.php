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
        Schema::create('booking_services', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->date('date_booking');
            $table->integer('queue_number');
            $table->integer('estimated_service_duration')->nullable();
            $table->decimal('estimated_service_price', 15, 2)->nullable();
            $table->dateTime('estimated_service_start')->nullable();
            $table->dateTime('estimated_service_end')->nullable();
            $table->enum('status', ['pending', 'accepted', 'processing', 'completed', 'canceled'])->default('pending');
            $table->text('note')->nullable();

            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->unsignedBigInteger('vehicle_id')->nullable();
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_services');
    }
};
