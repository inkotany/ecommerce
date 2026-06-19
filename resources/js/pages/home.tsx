import { usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { ProductCard } from '@/components/product-card';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles, Shield, Truck } from 'lucide-react';

export default function Home() {
    const { featuredProducts, recentProducts, categories, website } = usePage<{
        featuredProducts: any[];
        recentProducts: any[];
        categories: any[];
        website: { name: string; tagline: string };
    }>().props;

    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                                {website.name}
                            </span>
                        </h1>
                        <p className="mt-6 text-xl text-muted-foreground">
                            {website.tagline}
                        </p>
                        <div className="mt-8 flex gap-4 justify-center">
                            <Link href="/products">
                                <Button size="lg" className="gap-2">
                                    Shop Now
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button variant="outline" size="lg">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-12 border-y bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Premium Quality</h3>
                                <p className="text-sm text-muted-foreground">Handpicked products from trusted sellers</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Secure Shopping</h3>
                                <p className="text-sm text-muted-foreground">Your transactions are protected</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Truck className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Fast Delivery</h3>
                                <p className="text-sm text-muted-foreground">Get your orders quickly</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">Featured Products</h2>
                            <Link href="/products" className="text-primary hover:underline">
                                View all →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Categories */}
            {categories.length > 0 && (
                <section className="py-16 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {categories.map((category) => (
                                <Link key={category.id} href={`/category/${category.slug}`}>
                                    <Card className="p-4 text-center hover:bg-accent transition-colors cursor-pointer">
                                        <CardContent>
                                            <div className="text-3xl mb-2">{category.icon || '📦'}</div>
                                            <p className="font-medium text-sm">{category.name}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Recent Products */}
            {recentProducts.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">Recently Added</h2>
                            <Link href="/products" className="text-primary hover:underline">
                                View all →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {recentProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold">Start Selling Today</h2>
                    <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
                        Join our community of sellers and reach thousands of customers looking for quality products.
                    </p>
                    <Link href="/register?role=seller">
                        <Button size="lg" variant="secondary" className="mt-8">
                            Become a Seller
                        </Button>
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}