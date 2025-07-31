<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index($invoice){
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $transaction = Transaction::with('user')->where('invoice_number', $invoice)->firstOrFail();

        if ($user->id !== $transaction->user_id) {
            return redirect()->route('home');
        }

        if ($transaction->payment_status !== 'pending') {
            return redirect()->route('home');
        }

        return Inertia::render('user/pages/payment/index', [
            'transaction' => $transaction
        ]);
    }

    public function success(){
        return Inertia::render('user/pages/payment/success/index', []);
    }

    public function store(Request $request, $invoice)
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        $transaction = Transaction::where('invoice_number', $invoice)->firstOrFail();

        $path = $request->file('image')->store('transaction', 'public');

        $transaction->update([
            'payment_image' => $path,         
            'payment_status' => 'paid',       
        ]);

        return response()->json([
            'success' => 'Product created successfully.',
        ]);
    }
}
