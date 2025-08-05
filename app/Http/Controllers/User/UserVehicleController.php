<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Vehicle;
use App\Models\VehicleBrand;
use App\Models\VehicleVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserVehicleController extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        return Inertia::render('user/pages/vehicles/index');
    }

    public function create()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }
        
        return Inertia::render('user/pages/vehicles/create');
    }

    public function getAllVehicleBrands()
    {
        $vehicleBrands = VehicleBrand::orderBy('name')->get();
        $vehicleVariants = VehicleVariant::orderBy('name')->get();

         return response()->json([
            'success' => true, 
            'message' => 'Get all vehicle brands dan vehicle variant',
            'vehicleBrands' => $vehicleBrands,
            'vehicleVariants' => $vehicleVariants,
        ]);
    }

    public function store(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        $validated = $request->validate([
            'vehicle_year' => 'required|string',
            'police_number' => 'required|string|unique:vehicles,police_number',
            'vehicle_variant_id' => ['nullable', 'exists:vehicle_variants,id'],
        ]);

        $validated['user_id'] = $user->id;

        Vehicle::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Vehicle added succesfully.'
        ]);
    }
}
