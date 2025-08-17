<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;


class AdminCashierController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/cashiers/index');
    }

    public function detail($id)
    {
        return Inertia::render('admin/cashiers/detail', [
            'id' => $id
        ]);
    }

    public function update(Request $request, $id)
    {
        if (!$id) {
            return response()->json([
                'status' => false,
                'message' => 'Id service order is reqiured.'
            ], 400);
        }

        $validated = $request->validate([
            'discount_amount' => ['nullable', 'numeric'],
            'discount_percentage' => ['nullable', 'numeric'],
            'payment_amount' => ['required', 'numeric'],
        ]);

        $serviceOrder = ServiceOrder::with(['serviceOrderDetails', 'serviceOrderDetailProducts'])->find($id);

        if (!$serviceOrder) {
            return response()->json([
                'status' => false,
                'message' => 'Service order not found.',
            ], 404);
        }

        $total = 0;

        if ($serviceOrder->serviceOrderDetails->isNotEmpty()) {
            foreach ($serviceOrder->serviceOrderDetails as $service) {
                $total += $service->price;
            }
        }

        if ($serviceOrder->serviceOrderDetailProducts->isNotEmpty()) {
            foreach ($serviceOrder->serviceOrderDetailProducts as $product) {
                $total += $product->sub_total;
            }
        }

        $discountAmount = $validated['discount_amount'] ?? 0;
        
        if ($validated['discount_percentage']) {
            $discountAmount = $total / 100 * $validated['discount_percentage'];
        }

        $grandTotal = $total - $discountAmount;
        $change = $validated['payment_amount'] - $grandTotal;

        $serviceOrder->update([
            'payment_status' => 'paid',
            'total' => $total,
            'grand_total' => $grandTotal,
            'discount_percentage' => $validated['discount_percentage'] ?? 0,
            'discount_amount' => $discountAmount,
            'payment_amount' => $validated['payment_amount'],
            'change' => $change,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Service order is payed.',
        ], 200);
    }
}
