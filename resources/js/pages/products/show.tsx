import { usePage, useForm, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function ProductShow() {
    const { product, reviews, relatedProducts, website, auth } = usePage<{
        product: any;
        reviews: { data: any[] };
        relatedProducts: any[];
        website: { name: string; tagline: string };
        auth: { user: any };
    }>().props;

    const { data, setData, post, processing } = useForm({
        rating: 5,
        title: '',
        content: '',
    });

    const [quantity, setQuantity] = useState(1);
    const [imgError, setImgError] = useState(false);
    const discount = product.compare_price && Number(product.compare_price) > Number(product.price)
        ? Math.round(((Number(product.compare_price) - Number(product.price)) / Number(product.compare_price)) * 100)
        : null;

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/reviews`, {
            data: { ...data, product_id: product.id },
        });
    };

    return (
        <PublicLayout>
            <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
                {/* Breadcrumb */}
                <nav className="text-sm mb-8 text-muted-foreground">
                    <a href="/" className="hover:text-foreground transition-colors">Home</a>
                    <span className="mx-2">/</span>
                    <a href="/products" className="hover:text-foreground transition-colors">Products</a>
                    <span className="mx-2">/</span>
                    <span className="text-foreground font-medium">{product.name}</span>
                </nav>

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-20">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
                            {product.image && !imgError ? (
                                <img
                                    src={`/storage/products/${product.image}`}
                                    alt={product.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-6 lg:space-y-7">
                        <div>
                            {product.category?.name && (
                                <Badge variant="secondary" className="mb-3 border-0 bg-muted text-muted-foreground font-medium">
                                    {product.category.name}
                                </Badge>
                            )}
                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">{product.name}</h1>
                            {product.rating !== undefined && product.rating > 0 && (
                                <div className="flex items-center gap-2 mt-3">
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={cn(
                                                    "w-4 h-4",
                                                    star <= product.rating ? "fill-amber-400 text-amber-400" : "text-muted"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {Number(product.rating || 0).toFixed(1)}
                                        {product.review_count > 0 && <> ({product.review_count} reviews)</>}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">${Number(product.price).toFixed(2)}</span>
                            {product.compare_price && discount && (
                                <>
                                    <span className="text-xl text-muted-foreground line-through">${Number(product.compare_price).toFixed(2)}</span>
                                    <Badge className="bg-destructive text-destructive-foreground border-0 font-medium">{discount}% OFF</Badge>
                                </>
                            )}
                        </div>

                        {product.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{product.location}</span>
                            </div>
                        )}

                        <Separator />

                        <div className="text-muted-foreground leading-relaxed space-y-3">
                            {product.short_description && <p className="text-base text-foreground/80">{product.short_description}</p>}
                            {product.description && <p className="text-sm">{product.description}</p>}
                        </div>

                        <Separator />

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center gap-3">
                                <Label className="text-sm font-medium text-foreground">Quantity:</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    max={product.quantity}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.min(Number(e.target.value), product.quantity))}
                                    className="w-20 h-10 text-center rounded-xl"
                                />
                            </div>
                            <Button
                                size="lg"
                                className="flex-1 h-12 rounded-xl text-base font-medium"
                                disabled={product.quantity <= 0}
                                onClick={() => {
                                    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                                    const existing = cart.find((item: any) => item.product_id === product.id);
                                    if (existing) {
                                        existing.quantity += quantity;
                                    } else {
                                        cart.push({
                                            product_id: product.id,
                                            name: product.name,
                                            price: product.price,
                                            image: product.image,
                                            quantity,
                                        });
                                    }
                                    localStorage.setItem('cart', JSON.stringify(cart));
                                    window.location.href = '/cart';
                                }}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                            <div className="flex items-center gap-2.5 text-sm text-muted-foreground bg-muted/50 rounded-xl px-4 py-3">
                                <ShieldCheck className="w-4 h-4 shrink-0" />
                                <span>Secure Checkout</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm text-muted-foreground bg-muted/50 rounded-xl px-4 py-3">
                                <Truck className="w-4 h-4 shrink-0" />
                                <span>Fast Delivery</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm text-muted-foreground bg-muted/50 rounded-xl px-4 py-3">
                                <RotateCcw className="w-4 h-4 shrink-0" />
                                <span>Easy Returns</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seller Info */}
                <Card className="mb-12 lg:mb-20 bg-muted/20">
                    <CardContent className="p-6 lg:p-8">
                        <h3 className="font-semibold text-sm text-foreground tracking-wide uppercase mb-5">Seller Information</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                <span className="text-base font-semibold text-foreground">{product.seller?.name?.charAt(0) || '?'}</span>
                            </div>
                            <div>
                                <p className="font-medium text-foreground">{product.seller?.name || 'Unknown Seller'}</p>
                                <p className="text-sm text-muted-foreground">Seller</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reviews */}
                {auth.user && (
                    <Card className="mb-12 lg:mb-20 border-muted">
                        <CardHeader>
                            <CardTitle className="text-lg text-foreground">Write a Review</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmitReview} className="space-y-5">
                                <div>
                                    <Label className="text-sm font-medium text-foreground">Rating</Label>
                                    <div className="flex gap-2 mt-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setData('rating', star)}
                                            >
                                                <Star
                                                    className={cn(
                                                        "w-6 h-6 cursor-pointer transition-colors",
                                                        star <= data.rating ? "fill-amber-400 text-amber-400" : "text-muted hover:text-amber-400"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-foreground">Title</Label>
                                    <Input
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Summarize your experience"
                                        className="mt-1.5 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-foreground">Review</Label>
                                    <Textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder="Share your thoughts about this product..."
                                        rows={4}
                                        className="mt-1.5 rounded-xl"
                                    />
                                </div>
                                <Button type="submit" disabled={processing} className="rounded-xl">
                                    Submit Review
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Review List */}
                {reviews.data && reviews.data.length > 0 ? (
                    <div className="mb-12 lg:mb-20">
                        <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground mb-8">Customer Reviews ({reviews.total})</h2>
                        <div className="space-y-4">
                            {reviews.data.map((review) => (
                                <Card key={review.id} className="border-muted">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                    <span className="text-sm font-semibold text-foreground">{review.user?.name?.charAt(0) || '?'}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-foreground">{review.user?.name || 'Anonymous'}</p>
                                                    <div className="flex items-center gap-0.5 mt-0.5">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={cn(
                                                                    "w-3 h-3",
                                                                    star <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            {review.is_verified && (
                                                <Badge variant="outline" className="text-emerald-600 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-xs font-medium shrink-0">
                                                    Verified Purchase
                                                </Badge>
                                            )}
                                        </div>
                                        {review.title && <p className="mt-4 font-medium text-foreground">{review.title}</p>}
                                        {review.content && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{review.content}</p>}
                                        <p className="mt-3 text-xs text-muted-foreground">
                                            {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        
                        {/* Pagination for reviews */}
                        {reviews.links && reviews.links.length > 3 && (
                            <div className="flex justify-center mt-8">
                                <div className="flex gap-1.5">
                                    {reviews.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={cn(
                                                "min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all",
                                                link.active ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted",
                                                !link.url && "opacity-50 cursor-not-allowed"
                                            )}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mb-12 lg:mb-20 text-center py-16 bg-muted/30 rounded-xl">
                        <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                    </div>
                )}

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">Related Products</h2>
                                <p className="text-sm text-muted-foreground mt-1">You might also like</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}