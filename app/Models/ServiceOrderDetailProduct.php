<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceOrderDetailProduct extends Model
{
    protected $fillable = [
        'name',
        'quantity',
        'price',
        'sub_total',
        'service_order_id',
        'product_id',
    ];

    public function serviceOrder()
    {
        return $this->belongsTo(ServiceOrder::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
