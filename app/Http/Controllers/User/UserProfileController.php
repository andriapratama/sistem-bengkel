<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Models\User;


class UserProfileController extends Controller
{
    public function index()
    {
        return Inertia::render('user/pages/profile/index', [
            'success' => session('success'),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'email' => [
                'required',
                'string',
                Rule::unique('users')->ignore($user->id),
            ],
            'phone' => ['required', 'string'],
            'address' => ['required', 'string'],
        ]);

        $user->update($validated);

        return redirect()->back()->with([
            'success' => 'Profile updated successfully.',
            'updated_user' => $user,
        ]);
    }
}
