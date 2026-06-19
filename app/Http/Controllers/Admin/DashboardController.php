<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_sellers' => User::where('role', UserRole::SELLER->value)->count(),
            'total_customers' => User::where('role', UserRole::CUSTOMER->value)->count(),
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::whereIn('status', ['pending', 'confirmed'])->count(),
            'total_revenue' => Order::where('payment_status', 'paid')->sum('total'),
            'monthly_revenue' => Order::where('payment_status', 'paid')
                ->whereMonth('created_at', now()->month)
                ->sum('total'),
        ];

        $recentOrders = Order::with(['user'])
            ->latest()
            ->take(5)
            ->get();

        $recentUsers = User::latest()->take(5)->get();

        $topProducts = Product::orderBy('review_count', 'desc')->take(5)->get();

        return inertia('admin/dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'recentUsers' => $recentUsers,
            'topProducts' => $topProducts,
        ]);
    }
}