<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'content', 'meta_title',
        'meta_description', 'is_active', 'type', 'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    public static function getAbout(): ?self
    {
        return static::active()->ofType('about')->first();
    }

    public static function getContact(): ?self
    {
        return static::active()->ofType('contact')->first();
    }

    public static function getTerms(): ?self
    {
        return static::active()->ofType('terms')->first();
    }

    public static function getPrivacy(): ?self
    {
        return static::active()->ofType('privacy')->first();
    }
}