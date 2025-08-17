<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ewallet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminEwalletController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/ewallets/index');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'number' => ['required', 'string'],
            'status' => ['required', 'boolean'],
        ]);

        Ewallet::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'e-Wallet created successfully',
        ], 200);
    }

    public function getAll(Request $request)
    {
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);

        $ewallets = Ewallet::orderBy('name', 'asc')
            ->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'message' => 'Get all e-wallets.',
            'data' => $ewallets,
        ], 200);
    }
}
