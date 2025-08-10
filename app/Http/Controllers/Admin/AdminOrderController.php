<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminOrderController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/orders/index');
    }

    public function getAll(Request $request)
    {   
        $paymentStatus = $request->query('payment_status');
        $shippingStatus = $request->query('shipping_status');
        $paymentMethod = $request->query('payment_method');
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);

        $transaction = Transaction::with(['user'])
            ->when($paymentStatus, function ($query) use ($paymentStatus) {
                $query->where('payment_status', $paymentStatus);
            })
            ->when($shippingStatus, function ($query) use ($shippingStatus) {
                $query->where('shipping_status', $shippingStatus);
            })
            ->when($paymentMethod, function ($query) use ($paymentMethod) {
                $query->where('payment_method', $paymentMethod);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page);
        
        return response()->json([
            'success' => true, 
            'message' => 'Get all transaction',
            'transaction' => $transaction,
        ]);
    }

    public function detail($id)
    {
        return Inertia::render('admin/orders/detail', [
            'id' => $id
        ]);
    }

    public function getOneById($id)
    {   
        $transaction = Transaction::with(['user', 'transactionItems.product'])
            ->where('id', $id)->firstOrFail();
        
        return response()->json([
            'success' => true, 
            'message' => 'Get one transaction by id',
            'transaction' => $transaction,
        ]);
    }

    public function updateShippingStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'shipping_status' => ['required', 'string', Rule::in(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'])],
        ]);

        $transaction = Transaction::findOrFail($id);
        $transaction->update([
            'shipping_status' => $validated['shipping_status'],
        ]);

        return response()->json([
            'status' => true,
            'message' => "Shipping status is updated successfully."
        ]);
    }

    public function store(Request $request, $id)
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        $transaction = Transaction::where('id', $id)->firstOrFail();

        $path = $request->file('image')->store('shipping', 'public');

        $transaction->update([
            'shipping_image' => $path,    
        ]);

        return response()->json([
            'success' => 'Shipping image uploaded successfully.',
        ]);
    }
}
