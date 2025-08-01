<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserMyOrderController extends Controller
{
    public function index()
    {
        return Inertia::render('user/pages/my-order/index');
    }

    public function detail($invoice)
    {
        return Inertia::render('user/pages/my-order/detail/index');
    }
}
