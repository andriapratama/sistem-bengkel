<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminBankController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/banks/index');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_name' => ['required', 'string'],
            'name' => ['required', 'string'],
            'number' => ['required', 'string'],
            'status' => ['required', 'boolean'],
        ]);

        Bank::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Bank created successfully',
        ], 200);
    }

    public function getAll(Request $request)
    {
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);

        $banks = Bank::orderBy('name', 'asc')
            ->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'message' => 'Get all Banks.',
            'data' => $banks,
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'user_name' => ['required', 'string'],
            'name' => ['required', 'string'],
            'number' => ['required', 'string'],
            'status' => ['required', 'boolean'],
        ]);

        $bank = Bank::find($id);

        if (!$bank) {
            return response()->json([
                'status' => false,
                'message' => 'Bank not found.',
            ], 400);
        }

        $bank->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Bank updated successfully',
        ], 200);
    }

    public function destroy($id)
    {
        $bank = Bank::find($id);

        if (!$bank) {
            return response()->json([
                'status' => false,
                'message' => 'Bank not found.',
            ], 400);
        }

        $bank->delete();

        return response()->json([
            'status' => true,
            'message' => 'Bank deleted successfully',
        ], 200);
    }
}
