import { usePage, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import SellerLayout from '@/layouts/seller/seller-layout';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ArrowLeft, MapPin, Phone, Mail } from 'lucide-react';

interface Order {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    subtotal: string;
    tax: string;
    shipping_cost: string;
    total: string;
    created_at: string;
    shipping_name: string;
    shipping_email: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_zip: string;
    shipping_country: string;
    items: {
        id: number;
        product_name: string;
        product_image: string;
        quantity: number;
        price: string;
        total: string;
        product?: { slug: string };
    }[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    processing: 'bg-purple-500',
    shipped: 'bg-indigo-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
    refunded: 'bg-orange-500',
};

export default function OrderShow() {
    const { order, website } = usePage<{ order: Order; website: { name: string; tagline: string } }>().props;

    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-8">
                <Link href="/orders" className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Orders
                </Link>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Order {order.order_number}</h1>
                        <p className="text-muted-foreground">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Badge className={cn(statusColors[order.status], 'text-white text-sm px-4 py-2')}>
                            {order.status}
                        </Badge>
                        <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                            Payment: {order.payment_status}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                            {item.product_image ? (
                                                <img
                                                    src={`/storage/products/${item.product_image}`}
                                                    alt={item.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                                    📦
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{item.product_name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">${Number(item.total).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${Number(order.subtotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>${Number(order.shipping_cost).toFixed(2)}</span>
                                </div>
                                {Number(order.tax) > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tax</span>
                                        <span>${Number(order.tax).toFixed(2)}</span>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${Number(order.total).toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="font-medium">{order.shipping_name}</p>
                                    <div className="flex items-start gap-2 text-muted-foreground">
                                        <MapPin className="w-4 h-4 mt-1" />
                                        <p>
                                            {order.shipping_address}<br />
                                            {order.shipping_city}, {order.shipping_state} {order.shipping_zip}<br />
                                            {order.shipping_country}
                                        </p>
                                    </div>
                                    {order.shipping_phone && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="w-4 h-4" />
                                            <span>{order.shipping_phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                        <span>{order.shipping_email}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}