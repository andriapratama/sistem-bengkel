<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleBrand extends Model
{
    protected $fillable = ['name'];

    public function vehicleVariant()
    {
        return $this->hasMany(VehicleVariant::class);
    }
}
