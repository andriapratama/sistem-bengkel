<?php

namespace Database\Seeders;

use App\Models\VehicleVariant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VehicleVariantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vehicleVariants = [
            // Honda (id: 2)
            ['name' => 'Vario 125', 'vehicle_brand_id' => 2],
            ['name' => 'Vario 160', 'vehicle_brand_id' => 2],
            ['name' => 'Beat', 'vehicle_brand_id' => 2],
            ['name' => 'PCX 160', 'vehicle_brand_id' => 2],
            ['name' => 'Supra X 125', 'vehicle_brand_id' => 2],
            ['name' => 'CB150R', 'vehicle_brand_id' => 2],

            // Yamaha (id: 3)
            ['name' => 'NMAX', 'vehicle_brand_id' => 3],
            ['name' => 'Aerox', 'vehicle_brand_id' => 3],
            ['name' => 'Mio M3', 'vehicle_brand_id' => 3],
            ['name' => 'Fazzio', 'vehicle_brand_id' => 3],
            ['name' => 'XSR 155', 'vehicle_brand_id' => 3],

            // Suzuki (id: 4)
            ['name' => 'Satria F150', 'vehicle_brand_id' => 4],
            ['name' => 'Nex II', 'vehicle_brand_id' => 4],

            // Kawasaki (id: 6)
            ['name' => 'KLX 150', 'vehicle_brand_id' => 6],
            ['name' => 'Ninja 250', 'vehicle_brand_id' => 6],
            ['name' => 'W175', 'vehicle_brand_id' => 6],

            // Vespa (id: 10)
            ['name' => 'Vespa LX 125', 'vehicle_brand_id' => 10],
            ['name' => 'Vespa Sprint 150', 'vehicle_brand_id' => 10],

            // TVS (id: 9)
            ['name' => 'TVS Dazz', 'vehicle_brand_id' => 9],
            ['name' => 'TVS Neo XR', 'vehicle_brand_id' => 9],

            // Benelli (id: 7)
            ['name' => 'Benelli Panarea 125', 'vehicle_brand_id' => 7],
            ['name' => 'Benelli TNT 135', 'vehicle_brand_id' => 7],
        ];

         foreach ($vehicleVariants as $vehicleVariant) {
            VehicleVariant::create($vehicleVariant);
        }
    }
}
