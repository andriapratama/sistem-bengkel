<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class UnitController extends Controller
{
    public function index(){
        $units = Unit::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('units/index', [
            'units' => $units,
            'success' => session('success'),
        ]);
    }

    public function create(){
        return Inertia::render('units/create', []);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:units,name',
            'code' => 'required|string|unique:units,code',
        ]);

        Unit::create($validated);

        return redirect()->route('units.index')->with('success', 'Unit created successfully.');
    }

    public function edit(Unit $unit){
        return Inertia::render('units/edit', [
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

        return redirect()->route('units.index')->with([
            'success' => 'Unit updated successfully.',
            'updated_unit' => $unit,
        ]);
    }

    public function destroy(Unit $unit)
    {
        $unit->delete();

        return redirect()->route('units.index')->with([
            'success' => 'Unit deleted successfully.',
        ]);
    }
}
