<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['seller', 'category']);

        if ($request->filled('status')) {
            match ($request->status) {
                'active' => $query->where('is_active', true),
                'inactive' => $query->where('is_active', false),
                'featured' => $query->where('is_featured', true),
                default => null,
            };
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->latest()->paginate(20);

        return inertia('admin/products/index', [
            'products' => $products,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function edit(Product $product)
    {
        $product->load(['seller', 'category']);

        return inertia('admin/products/edit', [
            'product' => $product,
            'statuses' => config('ecommerce.order_statuses'),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $product->update($request->only(['is_active', 'is_featured']));

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully!');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully!');
    }
}