import { usePage, router, Link } from '@inertiajs/react';
import SellerLayout from '@/layouts/seller/seller-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import { router as inertiaRouter } from '@inertiajs/react';

export default function SellerProductsIndex() {
    const { products, filters } = usePage<{ products: { data: any[] }; filters: any }>().props;
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/seller/products', { search });
    };

    const deleteProduct = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            inertiaRouter.delete(`/seller/products/${id}`);
        }
    };

    return (
        <SellerLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Products</h2>
                    <Link href="/seller/products/create">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Product
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardContent className="p-4">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <Input
                                type="search"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="max-w-sm"
                            />
                            <Button type="submit" variant="secondary">
                                <Search className="w-4 h-4 mr-2" />
                                Search
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.data.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                                            {product.image ? (
                                                <img
                                                    src={`/storage/products/${product.image}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                                    📦
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.category?.name}</TableCell>
                                    <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                                    <TableCell>
                                        {product.quantity > 0 ? (
                                            <span className="text-green-600">{product.quantity}</span>
                                        ) : (
                                            <span className="text-red-600">Out of stock</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link href={`/seller/products/${product.id}/edit`}>
                                                <Button variant="ghost" size="sm">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteProduct(product.id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {products.data.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No products found</p>
                            <Link href="/seller/products/create" className="mt-4 inline-block">
                                <Button>Add your first product</Button>
                            </Link>
                        </div>
                    )}
                </Card>
            </div>
        </SellerLayout>
    );
}