<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleVariant extends Model
{
    protected $fillable = ['name', 'vehicleBrandId'];

    public function vehicleBrand()
    {
        return $this->belongsTo(VehicleBrand::class, 'vehicleBrandId');
    }
}
