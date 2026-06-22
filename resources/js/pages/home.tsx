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
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
                            <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                                {website.name}
                            </span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                            {website.tagline}
                        </p>
                        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                            <Link href="/products">
                                <Button
                                    size="lg"
                                    className="h-12 gap-2 rounded-xl px-8 text-base"
                                >
                                    Shop Now
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-12 rounded-xl px-8 text-base"
                                >
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
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="flex items-center gap-4">
                            <div className="shrink-0 rounded-xl bg-primary/[0.08] p-3">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">
                                    Premium Quality
                                </h3>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Handpicked products from trusted sellers
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="shrink-0 rounded-xl bg-primary/[0.08] p-3">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">
                                    Secure Shopping
                                </h3>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Your transactions are protected
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="shrink-0 rounded-xl bg-primary/[0.08] p-3">
                                <Truck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">
                                    Fast Delivery
                                </h3>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Get your orders quickly
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mb-10 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                                    Featured Products
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Our handpicked selection for you
                                </p>
                            </div>
                            <Link href="/products">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5 rounded-xl"
                                >
                                    View all
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Categories */}
            {categories.length > 0 && (
                <section className="bg-muted/30 py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mb-10 text-center">
                            <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                                Shop by Category
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Find exactly what you need
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                >
                                    <Card className="cursor-pointer bg-muted/20 p-5 text-center transition-all duration-200 hover:bg-accent hover:shadow-sm">
                                        <CardContent className="p-0">
                                            <div className="mb-2 text-3xl">
                                                {category.icon || '📦'}
                                            </div>
                                            <p className="text-sm font-medium text-foreground">
                                                {category.name}
                                            </p>
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
                        <div className="mb-10 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                                    Recently Added
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    The latest arrivals
                                </p>
                            </div>
                            <Link href="/products">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5 rounded-xl"
                                >
                                    View all
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                            {recentProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="bg-foreground text-background">
                <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:py-28">
                    <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
                        Start Selling Today
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl leading-relaxed text-background/70">
                        Join our community of sellers and reach thousands of
                        customers looking for quality products.
                    </p>
                    <Link href="/register?role=seller">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="mt-8 h-12 rounded-xl px-8 text-base"
                        >
                            Become a Seller
                        </Button>
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
