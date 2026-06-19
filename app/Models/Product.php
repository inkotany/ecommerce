<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id', 'category_id', 'name', 'slug', 'description',
        'short_description', 'price', 'compare_price', 'quantity', 'sku',
        'image', 'images', 'location', 'condition', 'is_featured',
        'is_active', 'allow_reviews', 'rating', 'review_count', 'specifications',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'images' => 'array',
        'specifications' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'allow_reviews' => 'boolean',
        'rating' => 'decimal:2',
        'quantity' => 'integer',
        'review_count' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class)->where('status', 'approved');
    }

    public function allReviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true)->where('is_active', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('quantity', '>', 0);
    }

    public function scopeForSeller($query, $userId)
    {
        return $query->where('seller_id', $userId);
    }

    public function getDiscountPercentAttribute(): ?int
    {
        if (!$this->compare_price || $this->compare_price <= $this->price) {
            return null;
        }
        return round((($this->compare_price - $this->price) / $this->compare_price) * 100);
    }

    public function getIsInStockAttribute(): bool
    {
        return $this->quantity > 0;
    }

    public function getMainImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }
        return asset('storage/products/' . $this->image);
    }

    public function updateRating(): void
    {
        $stats = $this->reviews()->selectRaw('AVG(rating) as avg, COUNT(*) as count')->first();

        $this->update([
            'rating' => $stats->avg ?? 0,
            'review_count' => $stats->count ?? 0,
        ]);
    }
}