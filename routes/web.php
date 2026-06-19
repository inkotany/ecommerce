<?php

use App\Http\Controllers\Web\CartController;
use App\Http\Controllers\Web\ContactController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\OrderController;
use App\Http\Controllers\Web\PageController;
use App\Http\Controllers\Web\ProductController;
use App\Http\Controllers\Web\ReviewController;
use Illuminate\Support\Facades\Route;

// Public Routes - Products page is the home page
Route::get('/', [ProductController::class, 'index'])->name('home');
Route::get('/products', fn() => redirect()->route('home'))->name('products.index');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/category/{slug}', [ProductController::class, 'category'])->name('products.category');

// Static Pages
Route::get('/about', fn() => inertia('about'))->name('about');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::get('/terms', function () {
    $content = 'Welcome to Shamie. By accessing or using our e-commerce platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.

1. **Account Registration** — You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. Notify us immediately of any unauthorized use.

2. **Products & Listings** — Sellers are responsible for the accuracy of their product listings, including descriptions, pricing, and images. We reserve the right to remove listings that violate our policies or applicable laws.

3. **Orders & Payments** — When you place an order, you agree to pay the total amount specified, including taxes and shipping. Orders are subject to acceptance and availability. We may cancel or refuse orders at our discretion.

4. **Shipping & Delivery** — Delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery. We are not liable for delays caused by carriers, weather, or other circumstances beyond our control.

5. **Returns & Refunds** — Products may be returned within 30 days of delivery in their original condition. Refunds are processed within 5–10 business days after we receive the returned item. Certain items may be non-returnable.

6. **Prohibited Conduct** — You agree not to: (a) use the platform for any unlawful purpose; (b) attempt to interfere with the platform\'s operation; (c) post false, misleading, or fraudulent content; (d) harass or abuse other users.

7. **Intellectual Property** — All content on this platform, including logos, designs, text, and images, is owned by Shamie or its licensors and is protected by intellectual property laws. You may not reproduce or distribute our content without permission.

8. **Limitation of Liability** — Shamie is provided "as is" without warranties of any kind. To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.

9. **Termination** — We may suspend or terminate your account at any time for violating these terms or for any other reason. Upon termination, your right to use the platform immediately ceases.

10. **Changes to Terms** — We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify you of material changes via email or platform notice.

11. **Governing Law** — These terms are governed by the laws of the jurisdiction in which Shamie operates. Any disputes shall be resolved in the courts of that jurisdiction.

Last updated: June 19, 2026. If you have questions about these terms, please contact us at support@shamie.com.';

    return inertia('static-page', ['page' => (object)[
        'title' => 'Terms of Service',
        'slug' => 'terms',
        'content' => $content,
    ]]);
})->name('terms');

Route::get('/privacy', function () {
    $content = 'At Shamie, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our e-commerce platform.

1. **Information We Collect** — We collect information you provide directly: name, email address, shipping address, payment information, phone number, and account credentials. We also automatically collect: IP address, browser type, device information, browsing behavior, and cookies.

2. **How We Use Your Information** — We use your information to: process and fulfill orders, communicate with you about your account and purchases, improve our platform and services, send marketing communications (with your consent), detect and prevent fraud, and comply with legal obligations.

3. **Payment Processing** — We do not store full credit card numbers on our servers. Payment transactions are processed by PCI-DSS compliant third-party payment processors. Your payment data is encrypted and handled in accordance with industry security standards.

4. **Cookies & Tracking** — We use cookies and similar technologies to enhance your experience, analyze usage patterns, and serve relevant advertisements. You can control cookie preferences through your browser settings. Disabling cookies may affect platform functionality.

5. **Information Sharing** — We share your information with: sellers (to fulfill orders), shipping carriers (for delivery), payment processors (for transactions), and service providers (for analytics, customer support, and marketing). We do not sell your personal information to third parties.

6. **Data Security** — We implement reasonable security measures including encryption, access controls, and regular security audits to protect your information. However, no method of transmission over the Internet is 100% secure.

7. **Data Retention** — We retain your information for as long as your account is active or as needed to provide services. After account closure, we may retain certain information for legal, tax, or fraud prevention purposes.

8. **Your Rights** — Depending on your jurisdiction, you may have the right to: access the personal data we hold about you, correct inaccurate data, delete your data, restrict or object to processing, and request data portability. Contact us to exercise these rights.

9. **Third-Party Links** — Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these sites. We encourage you to review their privacy policies before providing any personal information.

10. **Children\'s Privacy** — Our platform is not intended for individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will delete it promptly.

11. **International Transfers** — Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.

12. **Changes to This Policy** — We may update this Privacy Policy periodically. We will notify you of material changes by posting the updated policy on this page and, where appropriate, via email.

Last updated: June 19, 2026. If you have questions or concerns about this policy, please contact us at privacy@shamie.com or through our Contact page.';

    return inertia('static-page', ['page' => (object)[
        'title' => 'Privacy Policy',
        'slug' => 'privacy',
        'content' => $content,
    ]]);
})->name('privacy');

// Cart & Checkout (auth required)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart');
    Route::post('/checkout', [CartController::class, 'checkout'])->name('checkout');
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');

    // Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

// Auth routes (Laravel Fortify handles most of this)
require __DIR__ . '/settings.php';

// Admin routes
require __DIR__ . '/admin.php';

// Seller routes
require __DIR__ . '/seller.php';