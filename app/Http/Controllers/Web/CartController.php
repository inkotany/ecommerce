<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CartController extends Controller
{
    public function index()
    {
        return inertia('cart');
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'shipping_name' => 'required|string|max:255',
            'shipping_email' => 'required|email',
            'shipping_phone' => 'nullable|string',
            'shipping_address' => 'required|string',
            'shipping_city' => 'required|string|max:100',
            'shipping_zip' => 'required|string|max:20',
            'shipping_country' => 'required|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $items = json_decode($request->items, true);
        if (empty($items)) {
            return back()->with('error', 'Cart is empty');
        }

        $products = Product::whereIn('id', array_column($items, 'product_id'))->get()->keyBy('id');
        $subtotal = 0;
        $orderItems = [];

        foreach ($items as $item) {
            $product = $products->get($item['product_id']);
            if (!$product) continue;

            $price = $product->price;
            $quantity = min($item['quantity'], $product->quantity);
            $total = $price * $quantity;
            $subtotal += $total;

            $orderItems[] = [
                'product_id' => $product->id,
                'seller_id' => $product->seller_id,
                'product_name' => $product->name,
                'product_image' => $product->image,
                'quantity' => $quantity,
                'price' => $price,
                'total' => $total,
            ];
        }

        $shippingCost = config('ecommerce.default_shipping_cost', 10);
        $taxRate = config('ecommerce.tax_rate', 0) / 100;
        $tax = round($subtotal * $taxRate, 2);
        $total = $subtotal + $tax + $shippingCost;

        DB::transaction(function () use ($request, $subtotal, $tax, $shippingCost, $total, $orderItems) {
            $order = Order::create([
                'user_id' => auth()->id(),
                'order_number' => 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(6)),
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => 'cod',
                'shipping_name' => $request->shipping_name,
                'shipping_email' => $request->shipping_email,
                'shipping_phone' => $request->shipping_phone,
                'shipping_address' => $request->shipping_address,
                'shipping_city' => $request->shipping_city,
                'shipping_zip' => $request->shipping_zip,
                'shipping_country' => $request->shipping_country,
                'notes' => $request->notes,
            ]);

            foreach ($orderItems as $item) {
                $order->items()->create($item);

                $product = Product::find($item['product_id']);
                if ($product) {
                    $product->decrement('quantity', $item['quantity']);
                }
            }
        });

        return redirect()->route('orders.index')->with('success', 'Order placed successfully!');
    }
}