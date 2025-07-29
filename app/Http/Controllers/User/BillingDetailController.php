<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Cart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillingDetailController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $carts = Cart::with('product')
            ->where('user_id', $user->id)
            ->where('checked', true)
            ->get();

        return Inertia::render('user/pages/billing-detail/index', [
            'carts' => $carts
        ]);
    }
}
