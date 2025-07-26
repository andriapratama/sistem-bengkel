<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(){
        return Inertia::render('user/pages/payment/index', []);
    }

    public function success(){
        return Inertia::render('user/pages/payment/success/index', []);
    }
}
