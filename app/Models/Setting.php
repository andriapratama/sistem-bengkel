<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'hero_image', 
        'address', 
        'email', 
        'phone', 
        'bank_name', 
        'bank_username', 
        'bank_number', 
    ];

}
