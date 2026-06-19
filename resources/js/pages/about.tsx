import { Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { Shield, Truck, CreditCard, Headphones, Award, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function About() {
    const team = [
        { name: 'Sarah Mitchell', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
        { name: 'James Chen', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
        { name: 'Emily Rodriguez', role: 'Customer Success', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop' },
        { name: 'Michael Park', role: 'Technology Lead', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
    ];

    const values = [
        { icon: Shield, title: 'Secure Shopping', desc: 'Your data and transactions are protected with industry-leading encryption.' },
        { icon: Truck, title: 'Fast Delivery', desc: 'Get your orders quickly with our reliable shipping partners worldwide.' },
        { icon: CreditCard, title: 'Easy Payments', desc: 'Multiple payment options including cards, PayPal, and Buy Now Pay Later.' },
        { icon: Headphones, title: '24/7 Support', desc: 'Our dedicated team is always ready to help you with any questions.' },
        { icon: Award, title: 'Quality Guarantee', desc: 'Every product is verified for authenticity and quality before shipping.' },
        { icon: Heart, title: 'Community First', desc: 'We give back by supporting local communities and sustainable practices.' },
    ];

    return (
        <PublicLayout>
            {/* Hero */}
            <section className="relative h-[500px] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=600&fit=crop"
                    alt="Shopping"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
                <div className="relative container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-2xl text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Shamie</h1>
                        <p className="text-xl text-white/90">Your premium destination for quality products since 2018. We connect sellers and buyers in a trusted marketplace.</p>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                            <p className="text-muted-foreground mb-4">
                                Founded in 2018, Shamie began as a small team of passionate shoppers who believed online shopping could be better. We were frustrated with fake products, slow shipping, and poor customer service.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                Today, we've grown into a thriving marketplace with over 50,000 products from verified sellers worldwide. Our platform connects millions of buyers with trusted sellers, making quality shopping accessible to everyone.
                            </p>
                            <p className="text-muted-foreground">
                                We believe shopping should be exciting, not stressful. Every feature we build, every seller we onboard, and every package we ship is driven by our mission: to make online shopping delightful.
                            </p>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop"
                                alt="Our warehouse"
                                className="rounded-lg shadow-xl"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
                                <div className="text-4xl font-bold">50K+</div>
                                <div className="text-sm">Products Available</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '2M+', label: 'Happy Customers' },
                            { value: '50K+', label: 'Products' },
                            { value: '10K+', label: 'Verified Sellers' },
                            { value: '99.5%', label: 'Satisfaction Rate' },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">How We Work</h2>
                    <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
                        Our platform is built on trust, transparency, and technology. Here's what makes Shamie different.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { img: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=250&fit=crop', title: 'Curated Selection', desc: 'Every seller goes through a verification process. We check business credentials, customer reviews, and product quality before allowing anything to be listed.' },
                            { img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop', title: 'Secure Payments', desc: 'Your payment is protected until you confirm delivery. We use bank-level encryption and never store your full card details on our servers.' },
                            { img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop', title: 'Fast Shipping', desc: 'Most orders ship within 24 hours. We partner with major logistics companies to ensure your package arrives safely and quickly.' },
                        ].map((item, i) => (
                            <Card key={i} className="overflow-hidden">
                                <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((value, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="p-3 bg-white/10 rounded-lg h-fit">
                                    <value.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">{value.title}</h3>
                                    <p className="text-sm text-white/70">{value.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
                    <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
                        A passionate group of innovators, problem-solvers, and shopping enthusiasts working to make your experience better every day.
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, i) => (
                            <div key={i} className="text-center">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-background shadow-lg"
                                />
                                <h3 className="font-semibold">{member.name}</h3>
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                        Join millions of happy customers who trust Shamie for their everyday shopping needs.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/products">
                            <Button size="lg">Browse Products</Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="outline" size="lg">Contact Us</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}