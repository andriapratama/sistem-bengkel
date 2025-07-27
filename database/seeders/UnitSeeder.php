<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $units = [
            ['name' => 'Milimeter', 'code' => 'mm'],
            ['name' => 'Centimeter', 'code' => 'cm'],
            ['name' => 'Inch', 'code' => 'in'],
            ['name' => 'Gram', 'code' => 'g'],
            ['name' => 'Kilogram', 'code' => 'kg'],
            ['name' => 'Pound', 'code' => 'lb'],
            ['name' => 'Mililiter', 'code' => 'mL'],
            ['name' => 'Liter', 'code' => 'L'],
            ['name' => 'Pieces', 'code' => 'pcs'],
            ['name' => 'Pack', 'code' => 'pck'],
        ];

        foreach ($units as $unit) {
            Unit::create($unit);
        }
    }
}
