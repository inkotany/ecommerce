import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-10 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                {children}
            </div>
        </div>
    );
}