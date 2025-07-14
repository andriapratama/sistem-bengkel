<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UnitController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/units', [UnitController::class, 'index'])->name('units.index');
    Route::post('/units', [UnitController::class, 'store'])->name('units.store');
    Route::get('/units/add', [UnitController::class, 'create'])->name('units.create');
    Route::get('/units/{unit}/edit', [UnitController::class, "edit"])->name('units.edit');
    Route::put('/units/{unit}', [UnitController::class, "update"])->name('units.update');
    Route::delete('/units/{unit}', [UnitController::class, "destroy"])->name('units.destroy');

    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/add', [CategoryController::class, 'create'])->name('categories.create');
    Route::get('/categories/{category}/edit', [CategoryController::class, "edit"])->name('categories.edit');
    Route::put('/categories/{category}', [CategoryController::class, "update"])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, "destroy"])->name('categories.destroy');

    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
