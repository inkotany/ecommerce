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
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="text-sm mb-6 text-muted-foreground">
                    <a href="/">Home</a> / <a href="/products">Products</a> / <span className="text-foreground">{product.name}</span>
                </nav>

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                            {product.image ? (
                                <img
                                    src={`/storage/products/${product.image}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-6">
                        <div>
                            <Badge variant="secondary" className="mb-2">{product.category?.name}</Badge>
                            <h1 className="text-3xl font-bold">{product.name}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={cn(
                                                "w-4 h-4",
                                                star <= product.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {Number(product.rating || 0).toFixed(1)} ({product.review_count} reviews)
                                </span>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-primary">${Number(product.price).toFixed(2)}</span>
                            {product.compare_price && discount && (
                                <>
                                    <span className="text-xl text-muted-foreground line-through">${Number(product.compare_price).toFixed(2)}</span>
                                    <Badge className="bg-red-500">{discount}% OFF</Badge>
                                </>
                            )}
                        </div>

                        {product.location && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{product.location}</span>
                            </div>
                        )}

                        <Separator />

                        <div className="prose prose-sm max-w-none text-muted-foreground">
                            {product.short_description && <p className="text-base">{product.short_description}</p>}
                            {product.description && <p>{product.description}</p>}
                        </div>

                        <Separator />

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center gap-2">
                                <Label>Quantity:</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    max={product.quantity}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.min(Number(e.target.value), product.quantity))}
                                    className="w-20"
                                />
                            </div>
                            <Button
                                size="lg"
                                className="flex-1"
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Secure Checkout</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Truck className="w-4 h-4" />
                                <span>Fast Delivery</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <RotateCcw className="w-4 h-4" />
                                <span>Easy Returns</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seller Info */}
                <Card className="mb-16">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Seller Information</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-lg font-semibold">{product.seller?.name?.charAt(0)}</span>
                            </div>
                            <div>
                                <p className="font-medium">{product.seller?.name}</p>
                                <p className="text-sm text-muted-foreground">Seller</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reviews */}
                {auth.user && (
                    <Card className="mb-16">
                        <CardHeader>
                            <CardTitle>Write a Review</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                <div>
                                    <Label>Rating</Label>
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
                                                        star <= data.rating ? "fill-yellow-400 text-yellow-400" : "text-muted hover:text-yellow-400"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label>Title</Label>
                                    <Input
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Summarize your experience"
                                    />
                                </div>
                                <div>
                                    <Label>Review</Label>
                                    <Textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder="Share your thoughts about this product..."
                                        rows={4}
                                    />
                                </div>
                                <Button type="submit" disabled={processing}>Submit Review</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Review List */}
                {reviews.data && reviews.data.length > 0 ? (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold mb-6">Customer Reviews ({reviews.total})</h2>
                        <div className="space-y-4">
                            {reviews.data.map((review) => (
                                <Card key={review.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-sm font-semibold">{review.user?.name?.charAt(0) || '?'}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{review.user?.name || 'Anonymous'}</p>
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={cn(
                                                                    "w-3 h-3",
                                                                    star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            {review.is_verified && (
                                                <Badge variant="outline" className="text-green-600 border-green-600">
                                                    Verified Purchase
                                                </Badge>
                                            )}
                                        </div>
                                        {review.title && <p className="mt-4 font-medium">{review.title}</p>}
                                        {review.content && <p className="mt-2 text-muted-foreground">{review.content}</p>}
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        
                        {/* Pagination for reviews */}
                        {reviews.links && reviews.links.length > 3 && (
                            <div className="flex justify-center mt-6">
                                <div className="flex gap-2">
                                    {reviews.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={cn(
                                                "px-4 py-2 rounded-md text-sm",
                                                link.active ? "bg-primary text-primary-foreground" : "bg-background border hover:bg-accent",
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
                    <div className="mb-16 text-center py-12 bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                    </div>
                )}

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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