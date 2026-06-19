import { useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const contactInfo = [
    {
        icon: Mail,
        title: 'Email',
        value: 'support@shamie.com',
        href: 'mailto:support@shamie.com',
    },
    {
        icon: Phone,
        title: 'Phone',
        value: '+1 (555) 123-4567',
        href: 'tel:+15551234567',
    },
    {
        icon: MapPin,
        title: 'Address',
        value: '123 Shopping Ave, Commerce City, CA 90210',
        href: null,
    },
    {
        icon: Clock,
        title: 'Hours',
        value: 'Mon-Fri: 9AM-6PM EST',
        href: null,
    },
];

export default function Contact() {
    const { flash } = usePage().props as { flash?: { status?: string } };
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact');
    };

    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Have a question or need help? We'd love to hear from you. 
                        Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Contact Information</h2>
                        <div className="space-y-4">
                            {contactInfo.map((item, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-lg',
                                        'bg-primary/10 text-primary'
                                    )}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{item.title}</div>
                                        {item.href ? (
                                            <a 
                                                href={item.href} 
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {item.value}
                                            </a>
                                        ) : (
                                            <div className="text-sm text-muted-foreground">{item.value}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Send us a message</CardTitle>
                                <CardDescription>
                                    Fill out the form below and we'll get back to you shortly.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {flash?.status && (
                                    <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        <span className="text-green-700 dark:text-green-400">{flash.status}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full name *</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="John Doe"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500">{errors.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email address *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="john@example.com"
                                                required
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-500">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone number</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject *</Label>
                                            <Input
                                                id="subject"
                                                value={data.subject}
                                                onChange={(e) => setData('subject', e.target.value)}
                                                placeholder="How can we help?"
                                                required
                                            />
                                            {errors.subject && (
                                                <p className="text-sm text-red-500">{errors.subject}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message *</Label>
                                        <Textarea
                                            id="message"
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder="Tell us more about your inquiry..."
                                            rows={6}
                                            required
                                        />
                                        {errors.message && (
                                            <p className="text-sm text-red-500">{errors.message}</p>
                                        )}
                                    </div>

                                    <Button type="submit" size="lg" disabled={processing} className="w-full md:w-auto">
                                        {processing ? (
                                            <>
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}