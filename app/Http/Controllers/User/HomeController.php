<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(){
        $products = Product::limit(8)->orderBy('created_at', 'asc')->get();
        $products->transform(function ($item) {
            $item->image_url = $item->image ? Storage::url($item->image) : null;
            return $item;
        });

        $bestSeller = Product::limit(4)->orderBy('name', 'desc')->get();
        $bestSeller->transform(function ($item) {
            $item->image_url = $item->image ? Storage::url($item->image) : null;
            return $item;
        });

        $categories = Category::limit(8)->get();

        return Inertia::render('user/pages/home/index', [
            'products' => $products,
            'bestSeller' => $bestSeller,
            'categories' => $categories,
            'success' => session('success'),
        ]);
    }
}
