<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'order_number', 'status', 'subtotal', 'tax',
        'shipping_cost', 'total', 'payment_method', 'payment_status',
        'payment_id', 'notes', 'shipping_name', 'shipping_email',
        'shipping_phone', 'shipping_address', 'shipping_city',
        'shipping_state', 'shipping_zip', 'shipping_country',
        'paid_at', 'shipped_at', 'delivered_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'total' => 'decimal:2',
        'paid_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (empty($order->order_number)) {
                $order->order_number = 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(6));
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForSeller($query, $sellerId)
    {
        return $query->whereHas('items', fn($q) => $q->where('seller_id', $sellerId));
    }

    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    public function canReview(): bool
    {
        return $this->status === 'delivered' && $this->payment_status === 'paid';
    }

    public function getShippingAddressFormattedAttribute(): string
    {
        $parts = array_filter([
            $this->shipping_address,
            $this->shipping_city,
            $this->shipping_state,
            $this->shipping_zip,
            $this->shipping_country,
        ]);
        return implode(', ', $parts);
    }
}