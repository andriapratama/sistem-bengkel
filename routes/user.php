<?php

use App\Http\Controllers\User\ContactController;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\User\UserLoginController;
use App\Http\Controllers\User\UserProductController;
use App\Http\Controllers\User\UserRegisterController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('login', [UserLoginController::class, 'index'])->name('login.index');

Route::get('register', [UserRegisterController::class, 'create'])->name('register.create');

Route::get('contact', [ContactController::class, 'index'])->name('contact.index');

Route::get('products', [UserProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [UserProductController::class, 'detail'])->name('product.detail');



