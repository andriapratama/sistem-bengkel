<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Oli Mesin Matic 10W-30',
                'slug' => 'oli-mesin-matic-10w-30',
                'description' => 'Oli mesin matic berkualitas tinggi untuk motor harian.',
                'stock' => 100,
                'cost' => 35000.00,
                'price' => 50000.00,
                'image' => 'products/a0QCMtlaD4NTwHulAHyPO7RpBRjBtdP2KyLFdOzs.jpg',
                'status' => true,
                'hasVariant' => false,
                'discountPercentage' => 10,
                'discountAmount' => 5000.00,
                'priceAfterDiscount' => 45000.00,
                'category_id' => 2, // Oil & Lubricants
                'unit_id' => 8,     // Liter
            ],
            [
                'name' => 'Kampas Rem Belakang',
                'slug' => 'kampas-rem-belakang',
                'description' => 'Kampas rem belakang untuk motor bebek dan matic.',
                'stock' => 60,
                'cost' => 15000.00,
                'price' => 25000.00,
                'image' => 'products/1EMZ1hO3VshBfUV7zuI94t62U4McxvDcjunN4p3w.jpg',
                'status' => true,
                'hasVariant' => false,
                'discountPercentage' => null,
                'discountAmount' => null,
                'priceAfterDiscount' => null,
                'category_id' => 3, // Brake Components
                'unit_id' => 9,     // Pieces
            ],
            [
                'name' => 'Filter Udara Vario 125',
                'slug' => 'filter-udara-vario-125',
                'description' => 'Filter udara pengganti untuk motor Honda Vario 125.',
                'stock' => 40,
                'cost' => 20000.00,
                'price' => 30000.00,
                'image' => 'products/cNAjWCx7peXJbMleI3auYqA544o3TD9iUGK5Poau.jpg',
                'status' => true,
                'hasVariant' => false,
                'discountPercentage' => null,
                'discountAmount' => null,
                'priceAfterDiscount' => null,
                'category_id' => 8, // Filters
                'unit_id' => 9,     // Pieces
            ],
            [
                'name' => 'Busi NGK CR7HSA',
                'slug' => 'busi-ngk-cr7hsa',
                'description' => 'Busi standar NGK untuk motor matic dan bebek.',
                'stock' => 80,
                'cost' => 12000.00,
                'price' => 18000.00,
                'image' => 'products/qI79WwWuvQduAs6gPzGU7aVCHWe49hbQl8XpU3sJ.webp',
                'status' => true,
                'hasVariant' => false,
                'discountPercentage' => null,
                'discountAmount' => null,
                'priceAfterDiscount' => null,
                'category_id' => 5, // Electrical Parts
                'unit_id' => 9,     // Pieces
            ],
            [
                'name' => 'CVT Belt Vario 110',
                'slug' => 'cvt-belt-vario-110',
                'description' => 'V-Belt penggerak untuk transmisi otomatis motor Vario.',
                'stock' => 30,
                'cost' => 65000.00,
                'price' => 85000.00,
                'image' => 'products/UyoT2tZMjcKgxDaYZt4I5FUdao8jS8jcNlkMzwk0.jpg',
                'status' => true,
                'hasVariant' => false,
                'discountPercentage' => 5,
                'discountAmount' => 4250.00,
                'priceAfterDiscount' => 80750.00,
                'category_id' => 7, // Transmission Parts
                'unit_id' => 9,     // Pieces
            ],
            [
                'name' => 'Shockbreaker Belakang Motor Bebek',
                'slug' => 'shockbreaker-belakang-motor-bebek',
                'description' => 'Suspensi belakang untuk motor bebek, cocok untuk berbagai merek.',
                'stock' => 25,
                'cost' => 120000.00,
                'price' => 150000.00,
                'image' => 'products/hZLU9OexRwiM8GCEY74hW0vX6wpTyPQwutuYUktu.webp',
                'status' => true,
                'hasVariant' => false,
                'discountPercentage' => null,
                'discountAmount' => null,
                'priceAfterDiscount' => null,
                'category_id' => 4, // Suspension Parts
                'unit_id' => 9,     // Pieces
            ],
            [
                'name' => 'Kampas Kopling Motor Manual',
                'slug' => 'kampas-kopling-motor-manual',
                'description' => 'Kampas kopling berkualitas untuk motor manual seperti Supra dan Jupiter.',
                'stock' => 40,
                'cost' => 30000.00,
                'price' => 45000.00,
                'image' => 'products/7XrLEZzyv40VoyJKGIwrjawTJ8eGa3uVcMG69cIA.webp',
                'status' => true,
                'hasVariant' => false,
                'discountPercentage' => null,
                'discountAmount' => null,
                'priceAfterDiscount' => null,
                'category_id' => 1, // Engine Parts
                'unit_id' => 9,     // Pieces
            ],
            [
                'name' => 'Lampu LED Headlamp Motor',
                'slug' => 'lampu-led-headlamp-motor',
                'description' => 'Lampu LED putih terang untuk visibilitas maksimal di malam hari.',
                'stock' => 100,
                'cost' => 25000.00,
                'price' => 40000.00,
                'image' => 'products/PdviJ9FDDrLJJVW4GArPfyT4uiyzKCUqeEdSqYW8.jpg',
                'status' => true,
                'hasVariant' => false,
                'discountPercentage' => 15,
                'discountAmount' => 6000.00,
                'priceAfterDiscount' => 34000.00,
                'category_id' => 5, // Electrical Parts
                'unit_id' => 9,     // Pieces
            ],
            [
                'name' => 'Filter Oli Motor Matic',
                'slug' => 'filter-oli-motor-matic',
                'description' => 'Filter oli khusus motor matic untuk menjaga kebersihan oli.',
                'stock' => 45,
                'cost' => 8000.00,
                'price' => 15000.00,
                'image' => 'products/YLE4n6RWiCQAEKlVF3WgQDOErlWTndAH8lSvgVXD.webp',
                'status' => true,
                'hasVariant' => false,
                'discountPercentage' => null,
                'discountAmount' => null,
                'priceAfterDiscount' => null,
                'category_id' => 8, // Filters
                'unit_id' => 9,     // Pieces
            ],
            [
                'name' => 'Aki Kering Motor 12V 5Ah',
                'slug' => 'aki-kering-motor-12v-5ah',
                'description' => 'Aki kering untuk motor matic maupun bebek.',
                'stock' => 20,
                'cost' => 150000.00,
                'price' => 200000.00,
                'image' => 'products/reJhDQWMmtfmuVHEFm70yBdhz1dzts3hL1i1aZet.webp',
                'status' => true,
                'hasVariant' => false,
                'discountPercentage' => 5,
                'discountAmount' => 10000.00,
                'priceAfterDiscount' => 190000.00,
                'category_id' => 5, // Electrical Parts
                'unit_id' => 9,     // Pieces
            ],
            [
                'name' => 'Ban Tubeless 80/90 Ring 14',
                'slug' => 'ban-tubeless-80-90-ring-14',
                'description' => 'Ban tubeless untuk motor matic ukuran 80/90 ring 14.',
                'stock' => 15,
                'cost' => 175000.00,
                'price' => 225000.00,
                'image' => 'products/1TEhiUUaE7Jh4q0A0ABkCneHUklMg1eKX8Q9Wmx5.jpg',
                'status' => true,
                'hasVariant' => false,
                'discountPercentage' => null,
                'discountAmount' => null,
                'priceAfterDiscount' => null,
                'category_id' => 9, // Tires & Wheels
                'unit_id' => 9,     // Pieces
            ],
            [
                'name' => 'Kompressor AC Mini Motor Listrik',
                'slug' => 'kompressor-ac-mini-motor-listrik',
                'description' => 'Kompressor mini khusus motor listrik dengan sistem pendingin kabin.',
                'stock' => 10,
                'cost' => 300000.00,
                'price' => 400000.00,
                'image' => 'products/l7rFOCNaCP3pjEDQLynFo1R2FlGGObTZHGpSETgC.jpg',
                'status' => true,
                'hasVariant' => false,
                'discountPercentage' => 10,
                'discountAmount' => 40000.00,
                'priceAfterDiscount' => 360000.00,
                'category_id' => 6, // Air Conditioning
                'unit_id' => 9,     // Pieces
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
