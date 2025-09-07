<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceOrder;
use App\Models\ServiceOrderDetail;
use App\Models\ServiceOrderDetailProduct;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function getAll(Request $request)
    {
        $startDate = Carbon::parse($request->query('start-date'))->startOfDay();
        $endDate   = Carbon::parse($request->query('end-date'))->endOfDay();

        $totalTransactions = Transaction::whereBetween('created_at', [$startDate, $endDate])->count();
        $totalAmountTransaction = Transaction::whereBetween('created_at', [$startDate, $endDate])->sum('grand_total');

        $totalServices = ServiceOrder::whereBetween('created_at', [$startDate, $endDate])->where('payment_status', 'paid')->count();
        $totalAmountService = ServiceOrder::whereBetween('created_at', [$startDate, $endDate])->where('payment_status', 'paid')->sum('grand_total');
        
        $topProducts = TransactionItem::select('product_id', DB::raw('SUM(quantity) as total_sold'))
            ->whereHas('transaction', function ($q) use ($startDate, $endDate) {
                $q->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->with('product:id,name')
            ->take(10)
            ->get();

        $topServices = ServiceOrderDetail::select('service_id', DB::raw('COUNT(*) as total_used'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('service_id')
            ->orderByDesc('total_used')
            ->take(10)
            ->with('service:id,name')
            ->get();

         $topServiceProducts = ServiceOrderDetailProduct::select('product_id', DB::raw('SUM(quantity) as total_sold'))
            ->whereHas('serviceOrder', function ($q) use ($startDate, $endDate) {
                $q->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->with('product:id,name')
            ->take(10)
            ->get();

        $totalTransactionPerPayment = Transaction::select('payment_method', DB::raw('COUNT(*) as total_transactions'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('payment_method')
            ->get();

        $totalServicePerType = ServiceOrder::select('service_type', DB::raw('COUNT(*) as total_service'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('service_type')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Get all dashboard data',
            'totalTransactions' => $totalTransactions,
            'totalAmountTransaction' => $totalAmountTransaction,
            'totalServices' => $totalServices,
            'totalAmountService' => $totalAmountService,
            'topProducts' => $topProducts,
            'topServices' => $topServices,
            'topServiceProducts' => $topServiceProducts,
            'totalTransactionPerPayment' => $totalTransactionPerPayment,
            'totalServicePerType' => $totalServicePerType,
        ]);
    }
}
