<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'name',
        'description',
        'estimated_duration',
        'estimated_price'
    ];

    public function bookingServiceDetail()
    {
        return $this->hasMany(BookingServiceDetail::class);
    }
}
