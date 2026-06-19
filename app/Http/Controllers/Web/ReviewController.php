<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string|max:2000',
        ]);

        $product = Product::findOrFail($request->product_id);

        $existingReview = Review::where('product_id', $request->product_id)
            ->where('user_id', auth()->id())
            ->first();

        if ($existingReview) {
            return back()->with('error', 'You have already reviewed this product');
        }

        $order = Order::where('user_id', auth()->id())
            ->whereHas('items', fn($q) => $q->where('product_id', $request->product_id))
            ->where('status', 'delivered')
            ->first();

        Review::create([
            'product_id' => $request->product_id,
            'user_id' => auth()->id(),
            'order_id' => $order?->id,
            'rating' => $request->rating,
            'title' => $request->title,
            'content' => $request->content,
            'is_verified' => $order ? true : false,
            'status' => 'pending',
        ]);

        $product->updateRating();

        return back()->with('success', 'Review submitted successfully!');
    }
}