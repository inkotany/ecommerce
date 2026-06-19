import { usePage, router, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    processing: 'bg-purple-500',
    shipped: 'bg-indigo-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
    refunded: 'bg-orange-500',
};

export default function AdminOrdersShow() {
    const { order, statuses } = usePage<{
        order: any;
        statuses: Record<string, string>;
    }>().props;

    const { data, setData, put, processing } = useForm({
        status: order.status,
    });

    const handleStatusUpdate = () => {
        put(`/admin/orders/${order.id}/status`, {
            data: { status: data.status },
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <Link href="/admin/orders" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Orders
                </Link>

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Order {order.order_number}</h2>
                        <p className="text-muted-foreground">
                            Placed on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <Badge className={cn(statusColors[order.status], 'text-white')}>
                        {statuses[order.status] || order.status}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
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
                                            <h4 className="font-medium">{item.product_name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Sold by: {item.seller?.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">${Number(item.total).toFixed(2)}</p>
                                            <Badge variant="secondary">{item.status}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Update Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(statuses).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleStatusUpdate} disabled={processing} className="w-full">
                                    {processing ? 'Updating...' : 'Update Status'}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Customer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium">{order.user?.name}</p>
                                <p className="text-sm text-muted-foreground">{order.user?.email}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium">{order.shipping_name}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {order.shipping_address}<br />
                                    {order.shipping_city}, {order.shipping_zip}<br />
                                    {order.shipping_country}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${Number(order.subtotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>${Number(order.shipping_cost).toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${Number(order.total).toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}