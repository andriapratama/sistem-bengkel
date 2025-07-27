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
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    public function variants()
    {
        return $this->hasMany(Variant::class);
    }
}
