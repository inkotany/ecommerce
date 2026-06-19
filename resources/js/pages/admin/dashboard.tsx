import { usePage, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Package, ShoppingCart, DollarSign, UserPlus, PackagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    processing: 'bg-purple-500',
    shipped: 'bg-indigo-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
};

export default function AdminDashboard() {
    const { stats, recentOrders, recentUsers, topProducts } = usePage<{
        stats: {
            total_users: number;
            total_sellers: number;
            total_customers: number;
            total_products: number;
            total_orders: number;
            pending_orders: number;
            total_revenue: number;
            monthly_revenue: number;
        };
        recentOrders: any[];
        recentUsers: any[];
        topProducts: any[];
    }>().props;

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Users</p>
                                    <p className="text-2xl font-bold">{stats.total_users}</p>
                                    <p className="text-xs text-muted-foreground">{stats.total_sellers} sellers, {stats.total_customers} customers</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-lg">
                                    <Package className="w-6 h-6 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Products</p>
                                    <p className="text-2xl font-bold">{stats.total_products}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    <ShoppingCart className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Orders</p>
                                    <p className="text-2xl font-bold">{stats.total_orders}</p>
                                    <p className="text-xs text-muted-foreground">{stats.pending_orders} pending</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-500/10 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Revenue</p>
                                    <p className="text-2xl font-bold">${Number(stats.total_revenue).toFixed(2)}</p>
                                    <p className="text-xs text-muted-foreground">${Number(stats.monthly_revenue).toFixed(2)} this month</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap gap-4">
                    <Link href="/admin/users">
                        <Badge variant="outline" className="px-4 py-2 gap-2">
                            <Users className="w-4 h-4" />
                            Manage Users
                        </Badge>
                    </Link>
                    <Link href="/admin/products">
                        <Badge variant="outline" className="px-4 py-2 gap-2">
                            <Package className="w-4 h-4" />
                            Manage Products
                        </Badge>
                    </Link>
                    <Link href="/admin/orders">
                        <Badge variant="outline" className="px-4 py-2 gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Manage Orders
                        </Badge>
                    </Link>
                    <Link href="/admin/categories">
                        <Badge variant="outline" className="px-4 py-2 gap-2">
                            <PackagePlus className="w-4 h-4" />
                            Categories
                        </Badge>
                    </Link>
                </div>

                {/* Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Recent Orders</h3>
                                <Link href="/admin/orders" className="text-sm text-primary hover:underline">
                                    View all
                                </Link>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">{order.order_number}</TableCell>
                                            <TableCell>{order.user?.name}</TableCell>
                                            <TableCell>
                                                <Badge className={cn(statusColors[order.status], 'text-white')}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Recent Users</h3>
                                <Link href="/admin/users" className="text-sm text-primary hover:underline">
                                    View all
                                </Link>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{user.role}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}