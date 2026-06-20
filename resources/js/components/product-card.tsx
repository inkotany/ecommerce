import { Link } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        slug: string;
        price: string | number;
        compare_price?: string | number | null;
        image?: string | null;
        rating?: number;
        review_count?: number;
        condition?: string;
        quantity?: number;
    };
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [imgError, setImgError] = useState(false);

    const discount = product.compare_price && Number(product.compare_price) > Number(product.price)
        ? Math.round(((Number(product.compare_price) - Number(product.price)) / Number(product.compare_price)) * 100)
        : null;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find((item: any) => item.product_id === product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                product_id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-updated'));
    };

    const outOfStock = !product.quantity || product.quantity <= 0;

    return (
        <div
            className={cn('group', className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card className="overflow-hidden bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Image Container */}
                <Link href={`/products/${product.slug}`} className="relative block aspect-square bg-muted overflow-hidden">
                    {product.image && !imgError ? (
                        <img
                            src={`/storage/products/${product.image}`}
                            alt={product.name}
                            loading="lazy"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {discount && (
                            <Badge className="bg-destructive hover:bg-destructive text-destructive-foreground font-medium px-3 py-1">
                                -{discount}%
                            </Badge>
                        )}
                        {product.condition && product.condition !== 'new' && (
                            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm border-0">
                                {product.condition.replace('_', ' ')}
                            </Badge>
                        )}
                    </div>

                    {/* Wishlist Button - Hidden by default, shown on hover (block style) */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsLiked(!isLiked);
                        }}
                        className={cn(
                            'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100',
                            isLiked
                                ? 'bg-destructive text-destructive-foreground opacity-100'
                                : 'bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive'
                        )}
                    >
                        <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
                    </button>

                    {/* Quick Add Overlay - from block's hover pattern */}
                    <div className={cn(
                        'absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent transition-all duration-300',
                        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    )}>
                        <Button
                            onClick={handleAddToCart}
                            disabled={outOfStock}
                            size="sm"
                            className="w-full bg-background text-foreground hover:bg-background/90 font-medium shadow-sm"
                        >
                            <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                    </div>
                </Link>

                {/* Content */}
                <div className="p-4">
                    <Link href={`/products/${product.slug}`} className="block group/link">
                        {/* Product Name */}
                        <h3 className="font-medium text-sm leading-snug text-foreground group-hover/link:text-primary transition-colors line-clamp-2 mb-2">
                            {product.name}
                        </h3>

                        {/* Rating */}
                        {product.rating !== undefined && product.rating > 0 && (
                            <div className="flex items-center gap-1 mb-3">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-medium">{Number(product.rating).toFixed(1)}</span>
                                {product.review_count !== undefined && product.review_count > 0 && (
                                    <span className="text-xs text-muted-foreground">({product.review_count})</span>
                                )}
                            </div>
                        )}

                        {/* Price - from block's clean style */}
                        <div className="flex items-center gap-2">
                            <span className="text-base font-semibold text-foreground">
                                ${Number(product.price).toFixed(2)}
                            </span>
                            {product.compare_price && discount && (
                                <span className="text-sm text-muted-foreground line-through">
                                    ${Number(product.compare_price).toFixed(2)}
                                </span>
                            )}
                        </div>
                    </Link>

                    {/* Buy Now / Add to Cart - From block's two-button pattern */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        <Button
                            size="sm"
                            className="w-full font-medium"
                            disabled={outOfStock}
                            onClick={handleAddToCart}
                        >
                            {outOfStock ? 'Sold Out' : 'Buy Now'}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full font-medium"
                            disabled={outOfStock}
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
