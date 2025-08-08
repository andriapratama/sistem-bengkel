<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\BookingService;



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
        $booking = BookingService::with(['user', 'vehicle.vehicleVariant'])
            ->where('id', $id)->firstOrFail();

        return response()->json([
            'success' => true,
            'message' => 'Get one booking by id',
            'booking' => $booking,
        ]);
    }
}
