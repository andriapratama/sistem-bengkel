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

    public function update(Request $request)
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'hero' => ['nullable'],
        ]);

        $homePage = HomePage::first();

        if (!$homePage) {
            return response()->json([
                'status' => false,
                'message' => 'Home page not found.',
            ], 400);
        }

        if ($request->hasFile('hero')) {
            // Hapus file lama jika ada
            if ($homePage->hero) {
                Storage::disk('public')->delete($homePage->hero);
            }

            $validated['hero'] = $request->file('hero')->store('heros', 'public');
        } else {
            $validated['hero'] = $homePage->hero;
        }

        $homePage->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Home page updated successfully',
        ], 200);
    }

    public function getOne()
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
            'message' => 'Get one home page data',
            'data' => $homePage
        ], 200);
    }
}
