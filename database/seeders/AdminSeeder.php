<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $admins = [
            ['name' => 'test', 'email' => 'test@mail.com', 'password' => '$2y$12$SdQAKi9BskoLJz5eZBuL2OJoSdnKOh8/Om.tXSsemEYWflmKi.2mq'],
        ];

        foreach ($admins as $admin) {
            Admin::create($admin);
        }
    }
}
