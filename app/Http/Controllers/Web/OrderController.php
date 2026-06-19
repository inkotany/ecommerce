<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['items.product'])
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(config('ecommerce.orders_per_page', 15));

        return inertia('orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        abort_unless($order->user_id === auth()->id(), 403);

        $order->load(['items.product', 'items.seller']);

        return inertia('orders/show', [
            'order' => $order,
        ]);
    }
}