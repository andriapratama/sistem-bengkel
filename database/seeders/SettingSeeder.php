<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $setting = [
            'hero_image' => null,
            'address' => 'Badung, Denpasar, Bali, Indonesia',
            'email' => 'test@gmail.com',
            'phone' => '081323912320',
            'bank_name' => 'BCA',
            'bank_username' => "Owner Bengkel",
            'bank_number' => '1234567890',
        ];

        Setting::create($setting);
    }
}
