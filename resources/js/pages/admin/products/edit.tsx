import { usePage, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function AdminProductsEdit() {
    const { product, categories, conditions } = usePage<{
        product: any;
        categories: { id: number; name: string }[];
        conditions: Record<string, string>;
    }>().props;

    const { data, setData, put, processing } = useForm({
        name: product.name || '',
        category_id: String(product.category_id ?? ''),
        price: product.price || '',
        compare_price: product.compare_price || '',
        quantity: String(product.quantity ?? '0'),
        description: product.description || '',
        short_description: product.short_description || '',
        condition: product.condition || 'new',
        location: product.location || '',
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/products/${product.id}`);
    };

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-3xl">
                <Link href="/admin/products" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Products
                </Link>

                <h2 className="text-2xl font-bold">Edit Product</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Label>Active</Label>
                                    <Switch
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label>Featured</Label>
                                    <Switch
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) => setData('is_featured', checked)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Product Name *</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Category *</Label>
                                <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Price *</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Compare Price</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.compare_price}
                                        onChange={(e) => setData('compare_price', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Stock Quantity *</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={data.quantity}
                                        onChange={(e) => setData('quantity', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Condition</Label>
                                    <Select value={data.condition} onValueChange={(value) => setData('condition', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(conditions).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label>Location</Label>
                                <Input
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="City, State"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Short Description</Label>
                                <Textarea
                                    value={data.short_description}
                                    onChange={(e) => setData('short_description', e.target.value)}
                                    rows={2}
                                />
                            </div>
                            <div>
                                <Label>Full Description</Label>
                                <Textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={5}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Product Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {product.image && (
                                <img
                                    src={`/storage/products/${product.image}`}
                                    alt={product.name}
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Link href="/admin/products">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}