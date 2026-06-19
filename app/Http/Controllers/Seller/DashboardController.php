<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $stats = [
            'products' => Product::forSeller($userId)->count(),
            'active_products' => Product::forSeller($userId)->active()->count(),
            'total_orders' => OrderItem::forSeller($userId)->distinct('order_id')->count(),
            'pending_orders' => OrderItem::forSeller($userId)
                ->whereHas('order', fn($q) => $q->whereIn('status', ['pending', 'confirmed', 'processing']))
                ->distinct('order_id')
                ->count(),
            'total_revenue' => OrderItem::forSeller($userId)
                ->whereHas('order', fn($q) => $q->where('payment_status', 'paid'))
                ->sum('total'),
        ];

        $recentOrders = Order::with(['items' => fn($q) => $q->forSeller($userId)])
            ->whereHas('items', fn($q) => $q->forSeller($userId))
            ->latest()
            ->take(5)
            ->get();

        $recentProducts = Product::forSeller($userId)->latest()->take(5)->get();

        return inertia('seller/dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'recentProducts' => $recentProducts,
        ]);
    }
}