<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSedder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $services = [
            [
                'name' => 'Ganti Oli Mesin',
                'description' => 'Mengganti oli mesin motor.',
                'estimated_duration' => 15,
                'estimated_price' => 40000,
            ],
            [
                'name' => 'Ganti Oli Gardan',
                'description' => 'Penggantian oli gardan pada motor matic.',
                'estimated_duration' => 10,
                'estimated_price' => 25000,
            ],
            [
                'name' => 'Servis Ringan',
                'description' => 'Pemeriksaan dan penyetelan dasar motor.',
                'estimated_duration' => 30,
                'estimated_price' => 50000,
            ],
            [
                'name' => 'Servis Besar',
                'description' => 'Perawatan menyeluruh dan bongkar mesin.',
                'estimated_duration' => 120,
                'estimated_price' => 200000,
            ],
            [
                'name' => 'Ganti Kampas Rem Depan',
                'description' => 'Penggantian kampas rem depan.',
                'estimated_duration' => 20,
                'estimated_price' => 35000,
            ],
            [
                'name' => 'Ganti Kampas Rem Belakang',
                'description' => 'Penggantian kampas rem belakang.',
                'estimated_duration' => 20,
                'estimated_price' => 35000,
            ],
            [
                'name' => 'Ganti Aki',
                'description' => 'Penggantian aki motor.',
                'estimated_duration' => 15,
                'estimated_price' => 150000,
            ],
            [
                'name' => 'Ganti Busi',
                'description' => 'Penggantian busi motor.',
                'estimated_duration' => 10,
                'estimated_price' => 20000,
            ],
            [
                'name' => 'Ganti Rantai dan Gear Set',
                'description' => 'Penggantian rantai dan gear set.',
                'estimated_duration' => 45,
                'estimated_price' => 120000,
            ],
            [
                'name' => 'Setel Klep',
                'description' => 'Penyetelan celah katup (klep).',
                'estimated_duration' => 40,
                'estimated_price' => 60000,
            ],
            [
                'name' => 'Cek & Isi Angin Ban',
                'description' => 'Pemeriksaan dan pengisian angin ban.',
                'estimated_duration' => 5,
                'estimated_price' => 5000,
            ],
            [
                'name' => 'Ganti Ban Depan',
                'description' => 'Penggantian ban depan motor.',
                'estimated_duration' => 30,
                'estimated_price' => 150000,
            ],
            [
                'name' => 'Ganti Ban Belakang',
                'description' => 'Penggantian ban belakang motor.',
                'estimated_duration' => 30,
                'estimated_price' => 170000,
            ],
            [
                'name' => 'Servis CVT',
                'description' => 'Pembersihan dan perawatan CVT motor matic.',
                'estimated_duration' => 60,
                'estimated_price' => 100000,
            ],
            [
                'name' => 'Ganti Roller CVT',
                'description' => 'Penggantian roller pada CVT motor matic.',
                'estimated_duration' => 30,
                'estimated_price' => 80000,
            ],
            [
                'name' => 'Flush Radiator',
                'description' => 'Pengurasan dan pengisian ulang cairan radiator.',
                'estimated_duration' => 25,
                'estimated_price' => 40000,
            ],
            [
                'name' => 'Servis Karburator',
                'description' => 'Pembersihan dan penyetelan karburator.',
                'estimated_duration' => 50,
                'estimated_price' => 70000,
            ],
            [
                'name' => 'Ganti Kabel Gas',
                'description' => 'Penggantian kabel gas motor.',
                'estimated_duration' => 30,
                'estimated_price' => 25000,
            ],
            [
                'name' => 'Ganti Kabel Kopling',
                'description' => 'Penggantian kabel kopling.',
                'estimated_duration' => 30,
                'estimated_price' => 30000,
            ],
            [
                'name' => 'Cek Kelistrikan',
                'description' => 'Pemeriksaan sistem kelistrikan motor.',
                'estimated_duration' => 20,
                'estimated_price' => 30000,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
