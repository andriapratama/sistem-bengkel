<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceOrder;
use App\Models\ServiceOrderDetail;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminMechanicJobController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/mechanic-jobs/index');
    }

    public function getAll(Request $request)
    {   
        $date = $request->query('service_date');
        $status = $request->query('status');
        $paymentStatus = $request->query('payment_status');
        $serviceType = $request->query('service_type');
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);

        $serviceOrders = ServiceOrder::with(['user', 'vehicle.vehicleVariant'])
            ->when($date, function ($query) use ($date) {
                $query->where('service_date', $date);
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($paymentStatus, function ($query) use ($paymentStatus) {
                $query->where('payment_status', $paymentStatus);
            })
            ->when($serviceType, function ($query) use ($serviceType) {
                $query->where('service_type', $serviceType);
            })
            ->orderBy('queue_number', 'asc')
            ->paginate($limit, ['*'], 'page', $page);
        
        return response()->json([
            'success' => true, 
            'message' => 'Get all service orders',
            'serviceOrders' => $serviceOrders,
        ], 200);
    }

    public function detail($id)
    {
        return Inertia::render('admin/mechanic-jobs/detail', [
            'id' => $id
        ]);
    }

    public function getOneById($id)
    {   
        $serviceOrder = ServiceOrder::with(['user', 'vehicle.vehicleVariant.vehicleBrand', 'serviceOrderDetails.service'])
            ->where('id', $id)->firstOrFail();
        
        return response()->json([
            'success' => true, 
            'message' => 'Get one service order by id',
            'serviceOrder' => $serviceOrder,
        ], 200);
    }

    public function storeService(Request $request)
    {
        $validated = $request->validate([
            'service_order_id' => ['required', 'exists:service_orders,id'],
            'service_id' => ['required', 'exists:services,id'],
        ]);

        $service = Service::where('id', $validated['service_id'])->firstOrFail();

        $validated['name'] = $service->name;

        ServiceOrderDetail::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Service added successfully.',
        ], 200);
    }

    public function destroyService($id)
    {
        $detail = ServiceOrderDetail::find($id);

        if (!$detail) {
            return response()->json([
                'status' => false,
                'message' => 'Service order detail not found.',
            ], 404);
        }

        $detail->delete();

        return response()->json([
            'status' => true,
            'message' => 'Service order detail deleted.',
        ], 200);
    }
}
