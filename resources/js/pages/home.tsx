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
            <section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.03] to-background py-24 md:py-36 lg:py-44">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
                            <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                                {website.name}
                            </span>
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                            {website.tagline}
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/products">
                                <Button size="lg" className="gap-2 h-12 px-8 text-base rounded-xl">
                                    Shop Now
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-xl">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-muted/30">
                <div className="mx-auto max-w-7xl px-6 py-10 lg:py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-primary/[0.08] shrink-0">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-foreground">Premium Quality</h3>
                                <p className="text-sm text-muted-foreground mt-0.5">Handpicked products from trusted sellers</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-primary/[0.08] shrink-0">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-foreground">Secure Shopping</h3>
                                <p className="text-sm text-muted-foreground mt-0.5">Your transactions are protected</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-primary/[0.08] shrink-0">
                                <Truck className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-foreground">Fast Delivery</h3>
                                <p className="text-sm text-muted-foreground mt-0.5">Get your orders quickly</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Featured Products</h2>
                                <p className="text-sm text-muted-foreground mt-1">Our handpicked selection for you</p>
                            </div>
                            <Link href="/products">
                                <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
                                    View all
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Categories */}
            {categories.length > 0 && (
                <section className="py-16 lg:py-24 bg-muted/30">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Shop by Category</h2>
                            <p className="text-sm text-muted-foreground mt-1">Find exactly what you need</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {categories.map((category) => (
                                <Link key={category.id} href={`/category/${category.slug}`}>
                                    <Card className="p-5 text-center hover:bg-accent transition-all duration-200 hover:shadow-sm cursor-pointer bg-muted/20">
                                        <CardContent className="p-0">
                                            <div className="text-3xl mb-2">{category.icon || '📦'}</div>
                                            <p className="font-medium text-sm text-foreground">{category.name}</p>
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
                <section className="py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Recently Added</h2>
                                <p className="text-sm text-muted-foreground mt-1">The latest arrivals</p>
                            </div>
                            <Link href="/products">
                                <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
                                    View all
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {recentProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="bg-foreground text-background">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Start Selling Today</h2>
                    <p className="mt-4 text-background/70 max-w-xl mx-auto leading-relaxed">
                        Join our community of sellers and reach thousands of customers looking for quality products.
                    </p>
                    <Link href="/register?role=seller">
                        <Button size="lg" variant="secondary" className="mt-8 h-12 px-8 text-base rounded-xl">
                            Become a Seller
                        </Button>
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}