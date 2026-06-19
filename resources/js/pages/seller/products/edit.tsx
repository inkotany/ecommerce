import { usePage, router, useForm } from '@inertiajs/react';
import SellerLayout from '@/layouts/seller/seller-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Upload } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function SellerProductsEdit() {
    const { product, categories, conditions } = usePage<{
        product: any;
        categories: any[];
        conditions: Record<string, string>;
    }>().props;

    const { data, setData, put, processing } = useForm({
        name: product.name || '',
        category_id: String(product.category_id) || '',
        price: product.price || '',
        compare_price: product.compare_price || '',
        quantity: product.quantity || '0',
        description: product.description || '',
        short_description: product.short_description || '',
        condition: product.condition || 'new',
        location: product.location || '',
        is_active: product.is_active ?? true,
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/seller/products/${product.id}`, {
            forceFormData: true,
        });
    };

    return (
        <SellerLayout>
            <div className="space-y-6 max-w-3xl">
                <Link href="/seller/products" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
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
                            <div className="flex items-center gap-2">
                                <Label>Active</Label>
                                <Switch
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
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
                                        <SelectValue />
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
                                <div className="mb-4">
                                    <img
                                        src={`/storage/products/${product.image}`}
                                        alt={product.name}
                                        className="w-32 h-32 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                                <label htmlFor="image" className="cursor-pointer">
                                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">
                                        {data.image ? data.image.name : 'Click to upload new image'}
                                    </p>
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Link href="/seller/products">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </SellerLayout>
    );
}