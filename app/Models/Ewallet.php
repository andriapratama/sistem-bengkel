<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ewallet extends Model
{
    protected $fillable = ['name', 'number', 'status'];
}
