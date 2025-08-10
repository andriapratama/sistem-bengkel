<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceOrderDetail extends Model
{
    protected $fillable = [
        'name',
        'price',
        'service_order_id',
        'service_id',
    ];

    public function serviceOrder()
    {
        return $this->belongsTo(ServiceOrder::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
