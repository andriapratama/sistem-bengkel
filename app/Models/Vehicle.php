<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'vehicle_year', 
        'police_number', 
        'last_service_date', 
        'user_id', 
        'vehicle_variant_id',
        'status_booking'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vehicleVariant()
    {
        return $this->belongsTo(VehicleVariant::class);
    }

    public function bookingService()
    {
        return $this->belongsTo(BookingService::class);
    }

}
