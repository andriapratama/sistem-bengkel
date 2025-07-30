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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('invoice_number')->unique();
            $table->decimal('total_price', 15, 2);
            $table->integer('total_quantity');
            $table->enum('payment_status', ['pending', 'paid', 'failed'])->default('pending');
            $table->enum('payment_method', ['bank_transfer', 'ewallet', 'cod'])->default('bank_transfer');
            $table->text('shipping_address');
            
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
