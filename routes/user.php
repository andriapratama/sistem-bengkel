<?php

use App\Http\Controllers\User\BillingDetailController;
use App\Http\Controllers\User\CartController;
use App\Http\Controllers\User\ContactController;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\User\PaymentController;
use App\Http\Controllers\User\UserLoginController;
use App\Http\Controllers\User\UserProductController;
use App\Http\Controllers\User\UserProfileController;
use App\Http\Controllers\User\UserRegisterController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/login', [UserLoginController::class, 'index'])->name('login');
Route::post('/login', [UserLoginController::class, 'login'])->name('login');
Route::post('/logout', [UserLoginController::class, 'logout'])->name('logout');


Route::get('/register', [UserRegisterController::class, 'create'])->name('register.create');
Route::post('/register', [UserRegisterController::class, 'store'])->name('register.store');

Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');

Route::get('/products', [UserProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [UserProductController::class, 'detail'])->name('product.detail');

Route::get('/carts', [CartController::class, 'index'])->name('carts.index');
Route::post('/carts', [CartController::class, 'store'])->name('carts.store');
Route::put('/carts/{cart}', [CartController::class, 'update'])->name('carts.update');

Route::get('/billing-detail', [BillingDetailController::class, 'index'])->name('billing-detail.index');
Route::post('/billing-detail', [BillingDetailController::class, 'store'])->name('billing-detail.store');

Route::get('/payment', [PaymentController::class, 'index'])->name('payment.index');
Route::get('/payment/success', [PaymentController::class, 'success'])->name('payment.success');

Route::get('/profile', [UserProfileController::class, 'index'])->name('profile.index');
Route::put('/profile/{user}', [UserProfileController::class, 'update'])->name('profile.update');




