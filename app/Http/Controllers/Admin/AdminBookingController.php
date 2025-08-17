<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\BookingService;
use App\Models\ServiceOrder;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Validation\Rule;

class AdminBookingController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/bookings/index');
    }

    public function getAll(Request $request)
    {
        $status = $request->query('status');
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);

        $bookings = BookingService::with(['user', 'vehicle.vehicleVariant'])
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'message' => 'Get all bookings',
            'bookings' => $bookings,
        ]);
    }

    public function detail($id)
    {
        return Inertia::render('admin/bookings/detail', [
            'id' => $id
        ]);
    }

    public function getOneById($id)
    {
        $booking = BookingService::with(['user', 'vehicle.vehicleVariant.vehicleBrand', 'bookingServiceDetail.service'])
            ->where('id', $id)->firstOrFail();

        return response()->json([
            'success' => true,
            'message' => 'Get one booking by id',
            'booking' => $booking,
        ]);
    }

     public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(['pending', 'accepted', 'processing', 'completed', 'canceled'])],
        ]);

        $booking = BookingService::with(['bookingServiceDetail.service', 'vehicle.vehicleVariant'])->findOrFail($id);
        $booking->update([
            'status' => $validated['status'],
        ]);

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

        if ($validated['status'] === 'accepted') {
            $serviceDate = $booking->date_booking;
            $formattedDate = Carbon::parse($serviceDate)->format('ymd');
        
            $latest = ServiceOrder::where('service_date', $serviceDate)
                ->latest('id')
                ->first();
                
            $nextSequence = $latest
                ? (int)substr($latest->service_number, -3) + 1
                : 1;

            $serviceNumber = 'SVC' . $formattedDate . str_pad($nextSequence, 3, '0', STR_PAD_LEFT);

            $serviceOrder = ServiceOrder::create([
                'service_number' => $serviceNumber,
                'service_date' => $serviceDate,
                'queue_number' => $booking->queue_number,
                'service_type' => 'booking',
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'note' => $booking->note ?? null,
                'vehicle_year' => $booking->vehicle->vehicle_year,
                'police_number' => $booking->vehicle->police_number,
                'user_id' => $booking->user_id,
                'vehicle_id' => $booking->vehicle_id,
                'vehicle_variant_id' => $booking->vehicle->vehicleVariant->id,
                'booking_service_id' => $booking->id,
            ]);

            if ($booking->bookingServiceDetail->isNotEmpty()) {
                foreach ($booking->bookingServiceDetail as $booking_detail) {
                    $serviceOrder->serviceOrderDetails()->create([
                        'name' => $booking_detail->service->name,
                        'service_order_id' => $serviceOrder->id,
                        'service_id' => $booking_detail->service_id,
                    ]);
                }
            }
        }

        return response()->json([
            'status' => true,
            'message' => "Booking status is updated successfully."
        ]);
    }
}
