<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Service;
use App\Models\BookingService;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class UserBookingController extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }
        
        return Inertia::render('user/pages/booking/index');
    }

    public function getAllServices()
    {
        $services = Service::orderBy('name', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Get all services',
            'services' => $services,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'vehicle_id' => 'required|exists:vehicles,id',
            'services' => 'required|array',
            'services.*' => 'exists:services,id',
            'estimated_duration' => 'nullable|integer',
            'estimated_price' => 'nullable|numeric',
            'note' => 'nullable|string|max:255'
        ]);

        $user = Auth::user();

        $booking = BookingService::where('date_booking', Carbon::parse($validated['date'])->toDateString())
                    ->whereNot('status', 'canceled')
                    ->latest()
                    ->first();


        if ($booking) {
            $startTime = Carbon::parse($booking->estimated_service_end)->addMinutes(5);
            $minutes = $startTime->minute;
            $remainder = $minutes % 5;
            if ($remainder > 0) {
                $startTime->addMinutes(5 - $remainder);
            }
            $startTime->second(0);

            $endTime = $startTime->copy()->addMinutes($validated['estimated_duration']);

            $validated['queue_number'] = $booking->queue_number + 1;
            $validated['estimated_service_start'] = $startTime;
            $validated['estimated_service_end'] = $endTime;
        } else {
            $startTime = Carbon::parse($validated['date'])->setTime(8, 0);

            $minutes = $startTime->minute;
            $remainder = $minutes % 5;
            if ($remainder > 0) {
                $startTime->addMinutes(5 - $remainder);
            }
            $startTime->second(0);

            $endTime = $startTime->copy()->addMinutes($validated['estimated_duration']);

            $validated['queue_number'] = 1;
            $validated['estimated_service_start'] = $startTime;
            $validated['estimated_service_end'] = $endTime;
        }


        $newBooking = BookingService::create([
            'date_booking' => Carbon::parse($validated['date'])->toDateString(),
            'user_id' => $user->id,
            'vehicle_id' => $validated['vehicle_id'],
            'queue_number' => $validated['queue_number'],
            'estimated_service_duration' => $validated['estimated_duration'],
            'estimated_service_price' => $validated['estimated_price'],
            'estimated_service_start' => $validated['estimated_service_start'],
            'estimated_service_end' => $validated['estimated_service_end'],
            'status' => 'pending',
            'note' => $validated['note'] ?? null,
        ]);

        if (is_array($validated['services'])) {
            foreach ($validated['services'] as $service) {
                $newBooking->bookingServiceDetail()->create([
                    'booking_service_id' => $newBooking->id,
                    'service_id' => $service ?? null,
                ]);
            }
        }

        $vehicle = Vehicle::where('id', $validated['vehicle_id'])->firstOrFail();
        $vehicle->update([
            'status_booking' => true,
        ]);

        return response()->json([
            'message' => 'Booking created successfully',
            'data' => $newBooking
        ], 201);
    }

    public function getAll($date)
    {
        $bookings = BookingService::orderBy('queue_number', 'asc')
            ->where('date_booking', $date)
            ->whereNot('status', 'canceled')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Get all bookings',
            'bookings' => $bookings,
        ]);
    }

    public function getOneByUser()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthentication'
            ], 400);
        }

        $bookings = BookingService::with(['vehicle.vehicleVariant', 'bookingServiceDetail'])
            ->orderBy('created_at', 'asc')
            ->where('user_id', $user->id)
            ->whereNot('status', 'canceled')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Get all bookings',
            'bookings' => $bookings,
        ]);
    }

    public function cancel($id)
    {
        $booking = BookingService::where('id', $id)->firstOrFail();
        $booking->update([
            'status' => 'canceled',
        ]);

        $vehicle = Vehicle::where('id', $booking->vehicle_id)->firstOrFail();
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

        return response()->json([
            'success' => true,
            'message' => 'Booking canceled.',
        ], 200);
    }
}
