import { Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { Button } from '@/components/ui/button';

export default function About() {
    return (
        <PublicLayout>
            {/* Our Story */}
            <section className="py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-6">Our Story</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Founded in 2018, Shamie began as a small team of passionate shoppers who believed online shopping could be better. We were frustrated with fake products, slow shipping, and poor customer service.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Today, we've grown into a thriving marketplace with over 50,000 products from verified sellers worldwide. Our platform connects millions of buyers with trusted sellers, making quality shopping accessible to everyone.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                We believe shopping should be exciting, not stressful. Every feature we build, every seller we onboard, and every package we ship is driven by our mission: to make online shopping delightful.
                            </p>
                            <div className="mt-8">
                                <Link href="/products">
                                    <Button size="lg" className="rounded-xl h-12 px-8">
                                        Browse Products
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop"
                                alt="Our warehouse"
                                className="rounded-xl shadow-xl"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-foreground text-background p-6 rounded-xl shadow-lg">
                                <div className="text-4xl font-bold tracking-tight">50K+</div>
                                <div className="text-sm text-background/70">Products Available</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}