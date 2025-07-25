<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserProductController extends Controller
{
     public function index()
    {
        return Inertia::render('user/pages/products/index');
    }

    public function detail($slug)
    {
        // $product = Product::where('slug', $slug)->firstOrFail();

        // return Inertia::render('Product/Show', [
        //     'product' => $product
        // ]);

        return Inertia::render('user/pages/products/detail/index');
    }

}
