<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class UserProductController extends Controller
{
     public function index()
    {
        $products = Product::orderBy('created_at', 'desc')->paginate(10);

        $products->getCollection()->transform(function ($item) {
            $item->image_url = $item->image ? Storage::url($item->image) : null;
            return $item;
        });

        return Inertia::render('user/pages/products/index', [
            'products' => $products,
        ]);
    }

    public function detail($slug)
    {
        // $product = Product::where('slug', $slug)->firstOrFail();

        // return Inertia::render('Product/Show', [
        //     'product' => $product
        // ]);

        $reccomendations = Product::limit(5)->orderBy('name', 'desc')->get();
        $reccomendations->transform(function ($item) {
            $item->image_url = $item->image ? Storage::url($item->image) : null;
            return $item;
        });

        return Inertia::render('user/pages/products/detail/index', [
            'reccomendations' => $reccomendations
        ]);
    }

}
