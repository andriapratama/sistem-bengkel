<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Cart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index(){
        $user = Auth::user();
        
        $carts = Cart::with(['product'])
            ->where('user_id', $user->id)
            ->get();

        return Inertia::render('user/pages/cart/index', [
            'carts' => $carts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0'],
            'product_id' => ['required', 'exists:products,id'],
            'variant_id' => ['nullable', 'exists:variants,id'],
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $existingCart = Cart::where('product_id', $validated['product_id'])
            ->where('user_id', $validated['user_id'])
            ->when($validated['variant_id'], function ($query, $variantId) {
                $query->where('variant_id', $variantId);
            }, function ($query) {
                $query->whereNull('variant_id');
            })
            ->first();

        if ($existingCart) {
            $existingCart->quantity += $validated['quantity'];
            $existingCart->save();
        } else {
            Cart::create($validated);
        }

       return response()->json(['success' => true, 'message' => 'Product added to cart']);
    }
}
