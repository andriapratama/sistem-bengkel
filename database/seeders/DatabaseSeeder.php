<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            CategorySeeder::class,
            UnitSeeder::class,
            VehicleBrandSeeder::class,
            VehicleVariantSeeder::class,
            ProductSeeder::class,
            SettingSeeder::class,
            ServiceSeeder::class,
            EwalletSeeder::class,
            BankSeeder::class,
            HomePageSeeder::class,
        ]);
    }
}
