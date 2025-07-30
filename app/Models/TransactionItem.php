<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionItem extends Model
{
    protected $fillable = [
        'quantity',
        'price',
        'subtotal',
        'transaction_id',
        'product_id',
        'variant_id',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
