<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillingDetailController extends Controller
{
    public function index(){
        return Inertia::render('user/pages/billing-detail/index', []);
    }
}
