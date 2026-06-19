<?php

return [
    // Website Settings
    'website_name' => env('WEBSITE_NAME', 'Shamie e-shopping'),
    'website_tagline' => env('WEBSITE_TAGLINE', 'Your Premium Shopping Experience'),

    // Admin Account
    'admin' => [
        'name' => env('ADMIN_NAME', 'Admin'),
        'email' => env('ADMIN_EMAIL', 'admin@shamie.com'),
        'password' => env('ADMIN_PASSWORD', 'admin123'),
    ],

    // Currency & Pricing
    'currency' => env('CURRENCY', 'USD'),
    'currency_symbol' => env('CURRENCY_SYMBOL', '$'),
    'tax_rate' => env('TAX_RATE', 0),

    // Shipping
    'free_shipping_threshold' => env('FREE_SHIPPING_THRESHOLD', 100),
    'default_shipping_cost' => env('DEFAULT_SHIPPING_COST', 10),

    // Pagination
    'products_per_page' => env('PRODUCTS_PER_PAGE', 24),
    'reviews_per_page' => env('REVIEWS_PER_PAGE', 10),
    'orders_per_page' => env('ORDERS_PER_PAGE', 15),

    // Image Settings
    'product_image_max_size' => env('PRODUCT_IMAGE_MAX_SIZE', 2048),
    'product_image_types' => ['jpg', 'jpeg', 'png', 'webp'],
    'review_image_max_size' => env('REVIEW_IMAGE_MAX_SIZE', 1024),

    // Product Conditions
    'product_conditions' => [
        'new' => 'New',
        'like_new' => 'Like New',
        'used' => 'Used',
    ],

    // Order Statuses
    'order_statuses' => [
        'pending' => 'Pending',
        'confirmed' => 'Confirmed',
        'processing' => 'Processing',
        'shipped' => 'Shipped',
        'delivered' => 'Delivered',
        'cancelled' => 'Cancelled',
        'refunded' => 'Refunded',
    ],

    // Pagination defaults
    'per_page' => 15,
];