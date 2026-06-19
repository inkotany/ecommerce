import { Link, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Star, MapPin, ShoppingBag, Heart } from 'lucide-react';
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
        location?: string | null;
        condition?: string;
        quantity?: number;
        seller?: {
            name: string;
        };
    };
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

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

        // Show feedback
        const btn = e.currentTarget as HTMLButtonElement;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg>Added!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 1500);
    };

    const outOfStock = !product.quantity || product.quantity <= 0;

    return (
        <Card
            className={cn(
                'group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border shadow-lg bg-card',
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] bg-muted overflow-hidden">
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    {product.image ? (
                        <img
                            src={`/storage/products/${product.image}`}
                            alt={product.name}
                            className={cn(
                                'object-cover w-full h-full transition-transform duration-500',
                                isHovered ? 'scale-110' : 'scale-100'
                            )}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {discount && (
                        <Badge className="bg-destructive hover:bg-destructive text-destructive-foreground font-bold px-3 py-1">
                            -{discount}%
                        </Badge>
                    )}
                    {product.condition && product.condition !== 'new' && (
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                            {product.condition.replace('_', ' ')}
                        </Badge>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsLiked(!isLiked);
                    }}
                    className={cn(
                        'absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
                        isLiked
                            ? 'bg-destructive text-destructive-foreground'
                            : 'bg-background/90 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:bg-background'
                    )}
                >
                    <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
                </button>

                {/* Quick Add Overlay */}
                <div
                    className={cn(
                        'absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300',
                        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    )}
                >
                    <Button
                        onClick={handleAddToCart}
                        disabled={outOfStock}
                        className="w-full bg-background text-foreground hover:bg-background/90 font-semibold shadow-lg"
                        size="lg"
                    >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                </div>
            </div>

            {/* Content */}
            <CardContent className="p-5">
                <Link href={`/products/${product.slug}`} className="block group/link">
                    {/* Product Name - Big and Bold */}
                    <h3 className="font-bold text-lg leading-tight text-foreground group-hover/link:text-primary transition-colors line-clamp-2 mb-2">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        'w-4 h-4',
                                        star <= (product.rating || 0)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'fill-muted text-muted'
                                    )}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground ml-1">
                            ({product.review_count || 0})
                        </span>
                    </div>

                    {/* Location */}
                    {product.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{product.location}</span>
                        </div>
                    )}

                    {/* Price Section */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-bold text-primary">
                            ${Number(product.price).toFixed(2)}
                        </span>
                        {product.compare_price && discount && (
                            <span className="text-lg text-muted-foreground line-through">
                                ${Number(product.compare_price).toFixed(2)}
                            </span>
                        )}
                    </div>
                </Link>

                {/* Buy Button - Always Visible */}
                <Button
                    onClick={handleAddToCart}
                    disabled={outOfStock}
                    className="w-full mt-4 font-semibold"
                    size="lg"
                    variant={outOfStock ? 'secondary' : 'default'}
                >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {outOfStock ? 'Out of Stock' : 'Buy Now'}
                </Button>
            </CardContent>
        </Card>
    );
}
