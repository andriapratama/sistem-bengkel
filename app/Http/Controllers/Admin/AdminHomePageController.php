<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\HomePage;
use Illuminate\Support\Facades\Storage;


class AdminHomePageController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/home-page/index');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'hero' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        $homePage = HomePage::find($id);

        if (!$homePage) {
            return response()->json([
                'status' => false,
                'message' => 'Home page not found.',
            ], 400);
        }

        if ($request->hasFile('hero')) {
            $validated['hero'] = $request->file('hero')->store('heros', 'public');
        }

        $homePage->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Home page updated successfully',
        ], 200);
    }
}
