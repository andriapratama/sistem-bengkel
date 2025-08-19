<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('user/pages/contact/index', []);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'string'],
            'phone' => ['required', 'string'],
            'message' => ['required', 'string'],
        ]);

        Message::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Message sended',
        ], 200);
    }
}
