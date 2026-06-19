<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::whereHas('items', fn($q) => $q->forSeller(auth()->id()));

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->with(['user', 'items' => fn($q) => $q->forSeller(auth()->id())])
            ->latest()
            ->paginate(15);

        return inertia('seller/orders/index', [
            'orders' => $orders,
            'statuses' => config('ecommerce.order_statuses'),
            'filters' => $request->only(['status']),
        ]);
    }

    public function show(Order $order)
    {
        abort_if(!$order->items()->where('seller_id', auth()->id())->exists(), 403);

        $order->load(['user', 'items.product', 'items' => fn($q) => $q->forSeller(auth()->id())]);

        return inertia('seller/orders/show', [
            'order' => $order,
            'statuses' => config('ecommerce.order_statuses'),
        ]);
    }
}