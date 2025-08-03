<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserMyOrderController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        return Inertia::render('user/pages/my-order/index');
    }

    public function getAll(Request $request)
    {
        $user = Auth::user();

        $status = $request->query('shipping_status');

        $transaction = Transaction::with(['user', 'transactionItems.product'])
            ->where('user_id', $user->id)
            ->when($status !== 'all', function ($query) use ($status) {
                $query->where('shipping_status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true, 
            'message' => 'Get all transaction',
            'transaction' => $transaction,
        ]);
    }

    public function detail($invoice)
    {
        $user = Auth::user();

        $transaction = Transaction::with(['user', 'transactionItems.product'])
            ->where('invoice_number', $invoice)
            ->firstOrFail();

        if ($user->id !== $transaction->user_id) {
            return redirect()->route('home');
        }

        return Inertia::render('user/pages/my-order/detail/index', [
            'transaction' => $transaction
        ]);
    }
}
