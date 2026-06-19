<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'title' => 'About Us',
                'slug' => 'about',
                'type' => 'about',
                'content' => 'Welcome to our store! We are dedicated to providing the best products and service to our customers.',
                'is_active' => true,
            ],
            [
                'title' => 'Contact Us',
                'slug' => 'contact',
                'type' => 'contact',
                'content' => 'Have questions? Reach out to us at contact@store.com',
                'is_active' => true,
            ],
            [
                'title' => 'Terms of Service',
                'slug' => 'terms',
                'type' => 'terms',
                'content' => 'By using our service, you agree to our terms and conditions.',
                'is_active' => true,
            ],
            [
                'title' => 'Privacy Policy',
                'slug' => 'privacy',
                'type' => 'privacy',
                'content' => 'Your privacy is important to us. We collect and use your data only as described in this policy.',
                'is_active' => true,
            ],
        ];

        foreach ($pages as $page) {
            Page::firstOrCreate(['slug' => $page['slug']], $page);
        }
    }
}