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
            ['name' => 'Mandiri', 'number' => '1234567890', 'status' => true],
            ['name' => 'BRI', 'number' => '1234567890', 'status' => true],
            ['name' => 'BNI', 'number' => '1234567890', 'status' => true],
            ['name' => 'BCA', 'number' => '1234567890', 'status' => true],
        ];

        foreach ($banks as $bank) {
            Bank::create($bank);
        }
    }
}
