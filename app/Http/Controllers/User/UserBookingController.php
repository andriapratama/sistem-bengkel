<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserBookingController extends Controller
{
    public function index()
    {
        return Inertia::render('user/pages/booking/index');
    }

   public function getAllServices()
    {
        $services = Service::orderBy('name')->get();

        return response()->json([
            'success' => true,
            'message' => 'Get all services',
            'services' => $services,
        ]);
    }
}
