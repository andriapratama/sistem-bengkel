<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class AdminUnitController extends Controller
{
    public function index(){
        $units = Unit::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('admin/units/index', [
            'units' => $units,
            'success' => session('success'),
        ]);
    }

    public function create(){
        return Inertia::render('admin/units/create', []);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:units,name',
            'code' => 'required|string|unique:units,code',
        ]);

        Unit::create($validated);

        return redirect()->route('admin.units.index')->with('success', 'Unit created successfully.');
    }

    public function edit(Unit $unit){
        return Inertia::render('admin/units/edit', [
        'unit' => $unit
        ]);
    }

    public function update(Request $request, Unit $unit)
    {
        $validated = $request->validate([
            'name' => [
                'required', 
                'string', 
                Rule::unique('units', 'name')->ignore($unit->id),],
            'code' => [
                'required',
                'string',
                Rule::unique('units', 'code')->ignore($unit->id),
            ],
        ]);

        $unit->update($validated);

        return redirect()->route('admin.units.index')->with([
            'success' => 'Unit updated successfully.',
            'updated_unit' => $unit,
        ]);
    }

    public function destroy(Unit $unit)
    {
        $unit->delete();

        return redirect()->route('admin.units.index')->with([
            'success' => 'Unit deleted successfully.',
        ]);
    }
}
