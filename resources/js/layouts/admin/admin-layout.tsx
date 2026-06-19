import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Users, Package, ShoppingCart, FolderTree, FileText, LogOut, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Logo from '@/components/logo';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Pages', href: '/admin/pages', icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 bg-background border rounded-lg shadow-sm"
                >
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r transform transition-transform duration-200 lg:translate-x-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo />
                    </Link>
                    <span className="ml-2 text-xs font-medium text-muted-foreground">Admin</span>
                </div>
                <nav className="flex flex-col gap-1 p-4">
                    {navigation.map((item) => {
                        const isActive = url === item.href || url.startsWith(item.href + '/') || url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                    <hr className="my-2" />
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <Settings className="w-5 h-5" />
                        Back to Store
                    </Link>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </Link>
                </nav>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="lg:pl-64">
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}