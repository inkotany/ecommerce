<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Men', 'icon' => '👔', 'slug' => 'men', 'sort_order' => 1],
            ['name' => 'Women', 'icon' => '👗', 'slug' => 'women', 'sort_order' => 2],
            ['name' => 'Summer Collection', 'icon' => '☀️', 'slug' => 'summer', 'sort_order' => 3],
            ['name' => 'Accessories', 'icon' => '👜', 'slug' => 'accessories', 'sort_order' => 4],
            ['name' => 'Footwear', 'icon' => '👟', 'slug' => 'footwear', 'sort_order' => 5],
            ['name' => 'Activewear', 'icon' => '🏃', 'slug' => 'activewear', 'sort_order' => 6],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}