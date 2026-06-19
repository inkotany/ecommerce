import { usePage, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
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

export default function AdminOrdersIndex() {
    const { orders, statuses, filters } = usePage<{
        orders: { data: any[] };
        statuses: Record<string, string>;
        filters: any;
    }>().props;

    const [statusFilter, setStatusFilter] = useState(filters?.status || '');

    const handleFilter = (status: string) => {
        setStatusFilter(status);
        router.get('/admin/orders', status ? { status } : {});
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Orders</h2>
                    <Select value={statusFilter} onValueChange={handleFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Status</SelectItem>
                            {Object.entries(statuses).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.data.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.order_number}</TableCell>
                                    <TableCell>{order.user?.name}</TableCell>
                                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                                            {order.payment_status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={cn(statusColors[order.status], 'text-white')}>
                                            {statuses[order.status] || order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                                            View
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {orders.data.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No orders found</p>
                        </div>
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}