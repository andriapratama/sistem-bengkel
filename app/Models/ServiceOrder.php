<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceOrder extends Model
{
    protected $fillable = [
        'service_number',
        'service_date',
        'queue_number',
        'service_type',
        'status',
        'payment_status',
        'total',
        'grand_total',
        'discount_percentage',
        'discount_amount',
        'payment_amount',
        'change',
        'note',
        'mechanic_name',
        'cashier_name',
        'vehicle_year',
        'police_number',
        'user_id',
        'vehicle_id',
        'vehicle_variant_id',
        'booking_service_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function vehicleVariant()
    {
        return $this->belongsTo(VehicleVariant::class);
    }

    public function bookingService()
    {
        return $this->belongsTo(BookingService::class);
    }

    public function serviceOrderDetails()
    {
        return $this->hasMany(ServiceOrderDetail::class);
    }
    
    public function serviceOrderDetailProducts()
    {
        return $this->hasMany(ServiceOrderDetailProduct::class);
    }
}
