<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::forSeller(auth()->id());

        if ($request->filled('status')) {
            match ($request->status) {
                'active' => $query->where('is_active', true),
                'inactive' => $query->where('is_active', false),
                'out_of_stock' => $query->where('quantity', 0),
                default => null,
            };
        }

        $products = $query->with(['category'])
            ->latest()
            ->paginate(15);

        return inertia('seller/products/index', [
            'products' => $products,
            'filters' => $request->only(['status']),
        ]);
    }

    public function create()
    {
        $categories = Category::active()->get();

        return inertia('seller/products/create', [
            'categories' => $categories,
            'conditions' => config('ecommerce.product_conditions'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'condition' => 'required|in:new,like_new,used',
            'location' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->only([
            'name', 'category_id', 'price', 'compare_price', 'quantity',
            'description', 'short_description', 'condition', 'location',
        ]);

        $data['slug'] = Str::slug($request->name);
        $data['seller_id'] = auth()->id();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = basename($path);
        }

        Product::create($data);

        return redirect()->route('seller.products.index')->with('success', 'Product created successfully!');
    }

    public function edit(Product $product)
    {
        abort_unless($product->seller_id === auth()->id(), 403);

        $categories = Category::active()->get();

        return inertia('seller/products/edit', [
            'product' => $product,
            'categories' => $categories,
            'conditions' => config('ecommerce.product_conditions'),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        abort_unless($product->seller_id === auth()->id(), 403);

        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'condition' => 'required|in:new,like_new,used',
            'location' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->only([
            'name', 'category_id', 'price', 'compare_price', 'quantity',
            'description', 'short_description', 'condition', 'location', 'is_active',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete('products/' . $product->image);
            }
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = basename($path);
        }

        $product->update($data);

        return redirect()->route('seller.products.index')->with('success', 'Product updated successfully!');
    }

    public function destroy(Product $product)
    {
        abort_unless($product->seller_id === auth()->id(), 403);

        if ($product->image) {
            Storage::disk('public')->delete('products/' . $product->image);
        }

        $product->delete();

        return redirect()->route('seller.products.index')->with('success', 'Product deleted successfully!');
    }
}