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
        Schema::create('products', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->integer('stock');
            $table->decimal('cost', 15, 2);
            $table->decimal('price', 15, 2);
            $table->string('image')->nullable();
            $table->boolean('status');
            $table->integer('discountPercentage')->nullable();
            $table->decimal('discountAmount', 15, 2)->nullable();
            $table->decimal('priceAfterDiscount', 15, 2)->nullable();

            $table->unsignedBigInteger('categoryId')->nullable();
            $table->foreign('categoryId')->references('id')->on('categories')->onDelete('set null');
            $table->unsignedBigInteger('unitId')->nullable();
            $table->foreign('unitId')->references('id')->on('units')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
