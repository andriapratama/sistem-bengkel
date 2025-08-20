<?php

namespace Database\Seeders;

use App\Models\Bank;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banks = [
            ['user_name' => 'Owner Bengkel', 'name' => 'Mandiri', 'number' => '1234567890', 'status' => true],
            ['user_name' => 'Owner Bengkel', 'name' => 'BRI', 'number' => '1234567890', 'status' => true],
            ['user_name' => 'Owner Bengkel', 'name' => 'BNI', 'number' => '1234567890', 'status' => true],
            ['user_name' => 'Owner Bengkel', 'name' => 'BCA', 'number' => '1234567890', 'status' => true],
        ];

        foreach ($banks as $bank) {
            Bank::create($bank);
        }
    }
}
