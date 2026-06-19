<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['seller', 'category'])
            ->active()
            ->inStock();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $products = $query->latest()->paginate(config('ecommerce.products_per_page', 24));

        // Only get categories that have active, in-stock products
        $categoriesWithProducts = Product::active()
            ->inStock()
            ->distinct()
            ->pluck('category_id');

        $categories = Category::whereIn('id', $categoriesWithProducts)
            ->orderBy('sort_order')
            ->get();

        return inertia('products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);

    }

    public function show(string $slug, Request $request)
    {
        $product = Product::with(['seller', 'category'])
            ->where('slug', $slug)
            ->active()
            ->firstOrFail();

        $reviews = Review::with(['user'])
            ->forProduct($product->id)
            ->approved()
            ->latest()
            ->paginate(config('ecommerce.reviews_per_page', 10));

        $relatedProducts = Product::with(['seller', 'category'])
            ->active()
            ->inStock()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->take(4)
            ->get();

        return inertia('products/show', [
            'product' => $product,
            'reviews' => $reviews,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    public function category(string $slug, Request $request)
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        $products = Product::with(['seller', 'category'])
            ->active()
            ->inStock()
            ->where('category_id', $category->id)
            ->latest()
            ->paginate(config('ecommerce.products_per_page', 24));

        // Only get categories that have active, in-stock products
        $categoriesWithProducts = Product::active()
            ->inStock()
            ->distinct()
            ->pluck('category_id');

        $categories = Category::whereIn('id', $categoriesWithProducts)
            ->orderBy('sort_order')
            ->get();

        return inertia('products/index', [
            'products' => $products,
            'category' => $category,
            'categories' => $categories,
            'filters' => ['category' => $category->slug],
        ]);
    }
}
