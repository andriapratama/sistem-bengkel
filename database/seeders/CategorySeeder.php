<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run(): void
    {
        $categories = [
            ['name' => 'Engine Parts', 'slug' => 'engine-parts'],
            ['name' => 'Oil & Lubricants', 'slug' => 'oil-lubricants'],
            ['name' => 'Brake Components', 'slug' => 'brake-components'],
            ['name' => 'Suspension Parts', 'slug' => 'suspension-parts'],
            ['name' => 'Electrical Parts', 'slug' => 'electrical-parts'],
            ['name' => 'Air Conditioning', 'slug' => 'air-conditioning'],
            ['name' => 'Transmission Parts', 'slug' => 'transmission-parts'],
            ['name' => 'Filters', 'slug' => 'filters'],
            ['name' => 'Tires & Wheels', 'slug' => 'tires-wheels'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
