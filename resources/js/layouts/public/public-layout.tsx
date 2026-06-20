import { Link, usePage, router } from '@inertiajs/react';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { cn } from '@/lib/utils';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const { website, auth } = usePage<{ website: { name: string; tagline: string }; auth: { user: any } }>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Shop', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const userNavigation = auth.user
        ? [
            { name: 'Dashboard', href: '/dashboard' },
            ...(auth.user.role === 'seller' || auth.user.role === 'admin'
                ? [{ name: 'Seller Dashboard', href: '/seller/dashboard' }]
                : []),
            ...(auth.user.role === 'admin'
                ? [{ name: 'Admin Dashboard', href: '/admin/dashboard' }]
                : []),
            { name: 'My Orders', href: '/orders' },
            { name: 'Profile', href: '/settings/profile' },
        ]
        : [
            { name: 'Login', href: '/login' },
            { name: 'Register', href: '/register' },
        ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <nav className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                {website.name}
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm px-1 py-0.5 -mx-1 -my-0.5"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                            {/* Theme Switcher */}
                            <div className="hidden md:block">
                                <ThemeSwitcher />
                            </div>

                            {/* Cart */}
                            <Link href="/cart">
                                <Button variant="ghost" size="icon" className="relative">
                                    <ShoppingCart className="h-5 w-5" />
                                </Button>
                            </Link>

                            {/* User Menu */}
                            <div className="hidden md:flex items-center gap-2">
                                {auth.user ? (
                                    <>
                                        {(() => {
                                            const isSellerOrAdmin = auth.user.role === 'seller' || auth.user.role === 'admin';
                                            const dashboardUrl = auth.user.role === 'admin'
                                                ? '/admin/dashboard'
                                                : auth.user.role === 'seller'
                                                    ? '/seller/dashboard'
                                                    : '/dashboard';
                                            return isSellerOrAdmin ? (
                                                <Link href={dashboardUrl}>
                                                    <Button variant="outline" size="sm">
                                                        Dashboard
                                                    </Button>
                                                </Link>
                                            ) : null;
                                        })()}
                                        <Link href="/settings/profile">
                                            <Button variant="ghost" size="sm">
                                                <User className="mr-2 h-4 w-4" />
                                                {auth.user.name}
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm" onClick={() => router.post('/logout')}>
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <Link href="/login">
                                        <Button variant="default" size="sm">
                                            Sign In
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            {/* Mobile Menu */}
                            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-72">
                                    <div className="flex flex-col gap-4 mt-8">
                                        {/* Mobile Theme Switcher */}
                                        <div className="flex items-center justify-between px-2">
                                            <span className="text-sm font-medium">Theme</span>
                                            <ThemeSwitcher />
                                        </div>
                                        <div className="pt-2 border-t border-border/50" />
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="text-lg font-medium hover:text-primary"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                        <div className="border-t pt-4 mt-4">
                                            {userNavigation.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="block py-2 text-muted-foreground hover:text-primary"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                            {auth.user && (
                                                <button
                                                    onClick={() => { setMobileMenuOpen(false); router.post('/logout'); }}
                                                    className="block w-full text-left py-2 text-muted-foreground hover:text-primary"
                                                >
                                                    Logout
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t bg-muted/40 mt-20 lg:mt-28">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
                        <div className="col-span-2 md:col-span-1">
                            <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
                                {website.name}
                            </Link>
                            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
                                {website.tagline}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">Shop</h3>
                            <div className="space-y-3 text-sm">
                                <Link href="/" className="block text-muted-foreground hover:text-foreground transition-colors">All Products</Link>
                                <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
                                <Link href="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">Legal</h3>
                            <div className="space-y-3 text-sm">
                                <Link href="/terms" className="block text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
                                <Link href="/privacy" className="block text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">Account</h3>
                            <div className="space-y-3 text-sm">
                                {auth.user ? (
                                    <>
                                        <Link href="/orders" className="block text-muted-foreground hover:text-foreground transition-colors">My Orders</Link>
                                        <Link href="/settings/profile" className="block text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="block text-muted-foreground hover:text-foreground transition-colors">Login</Link>
                                        <Link href="/register" className="block text-muted-foreground hover:text-foreground transition-colors">Register</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border/50">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} {website.name}. All rights reserved.
                        </p>
                        <ThemeSwitcher />
                    </div>
                </div>
            </footer>
        </div>
    );
}