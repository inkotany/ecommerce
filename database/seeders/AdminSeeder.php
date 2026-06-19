<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@example.com');
        $name = env('ADMIN_NAME', 'Admin');
        $password = env('ADMIN_PASSWORD');

        if (!$password) {
            $this->command->warn('ADMIN_PASSWORD not set in .env - skipping admin seed');
            return;
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => bcrypt($password),
                'role' => UserRole::ADMIN->value,
                'is_active' => true,
            ]
        );
    }
}