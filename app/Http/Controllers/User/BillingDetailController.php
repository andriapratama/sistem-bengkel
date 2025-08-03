<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Cart;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;


class BillingDetailController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $carts = Cart::with(['product', 'variant'])
            ->where('user_id', $user->id)
            ->where('checked', true)
            ->get();

        if ($carts->isEmpty()) {
            return redirect()->route('carts.index');
        }

        return Inertia::render('user/pages/billing-detail/index', [
            'carts' => $carts
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $validated = $request->validate([
            'payment_method' => ['required', 'string', Rule::in(['bank_transfer', 'ewallet', 'cod'])],
        ]);

        $carts = Cart::with('product')
            ->where('user_id', $user->id)
            ->where('checked', true)
            ->get();

        if ($carts->isEmpty()) {
           return redirect()->back()->with('error', 'No items selected for checkout.');
        }

        $totalPrice = $carts->sum(function ($cart) {
            return $cart->product->price * $cart->quantity;
        });

        $grandTotal = $totalPrice;
        $codeNumber = random_int(1, 200);
        $grandTotal += $codeNumber;

        $totalQuantity = $carts->sum(function ($cart) {
            return $cart->quantity;
        });

        $today = now()->format('ymd');

        $latest = Transaction::whereDate('created_at', now()->startOfDay())
            ->latest('id')
            ->first();

        $nextSequence = $latest
            ? (int)substr($latest->invoice_number, -3) + 1
            : 1;

        $invoiceNumber = 'TRS' . $today . str_pad($nextSequence, 3, '0', STR_PAD_LEFT);

       $transaction = DB::transaction(function () use ($user, $validated, $carts, $invoiceNumber, $totalPrice, $grandTotal, $totalQuantity) {
            $data = [
                'invoice_number'   => $invoiceNumber,
                'user_id'          => $user->id,
                'total_price'      => $totalPrice,
                'grand_total'      => $grandTotal,
                'total_quantity'   => $totalQuantity,
                'payment_method'   => $validated['payment_method'],
                'shipping_address' => $user->address,
            ];

            if ($validated['payment_method'] === 'cod') {
                $data['shipping_status'] = 'processing';
            } else {
                $data['shipping_status'] = 'pending';
            }

            $transaction = Transaction::create($data);

            foreach ($carts as $cart) {
                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id'     => $cart->product_id,
                    'quantity'       => $cart->quantity,
                    'price'          => $cart->product->price,
                    'subtotal'       => $cart->product->price * $cart->quantity,
                ]);

                if ($cart->variant_id) {
                    $data['variant_id'] = $cart->variant_id;
                }
            }

            Cart::where('user_id', $user->id)
                ->where('checked', true)
                ->delete();

            return $transaction;
        });


        if ($transaction->payment_method === 'cod') {
            return Inertia::location(route('payment.success'));
        } else {
            return Inertia::location(route('payment.index', [
                'invoice' => $transaction->invoice_number,
            ]));
        }
    }
}
