<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;


class AdminOrderController extends Controller
{
    public function index(){
        return Inertia::render('admin/orders/index');
    }

    public function detail($id){
        return Inertia::render('admin/orders/detail');
    }
}
