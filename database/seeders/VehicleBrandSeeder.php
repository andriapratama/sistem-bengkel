<?php

namespace Database\Seeders;

use App\Models\VehicleBrand;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VehicleBrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vehicleBrands = [
            ['name' => 'Toyota'],
            ['name' => 'Honda'],
            ['name' => 'Yamaha'],
            ['name' => 'Suzuki'],
            ['name' => 'Mitsubishi'],
            ['name' => 'Kawasaki'],
            ['name' => 'Benelli'],
            ['name' => 'Hyundai'],
            ['name' => 'TVS'],
            ['name' => 'Vespa '],
        ];

        foreach ($vehicleBrands as $vehicleBrand) {
            VehicleBrand::create($vehicleBrand);
        }
    }
}
