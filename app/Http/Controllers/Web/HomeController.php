<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $featuredProducts = Product::with(['seller', 'category'])
            ->active()
            ->featured()
            ->inStock()
            ->latest()
            ->take(8)
            ->get();

        $categories = Category::getCachedTree();
        $recentProducts = Product::with(['seller', 'category'])
            ->active()
            ->inStock()
            ->latest()
            ->take(12)
            ->get();

        return inertia('home', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'recentProducts' => $recentProducts,
        ]);
    }
}