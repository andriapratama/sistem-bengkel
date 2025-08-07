<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingServiceDetail extends Model
{
    protected $fillable = ['booking_service_id', 'service_id'];

    public function bookingService()
    {
        return $this->belongsTo(BookingService::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
