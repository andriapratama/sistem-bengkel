<?php

namespace App\Http\Controllers;

use App\Models\VehicleBrand;
use App\Models\VehicleVariant;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VehicleVariantController extends Controller
{
    public function index(){
         $vehicleVariants = VehicleVariant::with(['vehicleBrand'])
        ->orderBy('created_at', 'desc')
        ->paginate(10);

        return Inertia::render('vehicle-variants/index', [
            'vehicleVariants' => $vehicleVariants,
            'success' => session('success'),
        ]);
    }

    public function create(){
        $vehicleBrands = VehicleBrand::all();

        return Inertia::render('vehicle-variants/create', [
            'vehicleBrands' => $vehicleBrands
        ]);
    }

    public function store(Request $request)
    {
        $request->merge([
            'vehicleBrandId' => (int) $request->input('vehicleBrandId'),
        ]);

        $validated = $request->validate([
            'name' => 'required|string|unique:vehicle_variants,name',
            'vehicleBrandId' => ['required', 'exists:vehicle_brands,id'],
        ]);

        VehicleVariant::create($validated);

        return redirect()->route('vehicle-variants.index')->with('success', 'Vehicle variant created successfully.');
    }

    public function edit(VehicleVariant $vehicleVariant){
        $vehicleBrands = VehicleBrand::all();

        return Inertia::render('vehicle-variants/edit', [
            'vehicleVariant' => $vehicleVariant,
            'vehicleBrands' => $vehicleBrands
        ]);
    }

    public function update(Request $request, VehicleVariant $vehicleVariant)
    {
        $validated = $request->validate([
            'name' => [
                'required', 
                'string', 
                Rule::unique('vehicle_variants', 'name')->ignore($vehicleVariant->id),],
            'vehicleBrandId' => ['required', 'exists:vehicle_brands,id'],
        ]);

        $vehicleVariant->update($validated);

        return redirect()->route('vehicle-variants.index')->with([
            'success' => 'Vehicle variant updated successfully.',
            'updated_variant' => $vehicleVariant,
        ]);
    }

    public function destroy(VehicleVariant $vehicleVariant)
    {
        $vehicleVariant->delete();

        return redirect()->route('vehicle-variants.index')->with([
            'success' => 'Vehicle variant deleted successfully.',
        ]);
    }
}
