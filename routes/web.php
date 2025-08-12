<?php

use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminLoginController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminBookingController;
use App\Http\Controllers\Admin\AdminMechanicJobController;
use App\Http\Controllers\Admin\AdminCashierController;
use App\Http\Controllers\Admin\AdminRegisterController;
use App\Http\Controllers\Admin\AdminUnitController;
use App\Http\Controllers\Admin\AdminServiceController;
use App\Http\Controllers\Admin\AdminVehicleBrandController;
use App\Http\Controllers\Admin\AdminVehicleVariantController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('dashboard', function () {
    //     return Inertia::render('admin/dashboard');
    // })->name('dashboard');

});

// ADMIN ROUTES
Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware(['admin.auth'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('admin/dashboard');
        })->name('dashboard');

        Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/get-all', [AdminOrderController::class, 'getAll'])->name('orders.getAll');
        Route::get('/orders/{id}', [AdminOrderController::class, 'detail'])->name('orders.detail');
        Route::post('/orders/{id}', [AdminOrderController::class, 'store'])->name('orders.store');
        Route::get('/orders/get-one/{id}', [AdminOrderController::class, 'getOneById'])->name('orders.getOneById');
        Route::put('/orders/update/{id}', [AdminOrderController::class, 'updateShippingStatus'])->name('orders.updateShippingStatus');

        Route::get('/bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
        Route::get('/bookings/get-all', [AdminBookingController::class, 'getAll'])->name('bookings.getAll');
        Route::get('/bookings/{id}', [AdminBookingController::class, 'detail'])->name('bookings.detail');
        Route::post('/bookings/{id}', [AdminBookingController::class, 'store'])->name('bookings.store');
        Route::get('/bookings/get-one/{id}', [AdminBookingController::class, 'getOneById'])->name('bookings.getOneById');
        Route::put('/bookings/update/{id}', [AdminBookingController::class, 'updateStatus'])->name('bookings.updateStatus');

        Route::get('/mechanic-jobs', [AdminMechanicJobController::class, 'index'])->name('mechanic-jobs.index');
        Route::get('/mechanic-jobs/get-all', [AdminMechanicJobController::class, 'getAll'])->name('mechanic-jobs.getAll');
        Route::get('/mechanic-jobs/{id}', [AdminMechanicJobController::class, 'detail'])->name('mechanic-jobs.detail');
        Route::get('/mechanic-jobs/get-one/{id}', [AdminMechanicJobController::class, 'getOneById'])->name('mechanic-jobs.getOneById');
        Route::post('/mechanic-jobs/store-service', [AdminMechanicJobController::class, 'storeService'])->name('mechanic-jobs.storeService');
        Route::put('/mechanic-jobs/update-service/{id}', [AdminMechanicJobController::class, "updateService"])->name('mechanic-jobs.updateService');
        Route::delete('/mechanic-jobs/destroy-service/{id}', [AdminMechanicJobController::class, "destroyService"])->name('mechanic-jobs.destroyService');
        Route::post('/mechanic-jobs/store-product', [AdminMechanicJobController::class, 'storeProduct'])->name('mechanic-jobs.storeProduct');
        Route::put('/mechanic-jobs/update-product/{id}', [AdminMechanicJobController::class, 'updateProduct'])->name('mechanic-jobs.updateProduct');
        Route::delete('/mechanic-jobs/destroy-product/{id}', [AdminMechanicJobController::class, 'destroyProduct'])->name('mechanic-jobs.destroyProduct');
        Route::put('/mechanic-jobs/update-status/{id}', [AdminMechanicJobController::class, 'updateStatus'])->name('mechanic-jobs.updateStatus');

        Route::get('/cashiers', [AdminCashierController::class, 'index'])->name('cashier.index');

        Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
        Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
        Route::get('/products/add', [AdminProductController::class, 'create'])->name('products.create');
        Route::get('/products/get-all', [AdminProductController::class, 'getAll'])->name('products.getAll');
        Route::get('/products/{product}/edit', [AdminProductController::class, "edit"])->name('products.edit');
        Route::get('/products/{product}/edit-image', [AdminProductController::class, "editImage"])->name('products.edit-image');
        Route::match(['post', 'put'], '/products/{product}/image', [AdminProductController::class, 'updateImage'])->name('products.update-image');
        Route::put('/products/{product}', [AdminProductController::class, "update"])->name('products.update');
        Route::delete('/products/{product}', [AdminProductController::class, "destroy"])->name('products.destroy');

        Route::get('/units', [AdminUnitController::class, 'index'])->name('units.index');
        Route::post('/units', [AdminUnitController::class, 'store'])->name('units.store');
        Route::get('/units/add', [AdminUnitController::class, 'create'])->name('units.create');
        Route::get('/units/{unit}/edit', [AdminUnitController::class, "edit"])->name('units.edit');
        Route::put('/units/{unit}', [AdminUnitController::class, "update"])->name('units.update');
        Route::delete('/units/{unit}', [AdminUnitController::class, "destroy"])->name('units.destroy');

        Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
        Route::get('/categories/add', [AdminCategoryController::class, 'create'])->name('categories.create');
        Route::get('/categories/{category}/edit', [AdminCategoryController::class, "edit"])->name('categories.edit');
        Route::put('/categories/{category}', [AdminCategoryController::class, "update"])->name('categories.update');
        Route::delete('/categories/{category}', [AdminCategoryController::class, "destroy"])->name('categories.destroy');

        Route::get('/vehicle-brands', [AdminVehicleBrandController::class, 'index'])->name('vehicle-brands.index');
        Route::post('/vehicle-brands', [AdminVehicleBrandController::class, 'store'])->name('vehicle-brands.store');
        Route::get('/vehicle-brands/add', [AdminVehicleBrandController::class, 'create'])->name('vehicle-brands.create');
        Route::get('/vehicle-brands/{vehicleBrand}/edit', [AdminVehicleBrandController::class, "edit"])->name('vehicle-brands.edit');
        Route::put('/vehicle-brands/{vehicleBrand}', [AdminVehicleBrandController::class, "update"])->name('vehicle-brands.update');
        Route::delete('/vehicle-brands/{vehicleBrand}', [AdminVehicleBrandController::class, "destroy"])->name('vehicle-brands.destroy');

        Route::get('/vehicle-variants', [AdminVehicleVariantController::class, 'index'])->name('vehicle-variants.index');
        Route::post('/vehicle-variants', [AdminVehicleVariantController::class, 'store'])->name('vehicle-variants.store');
        Route::get('/vehicle-variants/add', [AdminVehicleVariantController::class, 'create'])->name('vehicle-variants.create');
        Route::get('/vehicle-variants/{vehicleVariant}/edit', [AdminVehicleVariantController::class, "edit"])->name('vehicle-variants.edit');
        Route::put('/vehicle-variants/{vehicleVariant}', [AdminVehicleVariantController::class, "update"])->name('vehicle-variants.update');
        Route::delete('/vehicle-variants/{vehicleVariant}', [AdminVehicleVariantController::class, "destroy"])->name('vehicle-variants.destroy');

        Route::get('/services', [AdminServiceController::class, 'index'])->name('services.index');
        Route::post('/services', [AdminServiceController::class, 'store'])->name('services.store');
        Route::get('/services/add', [AdminServiceController::class, 'create'])->name('services.create');
        Route::get('/services/{service}/edit', [AdminServiceController::class, "edit"])->name('services.edit');
        Route::put('/services/{service}', [AdminServiceController::class, "update"])->name('services.update');
        Route::delete('/services/{service}', [AdminServiceController::class, "destroy"])->name('services.destroy');

        Route::redirect('settings', '/settings/profile');

        Route::get('/settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/settings/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::get('/settings/password', [PasswordController::class, 'edit'])->name('password.edit');
        Route::put('/settings/password', [PasswordController::class, 'update'])->name('password.update');

        Route::get('/settings/appearance', function () {
            return Inertia::render('settings/appearance');
        })->name('appearance');

        Route::post('/logout', [AdminLoginController::class, 'logout'])->name('logout');
    });

    Route::get('/login', [AdminLoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AdminLoginController::class, 'login']);

    Route::get('/register', [AdminRegisterController::class, 'create'])->name('register');
    Route::post('/register', [AdminRegisterController::class, 'store']);


});

require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
require __DIR__.'/user.php';
