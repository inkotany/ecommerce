<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        $orders = $query->latest()->paginate(20);

        return inertia('admin/orders/index', [
            'orders' => $orders,
            'statuses' => config('ecommerce.order_statuses'),
            'filters' => $request->only(['status', 'payment_status']),
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items.product', 'items.seller']);

        return inertia('admin/orders/show', [
            'order' => $order,
            'statuses' => config('ecommerce.order_statuses'),
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled,refunded',
        ]);

        $order->update(['status' => $request->status]);

        if ($request->status === 'delivered') {
            $order->update(['delivered_at' => now()]);
        } elseif ($request->status === 'shipped') {
            $order->update(['shipped_at' => now()]);
        }

        return back()->with('success', 'Order status updated successfully!');
    }
}