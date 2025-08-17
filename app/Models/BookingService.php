<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingService extends Model
{
    protected $fillable = [
        'date_booking',
        'queue_number',
        'estimated_service_duration',
        'estimated_service_price',
        'estimated_service_start',
        'estimated_service_end',
        'status',
        'note',
        'user_id',
        'vehicle_id',
    ];

     public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function bookingServiceDetail()
    {
        return $this->hasMany(BookingServiceDetail::class);
    }

    public function serviceOrder()
    {
        return $this->hasMany(ServiceOrder::class);
    }
}
