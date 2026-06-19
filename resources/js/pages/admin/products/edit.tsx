import { usePage, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function AdminProductsEdit() {
    const { product } = usePage<{ product: any }>().props;

    const { data, setData, put, processing } = useForm({
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/products/${product.id}`);
    };

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-2xl">
                <Link href="/admin/products" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Products
                </Link>

                <h2 className="text-2xl font-bold">Edit Product</h2>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{product.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">by {product.seller?.name}</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {product.image && (
                                <div>
                                    <img
                                        src={`/storage/products/${product.image}`}
                                        alt={product.name}
                                        className="w-32 h-32 object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <Label>Active</Label>
                                <Switch
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label>Featured</Label>
                                <Switch
                                    checked={data.is_featured}
                                    onCheckedChange={(checked) => setData('is_featured', checked)}
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}