import { usePage, Link } from '@inertiajs/react';
import SellerLayout from '@/layouts/seller/seller-layout';
import AdminLayout from '@/layouts/admin/admin-layout';
import PublicLayout from '@/layouts/public/public-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: string;
    created_at: string;
    items_count: number;
}

interface PageProps {
    orders: { data: Order[] };
    stats?: {
        products: number;
        active_products: number;
        total_orders: number;
        pending_orders: number;
        total_revenue: number;
    };
    recentOrders?: Order[];
    recentProducts?: any[];
    topProducts?: any[];
    recentUsers?: any[];
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

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
};

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function OrdersIndex({ title, Layout, emptyMessage = 'No orders yet' }: { title: string; Layout: React.ComponentType<{ children: React.ReactNode }>; emptyMessage?: string }) {
    const props = usePage<PageProps>().props;
    const orders = props.orders?.data || [];

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{title}</h2>
                </div>

                {orders.length > 0 ? (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order Number</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.order_number}</TableCell>
                                        <TableCell>{formatDate(order.created_at)}</TableCell>
                                        <TableCell>
                                            <Badge className={cn(statusColors[order.status], 'text-white')}>
                                                {statusLabels[order.status] || order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Link href={`/orders/${order.id}`} className="text-primary hover:underline">
                                                View
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                ) : (
                    <Card className="py-12 text-center">
                        <p className="text-muted-foreground">{emptyMessage}</p>
                    </Card>
                )}
            </div>
        </Layout>
    );
}

export default function OrdersCustomer() {
    const { website } = usePage<{ website: { name: string; tagline: string } }>().props;
    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>
                <OrdersIndex
                    title="Order History"
                    Layout={({ children }) => <div>{children}</div>}
                />
            </div>
        </PublicLayout>
    );
}