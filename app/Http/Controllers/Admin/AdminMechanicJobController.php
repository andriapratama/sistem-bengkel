<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Service;
use App\Models\ServiceOrder;
use App\Models\ServiceOrderDetail;
use App\Models\ServiceOrderDetailProduct;
use App\Models\BookingService;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

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
        $serviceOrder = ServiceOrder::with(['user', 'vehicle.vehicleVariant.vehicleBrand', 'serviceOrderDetails.service', 'serviceOrderDetailProducts'])
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

    public function updateService(Request $request, $id)
    {
        $detail = ServiceOrderDetail::find($id);

        if (!$detail) {
            return response()->json([
                'status' => false,
                'message' => 'Service order detail not found.',
            ], 404);
        }

        $validated = $request->validate([
            'price' => ['required', 'numeric'],
        ]);

        $detail->update([
            'price' => $validated['price'],
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Service order detail updated.',
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

    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'service_order_id' => ['required', 'exists:service_orders,id'],
            'product_id' => ['required', 'exists:products,id'],
        ]);

        $product = Product::where('id', $validated['product_id'])->firstOrFail();

        $validated['name'] = $product->name;
        $validated['price'] = $product->price;
        $validated['quantity'] = 1;
        $validated['sub_total'] = $product->price * 1;

        ServiceOrderDetailProduct::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Product added successfully.',
        ], 200);
    }

    public function updateProduct(Request $request, $id)
    {
        $detail = ServiceOrderDetailProduct::find($id);

        if (!$detail) {
            return response()->json([
                'status' => false,
                'message' => 'Service order detail product not found.',
            ], 404);
        }

        $validated = $request->validate([
            'type' => ['required', 'string'],
        ]);

        if ($validated['type'] === 'increase') {
            $quantity = $detail->quantity + 1;
            $detail->update([
                'quantity' => $quantity,
                'sub_total' => $detail->price * $quantity
            ]);
        } else {
            $quantity = $detail->quantity - 1;
            $detail->update([
                'quantity' => $quantity,
                'sub_total' => $detail->price * $quantity
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Service order detail product updated.',
        ], 200);
    }


    public function destroyProduct($id)
    {
        $detail = ServiceOrderDetailProduct::find($id);

        if (!$detail) {
            return response()->json([
                'status' => false,
                'message' => 'Service order detail not found.',
            ], 404);
        }

        $detail->delete();

        return response()->json([
            'status' => true,
            'message' => 'Service order detail product deleted.',
        ], 200);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(['processing', 'completed', 'canceled'])],
        ]);

        $serviceOrder = ServiceOrder::with(['serviceOrderDetails', 'serviceOrderDetailProducts'])->find($id);

        if (!$serviceOrder) {
            return response()->json([
                'status' => false,
                'message' => 'Service order not found.',
            ], 404);
        }

        $serviceOrder->update([
            'status' => $validated['status'],
        ]);

        $booking = BookingService::find($serviceOrder->booking_service_id);

        if ($booking) {
            $booking->update([
                'status' => $validated['status'],
            ]);
        }

        if ($validated['status'] === 'canceled') {
            $vehicle = Vehicle::findOrFail($booking->vehicle_id);
            $vehicle->update([
                'status_booking' => false,
            ]);

            $queueNumber = $booking->queue_number;
            $date = $booking->date_booking;
            $bookings = BookingService::where('date_booking', $date)
                ->whereNot('status', 'canceled')
                ->where('queue_number', '>', $queueNumber)
                ->orderBy('queue_number', 'asc')
                ->get();

            foreach ($bookings as $bk) {
                $startTime = Carbon::parse($bk->estimated_service_start)->subMinutes($booking->estimated_service_duration + 5);
                $minutes = $startTime->minute;
                $remainder = $minutes % 5;
                if ($remainder > 0) {
                    $startTime->addMinutes(5 - $remainder);
                }
                $startTime->second(0);

                $endTime = $startTime->copy()->addMinutes($bk->estimated_service_duration);

                $bk->update([
                    'estimated_service_start' => $startTime,
                    'estimated_service_end' => $endTime,
                ]);
            }
        }

        if ($validated['status'] === 'completed') {
            $vehicle = Vehicle::findOrFail($booking->vehicle_id);
            $vehicle->update([
                'status_booking' => false,
                'last_service_date' => now()
            ]);

            $grandTotal = 0;

            if ($serviceOrder->serviceOrderDetails->isNotEmpty()) {
                foreach ($serviceOrder->serviceOrderDetails as $service) {
                    $grandTotal += $service->price;
                }
            }

            if ($serviceOrder->serviceOrderDetailProducts->isNotEmpty()) {
                foreach ($serviceOrder->serviceOrderDetailProducts as $product) {
                    $grandTotal += $product->sub_total;
                }
            }

            $serviceOrder->update([
                'grand_total' => $grandTotal,
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Service order updated.',
        ], 200);
    }
}
