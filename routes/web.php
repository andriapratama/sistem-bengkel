<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\VehicleBrandController;
use App\Http\Controllers\VehicleVariantController;
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
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/add', [ProductController::class, 'create'])->name('products.create');
    Route::get('/products/{product}/edit', [ProductController::class, "edit"])->name('products.edit');
    Route::get('/products/{product}/edit-image', [ProductController::class, "editImage"])->name('products.edit-image');
    Route::match(['post', 'put'], '/products/{product}/image', [ProductController::class, 'updateImage'])->name('products.update-image');
    Route::put('/products/{product}', [ProductController::class, "update"])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, "destroy"])->name('products.destroy');

    Route::get('/vehicle-brands', [VehicleBrandController::class, 'index'])->name('vehicle-brands.index');
    Route::post('/vehicle-brands', [VehicleBrandController::class, 'store'])->name('vehicle-brands.store');
    Route::get('/vehicle-brands/add', [VehicleBrandController::class, 'create'])->name('vehicle-brands.create');
    Route::get('/vehicle-brands/{vehicleBrand}/edit', [VehicleBrandController::class, "edit"])->name('vehicle-brands.edit');
    Route::put('/vehicle-brands/{vehicleBrand}', [VehicleBrandController::class, "update"])->name('vehicle-brands.update');
    Route::delete('/vehicle-brands/{vehicleBrand}', [VehicleBrandController::class, "destroy"])->name('vehicle-brands.destroy');
   
    Route::get('/vehicle-variants', [VehicleVariantController::class, 'index'])->name('vehicle-variants.index');
    Route::post('/vehicle-variants', [VehicleVariantController::class, 'store'])->name('vehicle-variants.store');
    Route::get('/vehicle-variants/add', [VehicleVariantController::class, 'create'])->name('vehicle-variants.create');
    Route::get('/vehicle-variants/{vehicleVariant}/edit', [VehicleVariantController::class, "edit"])->name('vehicle-variants.edit');
    Route::put('/vehicle-variants/{vehicleVariant}', [VehicleVariantController::class, "update"])->name('vehicle-variants.update');
    Route::delete('/vehicle-variants/{vehicleVariant}', [VehicleVariantController::class, "destroy"])->name('vehicle-variants.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
