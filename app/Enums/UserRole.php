<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case SELLER = 'seller';
    case CUSTOMER = 'customer';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrator',
            self::SELLER => 'Seller',
            self::CUSTOMER => 'Customer',
        };
    }

    public function isAdmin(): bool
    {
        return $this === self::ADMIN;
    }

    public function isSeller(): bool
    {
        return $this === self::SELLER;
    }

    public function isCustomer(): bool
    {
        return $this === self::CUSTOMER;
    }

    public function isSellerOrAdmin(): bool
    {
        return in_array($this, [self::SELLER, self::ADMIN], true);
    }

    public static function values(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}
