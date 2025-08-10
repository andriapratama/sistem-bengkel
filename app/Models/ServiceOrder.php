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
        'grand_total',
        'discount_percentage',
        'discounta_amount',
        'note',
        'mechanic_name',
        'cashier_name',
        'user_id',
        'vehicle_id',
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
