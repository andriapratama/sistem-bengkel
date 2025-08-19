<?php

use App\Http\Controllers\User\BillingDetailController;
use App\Http\Controllers\User\CartController;
use App\Http\Controllers\User\ContactController;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\User\PaymentController;
use App\Http\Controllers\User\UserBookingController;
use App\Http\Controllers\User\UserLoginController;
use App\Http\Controllers\User\UserProductController;
use App\Http\Controllers\User\UserProfileController;
use App\Http\Controllers\User\UserRegisterController;
use App\Http\Controllers\User\UserMyOrderController;
use App\Http\Controllers\User\UserVehicleController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/get-home-page', [HomeController::class, 'getHomePage'])->name('home.getHomePage');
Route::get('/get-categories', [HomeController::class, 'getCategories'])->name('home.getCategories');
Route::get('/get-all-categories', [HomeController::class, 'getAllCategories'])->name('home.getAllCategories');
Route::get('/get-all-products', [HomeController::class, 'getAllProducts'])->name('home.getAllProducts');

Route::get('/login', [UserLoginController::class, 'index'])->name('login');
Route::post('/login', [UserLoginController::class, 'login'])->name('login');
Route::post('/logout', [UserLoginController::class, 'logout'])->name('logout');


Route::get('/register', [UserRegisterController::class, 'create'])->name('register.create');
Route::post('/register', [UserRegisterController::class, 'store'])->name('register.store');

Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::get('/products', [UserProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [UserProductController::class, 'detail'])->name('product.detail');

Route::get('/carts', [CartController::class, 'index'])->name('carts.index');
Route::post('/carts', [CartController::class, 'store'])->name('carts.store');
Route::put('/carts/{cart}', [CartController::class, 'update'])->name('carts.update');

Route::get('/billing-detail', [BillingDetailController::class, 'index'])->name('billing-detail.index');
Route::post('/billing-detail', [BillingDetailController::class, 'store'])->name('billing-detail.store');

Route::get('/payment/success', [PaymentController::class, 'success'])->name('payment.success');
Route::get('/payment/{invoice}', [PaymentController::class, 'index'])->name('payment.index');
Route::post('/payment/{invoice}', [PaymentController::class, 'store'])->name('payment.store');

Route::get('/profile', [UserProfileController::class, 'index'])->name('profile.index');
Route::put('/profile/{user}', [UserProfileController::class, 'update'])->name('profile.update');

Route::get('/my-orders', [UserMyOrderController::class, 'index'])->name('my-orders.index');
Route::get('/my-orders/get-all', [UserMyOrderController::class, 'getAll'])->name('my-orders.getAll');
Route::get('/my-orders/{invoice}', [UserMyOrderController::class, 'detail'])->name('my-orders.detail');

Route::get('/vehicles', [UserVehicleController::class, 'index'])->name('vehicles.index');
Route::get('/vehicles/create', [UserVehicleController::class, 'create'])->name('vehicles.create');
Route::get('/vehicles/get-all', [UserVehicleController::class, 'getAll'])->name('vehicles.getAll');
Route::get('/vehicles/get-all/vehicle-brands', [UserVehicleController::class, 'getAllVehicleBrands'])->name('vehicles.getAllVehicleBrands');
Route::post('/vehicles', [UserVehicleController::class, 'store'])->name('vehicles.store');

Route::get('/booking', [UserBookingController::class, 'index'])->name('booking.index');
Route::post('/booking', [UserBookingController::class, 'store'])->name('booking.store');
Route::get('/booking/get-one', [UserBookingController::class, 'getOneByUser'])->name('booking.getOneByUser');
Route::get('/booking/get-all/{date}', [UserBookingController::class, 'getAll'])->name('booking.getAll');
Route::get('/booking/services', [UserBookingController::class, 'getAllServices'])->name('booking.getAllServices');
Route::put('/booking/cancel/{id}', [UserBookingController::class, 'cancel'])->name('booking.cancel');


