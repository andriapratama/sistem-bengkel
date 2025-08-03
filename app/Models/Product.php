<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
   protected $fillable = [
        'name', 
        'slug', 
        'description', 
        'stock', 
        'cost', 
        'price', 
        'image', 
        'status',
        'hasVariant',
        'discountPercentage', 
        'discountAmount', 
        'priceAfterDiscount', 
        'category_id', 
        'unit_id'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function variants()
    {
        return $this->hasMany(Variant::class);
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }
}
