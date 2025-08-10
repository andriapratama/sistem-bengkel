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
        Schema::create('service_orders', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('service_number')->unique();
            $table->date('service_date');
            $table->integer('queue_number')->nullable();
            $table->enum('service_type', ['booking', 'walk_in'])->default('walk_in');
            $table->enum('status', ['pending', 'processing', 'completed', 'canceled'])->default('pending');
            $table->enum('payment_status', ['unpaid', 'paid',])->default('unpaid');
            $table->decimal('grand_total', 15, 2)->nullable();
            $table->integer('discount_percentage')->nullable();
            $table->decimal('discounta_amount', 15, 2)->nullable();
            $table->text('note')->nullable();
            $table->string('mechanic_name')->nullable();
            $table->string('cashier_name')->nullable();

            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->unsignedBigInteger('vehicle_id')->nullable();
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('set null');
            $table->unsignedBigInteger('booking_service_id')->nullable();
            $table->foreign('booking_service_id')->references('id')->on('booking_services')->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_orders');
    }
};
