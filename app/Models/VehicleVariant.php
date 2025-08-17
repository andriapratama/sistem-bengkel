<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleVariant extends Model
{
    protected $fillable = ['name', 'vehicle_brand_id'];

    public function vehicleBrand()
    {
        return $this->belongsTo(VehicleBrand::class, 'vehicle_brand_id');
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    public function serviceOrder()
    {
        return $this->hasMany(ServiceOrder::class);
    }
}
