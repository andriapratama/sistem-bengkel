<?php

namespace Database\Seeders;

use App\Models\HomePage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HomePageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $home = ['hero' => '', 'company_name' => 'Bengkel', 'address' => 'Renon, Kota Denpasar, Provinsi Bali, Indonesia' , 'email' => 'bengkel@mail.com', 'phone' => '08926735178'];

        HomePage::create($home);
    }
}
