<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Unit;
use App\Models\Variant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class AdminProductController extends Controller
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
            'category_id' => (int) $request->input('category_id'),
            'unit_id' => (int) $request->input('unit_id'),
            'status' => filter_var($request->input('status'), FILTER_VALIDATE_BOOLEAN),
            'hasVariant' => filter_var($request->input('hasVariant'), FILTER_VALIDATE_BOOLEAN),
            'stock' => (int) $request->input('stock'),
            'cost' => (float) $request->input('cost'),
            'price' => (float) $request->input('price'),
        ]);

        $variants = $request->input('variants');
        if ($variants && is_array($variants)) {
            $normalizedVariants = array_map(function ($variant) {
                return [
                    'name' => $variant['name'] ?? '',
                    'stock' => isset($variant['stock']) ? (int) $variant['stock'] : 0,
                    'cost' => isset($variant['cost']) ? (float) $variant['cost'] : 0,
                    'price' => isset($variant['price']) ? (float) $variant['price'] : 0,
                ];
            }, $variants);

            $request->merge([
                'variants' => $normalizedVariants,
            ]);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:products,slug'],
            'description' => ['nullable', 'string'],
            'stock' => ['required', 'integer', 'min:0'],
            'cost' => ['required', 'numeric', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'status' => ['required', 'boolean'],
            'hasVariant' => ['required', 'boolean'],
            'category_id' => ['required', 'exists:categories,id'],
            'unit_id' => ['required', 'exists:units,id'],
            'variants' => ['nullable', 'array'],
            'variants.*.name' => ['nullable', 'string'],
            'variants.*.stock' => ['nullable', 'numeric'],
            'variants.*.cost' => ['nullable', 'numeric'],
            'variants.*.price' => ['nullable', 'numeric'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($validated);

        if (is_array($variants)) {
            foreach ($variants as $variant) {
                $product->variants()->create([
                    'product_id' => $product->id,
                    'name' => $variant['name'] ?? null,
                    'stock' => $variant['stock'] ?? 0,
                    'cost' => $variant['cost'] ?? 0,
                    'price' => $variant['price'] ?? 0,
                ]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
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
            'category_id' => (int) $request->input('category_id'),
            'unit_id' => (int) $request->input('unit_id'),
            'status' => filter_var($request->input('status'), FILTER_VALIDATE_BOOLEAN),
            'hasVariant' => filter_var($request->input('hasVariant'), FILTER_VALIDATE_BOOLEAN),
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
            'hasVariant' => ['required', 'boolean'],
            'category_id' => ['required', 'exists:categories,id'],
            'unit_id' => ['required', 'exists:units,id'],
        ]);

        $product->update($validated);

        return redirect()->route('admin.products.index')->with([
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

        return redirect()->route('admin.products.index')->with([
            'success' => 'Image product updated successfully.',
            'updated_product' => $product,
        ]);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with([
            'success' => 'Product deleted successfully.',
        ]);
    }
}
