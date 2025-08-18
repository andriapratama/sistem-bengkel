<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomePage extends Model
{
    protected $fillable = ['hero', 'company_name', 'address', 'email', 'phone'];
}
