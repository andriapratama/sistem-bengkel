<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(){
        $category = Category::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('admin/categories/index', [
            'categories' => $category,
            'success' => session('success'),
        ]);
    }

    public function create(){
        return Inertia::render('admin/categories/create', []);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'slug' => 'required|string|unique:categories,slug',
            'description' => 'nullable|string'
        ]);

        Category::create($validated);

        return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    }

    public function edit(Category $category){
        return Inertia::render('admin/categories/edit', [
        'category' => $category
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'slug' => [
                'required',
                'string',
                Rule::unique('categories', 'slug')->ignore($category->id),
            ],
            'description' => ['nullable', 'string']
        ]);

        $category->update($validated);

        return redirect()->route('categories.index')->with([
            'success' => 'Category updated successfully.',
            'updated_category' => $category,
        ]);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('categories.index')->with([
            'success' => 'Category deleted successfully.',
        ]);
    }
}
