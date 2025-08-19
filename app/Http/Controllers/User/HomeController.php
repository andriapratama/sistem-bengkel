<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\HomePage;
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
            'success' => session('success'),
        ]);
    }

    public function getHomePage()
    {
        $homePage = HomePage::first();

        if (!$homePage) {
            return response()->json([
                'status' => false,
                'message' => 'Home page not found.',
            ], 400);
        }

        return response()->json([
            'status' => true,
            'message' => 'Get home page data',
            'data' => $homePage
        ], 200);
    }

    public function getCategories()
    {
        $categories = Category::limit(8)->get();

        return response()->json([
            'status' => true,
            'message' => 'Get 8 categories data',
            'data' => $categories
        ], 200);
    }

    public function getAllCategories()
    {
        $categories = Category::get();

        return response()->json([
            'status' => true,
            'message' => 'Get all categories data',
            'data' => $categories
        ], 200);
    }

    public function getAllProducts(Request $request)
    {
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);
        $search = $request->query('search');
        $category = $request->query('category');

        $categories = Category::where('slug', $category)->first();

        $products = Product::with(['variants'])
            ->when($search, function ($query) use ($search) {
                $query->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%']);
            })
            ->when($categories, function ($query) use ($categories) {
                $query->where('category_id', $categories->id);
            })
            ->orderBy('name', 'asc')
            ->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'message' => 'Get all products',
            'products' => $products,
        ]);
    }
}
