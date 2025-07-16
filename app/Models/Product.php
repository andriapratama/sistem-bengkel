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
    'discountPercentage', 
    'discountAmount', 
    'priceAfterDiscount', 
    'categoryId', 
    'unitId'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'categoryId');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unitId');
    }
}
