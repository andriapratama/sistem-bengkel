<?php

namespace App\Http\Controllers;

use App\Models\VehicleBrand;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VehicleBrandController extends Controller
{
    public function index(){
        $vehicleBrands = VehicleBrand::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('admin/vehicle-brands/index', [
            'vehicleBrands' => $vehicleBrands,
            'success' => session('success'),
        ]);
    }

    public function create(){
        return Inertia::render('admin/vehicle-brands/create', []);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:vehicle_brands,name',
        ]);

        VehicleBrand::create($validated);

        return redirect()->route('vehicle-brands.index')->with('success', 'Vehicle brand created successfully.');
    }

    public function edit(VehicleBrand $vehicleBrand){
        return Inertia::render('admin/vehicle-brands/edit', [
        'vehicleBrand' => $vehicleBrand
        ]);
    }

    public function update(Request $request, VehicleBrand $vehicleBrand)
    {
        $validated = $request->validate([
            'name' => [
                'required', 
                'string', 
                Rule::unique('vehicle_brands', 'name')->ignore($vehicleBrand->id),],
        ]);

        $vehicleBrand->update($validated);

        return redirect()->route('vehicle-brands.index')->with([
            'success' => 'Vehicle brand updated successfully.',
            'updated_brand' => $vehicleBrand,
        ]);
    }

    public function destroy(VehicleBrand $vehicleBrand)
    {
        $vehicleBrand->delete();

        return redirect()->route('vehicle-brands.index')->with([
            'success' => 'Vehicle brand deleted successfully.',
        ]);
    }
}
