import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
        return pages[`./pages/${name}.tsx`];
    },
    layout: (page) => {
        const name = (page as any).type as string || '';
        
        switch (true) {
            case name === 'welcome' || name === '':
                return page;
            case name.startsWith('auth/'):
                return <AuthLayout>{page}</AuthLayout>;
            case name.startsWith('settings/'):
                if (name === 'settings/profile') {
                    return <AppLayout><div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10"><div className="w-full max-w-sm">{page}</div></div></AppLayout>;
                }
                return <AppLayout><SettingsLayout>{page}</SettingsLayout></AppLayout>;
            case name.startsWith('admin/') || name.startsWith('Admin/'):
                return <AppLayout>{page}</AppLayout>;
            case name.startsWith('seller/') || name.startsWith('Seller/'):
                return <AppLayout>{page}</AppLayout>;
            default:
                return page;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();