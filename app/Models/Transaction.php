<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
     protected $fillable = [
        'invoice_number',
        'total_price',
        'total_quantity',
        'payment_status',
        'payment_method',
        'shipping_address',
        'payment_image',
        'shipping_image',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }
}
