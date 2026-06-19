import { usePage, Link } from '@inertiajs/react';
import SellerLayout from '@/layouts/seller/seller-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, ShoppingCart, DollarSign, AlertCircle, Plus } from 'lucide-react';

export default function SellerDashboard() {
    const { stats, recentOrders, recentProducts } = usePage<{
        stats: {
            products: number;
            active_products: number;
            total_orders: number;
            pending_orders: number;
            total_revenue: number;
        };
        recentOrders: any[];
        recentProducts: any[];
    }>().props;

    return (
        <SellerLayout>
            <div className="space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Package className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Products</p>
                                    <p className="text-2xl font-bold">{stats.products}</p>
                                    <p className="text-xs text-muted-foreground">{stats.active_products} active</p>
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
                                    <p className="text-sm text-muted-foreground">Total Orders</p>
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
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-500/10 rounded-lg">
                                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                                    <p className="text-2xl font-bold">{stats.pending_orders}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-4">
                    <Link href="/seller/products/create">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add New Product
                        </Button>
                    </Link>
                    <Link href="/seller/products">
                        <Button variant="outline">Manage Products</Button>
                    </Link>
                    <Link href="/seller/orders">
                        <Button variant="outline">View Orders</Button>
                    </Link>
                </div>

                {/* Recent Orders & Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Orders</CardTitle>
                            <Link href="/seller/orders" className="text-sm text-primary hover:underline">
                                View all
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recentOrders.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">{order.order_number}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{order.status}</Badge>
                                                </TableCell>
                                                <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">No orders yet</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Products</CardTitle>
                            <Link href="/seller/products" className="text-sm text-primary hover:underline">
                                View all
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recentProducts.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Stock</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                                                <TableCell>
                                                    {product.quantity > 0 ? (
                                                        <span className="text-green-600">{product.quantity}</span>
                                                    ) : (
                                                        <span className="text-red-600">Out of stock</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">No products yet</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SellerLayout>
    );
}