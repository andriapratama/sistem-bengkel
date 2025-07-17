<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;


class ProductController extends Controller
{
   public function index(){
        $products = Product::with(['category', 'unit'])
        ->orderBy('created_at', 'desc')
        ->paginate(10);

        $products->getCollection()->transform(function ($item) {
            $item->image_url = $item->image ? Storage::url($item->image) : null;
            return $item;
        });

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'success' => session('success'),
        ]);
    }

    public function create(){
        $category = Category::all();
        $unit = Unit::all();
        
        return Inertia::render('admin/products/create', [
            'categories' => $category,
            'units' => $unit,
        ]);
    }

    public function store(Request $request)
    {
        $request->merge([
            'categoryId' => (int) $request->input('categoryId'),
            'unitId' => (int) $request->input('unitId'),
            'status' => filter_var($request->input('status'), FILTER_VALIDATE_BOOLEAN),
            'stock' => (int) $request->input('stock'),
            'cost' => (float) $request->input('cost'),
            'price' => (float) $request->input('price'),
        ]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:products,slug'],
            'description' => ['nullable', 'string'],
            'stock' => ['required', 'integer', 'min:0'],
            'cost' => ['required', 'numeric', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'status' => ['required', 'boolean'],
            'categoryId' => ['required', 'exists:categories,id'],
            'unitId' => ['required', 'exists:units,id'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        Product::create($validated);

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product){
        $category = Category::all();
        $unit = Unit::all();

        $product->image_url = $product->image ? Storage::url($product->image) : null;

        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'categories' => $category,
            'units' => $unit,
        ]);
    }

    public function update(Request $request, Product $product)
    {
         $request->merge([
            'categoryId' => (int) $request->input('categoryId'),
            'unitId' => (int) $request->input('unitId'),
            'status' => filter_var($request->input('status'), FILTER_VALIDATE_BOOLEAN),
            'stock' => (int) $request->input('stock'),
            'cost' => (float) $request->input('cost'),
            'price' => (float) $request->input('price'),
        ]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('products', 'slug')->ignore($product->id),],
            'description' => ['nullable', 'string'],
            'stock' => ['required', 'integer', 'min:0'],
            'cost' => ['required', 'numeric', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'boolean'],
            'categoryId' => ['required', 'exists:categories,id'],
            'unitId' => ['required', 'exists:units,id'],
        ]);

        $product->update($validated);

        return redirect()->route('products.index')->with([
            'success' => 'Product updated successfully.',
            'updated_product' => $product,
        ]);
    }

    public function editImage(Product $product){
        $product->image_url = $product->image ? Storage::url($product->image) : null;

        return Inertia::render('admin/products/edit-image', [
            'product' => $product,
        ]);
    }

    public function updateImage(Request $request, Product $product)
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        $validated['image'] = $request->file('image')->store('products', 'public');

        $product->update($validated);

        return redirect()->route('products.index')->with([
            'success' => 'Image product updated successfully.',
            'updated_product' => $product,
        ]);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')->with([
            'success' => 'Product deleted successfully.',
        ]);
    }
}
