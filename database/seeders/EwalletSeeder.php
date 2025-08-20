<?php

namespace Database\Seeders;

use App\Models\Ewallet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EwalletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $wallets = [
            ['user_name' => 'Owner Bengkel', 'name' => 'Dana', 'number' => '1234567890', 'status' => true],
            ['user_name' => 'Owner Bengkel', 'name' => 'Ovo', 'number' => '1234567890', 'status' => true],
            ['user_name' => 'Owner Bengkel', 'name' => 'Gopay', 'number' => '1234567890', 'status' => true],
        ];

        foreach ($wallets as $wallet) {
            Ewallet::create($wallet);
        }
    }
}
