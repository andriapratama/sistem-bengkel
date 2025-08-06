<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use Inertia\Inertia;



class AdminServiceController extends Controller
{
    public function index(){
        $services = Service::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('admin/services/index', [
            'services' => $services,
            'success' => session('success'),
        ]);
    }

    public function create(){
        return Inertia::render('admin/services/create', []);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'estimated_duration' => 'nullable|integer',
            'estimated_price' => 'nullable|numeric',
        ]);

        Service::create($validated);

        return redirect()->route('admin.services.index')->with('success', 'Service created successfully.');
    }

    public function edit(Service $service){
        return Inertia::render('admin/services/edit', [
        'service' => $service
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'estimated_duration' => 'nullable|integer',
            'estimated_price' => 'nullable|numeric',
        ]);

        $service->update($validated);

        return redirect()->route('admin.services.index')->with([
            'success' => 'Service updated successfully.',
            'updated_service' => $service,
        ]);
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->route('admin.services.index')->with([
            'success' => 'Service deleted successfully.',
        ]);
    }
}
