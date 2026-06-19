import { usePage, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PublicLayout from '@/layouts/public/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface CartItem {
    product_id: number;
    name: string;
    price: number;
    image: string | null;
    quantity: number;
}

export default function Cart() {
    const { website, auth } = usePage<{
        website: { name: string; tagline: string };
        auth: { user: any };
    }>().props;

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const { data, setData, post, processing } = useForm({
        items: '',
        shipping_name: '',
        shipping_email: '',
        shipping_phone: '',
        shipping_address: '',
        shipping_city: '',
        shipping_zip: '',
        shipping_country: 'US',
        notes: '',
    });

    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) {
            setCartItems(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (auth.user) {
            setData({
                shipping_name: auth.user.name || '',
                shipping_email: auth.user.email || '',
                shipping_phone: auth.user.phone || '',
                shipping_address: auth.user.address || '',
                shipping_city: auth.user.city || '',
                shipping_zip: auth.user.zip || '',
                shipping_country: auth.user.country || 'US',
            });
        }
    }, [auth.user]);

    const updateQuantity = (productId: number, delta: number) => {
        const updated = cartItems.map((item) =>
            item.product_id === productId
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
        );
        setCartItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const removeItem = (productId: number) => {
        const updated = cartItems.filter((item) => item.product_id !== productId);
        setCartItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const handleQuantityChange = (productId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        const updated = cartItems.map((item) =>
            item.product_id === productId
                ? { ...item, quantity: newQuantity }
                : item
        );
        setCartItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0;
    const total = subtotal + shipping + tax;

    const handleCheckout = () => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }
        setShowCheckout(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setData('items', JSON.stringify(cartItems));
        post('/checkout', {
            onSuccess: () => {
                localStorage.removeItem('cart');
                setCartItems([]);
            },
        });
    };

    if (cartItems.length === 0) {
        return (
            <PublicLayout>
                <div className="container mx-auto px-4 py-16 text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
                    <p className="text-muted-foreground mb-8">Start shopping to add items to your cart.</p>
                    <Link href="/products">
                        <Button>Browse Products</Button>
                    </Link>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <Card key={item.product_id}>
                                <CardContent className="p-4 flex gap-4">
                                    <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                        {item.image ? (
                                            <img
                                                src={`/storage/products/${item.image}`}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                                <ShoppingBag className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-lg font-bold text-primary mt-1">
                                            ${Number(item.price).toFixed(2)}
                                        </p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="flex items-center border rounded-md">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => updateQuantity(item.product_id, -1)}
                                                    aria-label="Decrease quantity"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.product_id, parseInt(e.target.value) || 1)}
                                                    className="w-12 text-center border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-primary rounded"
                                                    min="1"
                                                    aria-label="Quantity"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => updateQuantity(item.product_id, 1)}
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeItem(item.product_id)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div>
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                {subtotal < 100 && (
                                    <p className="text-xs text-muted-foreground">
                                        Add ${(100 - subtotal).toFixed(2)} more for free shipping
                                    </p>
                                )}
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                {showCheckout ? (
                                    <Button className="w-full" onClick={handleCheckout} disabled>
                                        Proceed to Checkout
                                    </Button>
                                ) : (
                                    <Button className="w-full" onClick={handleCheckout}>
                                        Proceed to Checkout
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                {/* Checkout Form */}
                {showCheckout && (
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Checkout</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Full Name *</Label>
                                        <Input
                                            value={data.shipping_name}
                                            onChange={(e) => setData('shipping_name', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Email *</Label>
                                        <Input
                                            type="email"
                                            value={data.shipping_email}
                                            onChange={(e) => setData('shipping_email', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Phone</Label>
                                        <Input
                                            value={data.shipping_phone}
                                            onChange={(e) => setData('shipping_phone', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>City *</Label>
                                        <Input
                                            value={data.shipping_city}
                                            onChange={(e) => setData('shipping_city', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Address *</Label>
                                    <Input
                                        value={data.shipping_address}
                                        onChange={(e) => setData('shipping_address', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div>
                                        <Label>ZIP Code *</Label>
                                        <Input
                                            value={data.shipping_zip}
                                            onChange={(e) => setData('shipping_zip', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Country *</Label>
                                        <Input
                                            value={data.shipping_country}
                                            onChange={(e) => setData('shipping_country', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Order Notes</Label>
                                    <Input
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Any special instructions..."
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <Button type="submit" size="lg" disabled={processing}>
                                        {processing ? 'Processing...' : 'Place Order'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setShowCheckout(false)}>
                                        Back to Cart
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </PublicLayout>
    );
}