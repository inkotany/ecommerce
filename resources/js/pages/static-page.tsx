import { usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';

export default function Page() {
    const { page } = usePage<{ page: any }>().props;

    if (!page) {
        return (
            <PublicLayout>
                <div className="container py-16 text-center">
                    <h1 className="text-2xl font-bold">Page not found</h1>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <div className="container py-16 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">{page.title}</h1>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    {page.content}
                </div>
            </div>
        </PublicLayout>
    );
}