import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12">
            <div className="max-w-5xl mx-auto">
                <Heading
                    title="Settings"
                    description="Manage your profile and account settings"
                    className="mb-8"
                />

                <div className="flex flex-col lg:flex-row lg:gap-12">
                    {/* Sidebar Navigation */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <nav
                            className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0"
                            aria-label="Settings"
                        >
                            {sidebarNavItems.map((item, index) => (
                                <Button
                                    key={`${toUrl(item.href)}-${index}`}
                                    size="default"
                                    variant="ghost"
                                    asChild
                                    className={cn(
                                        'w-auto lg:w-full justify-start whitespace-nowrap',
                                        isCurrentOrParentUrl(item.href) && 'bg-muted font-medium'
                                    )}
                                >
                                    <Link href={item.href}>
                                        {item.icon && (
                                            <item.icon className="h-4 w-4 mr-2" />
                                        )}
                                        {item.title}
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                    </aside>

                    <Separator className="my-6 lg:hidden" />

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-card rounded-xl border shadow-sm p-6 lg:p-8">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
