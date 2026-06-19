import { usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Page() {
    const { page, website } = usePage<{
        page: { title: string; slug: string; content: string; meta_title?: string; meta_description?: string };
        website: { name: string; tagline: string };
    }>().props;

    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">{page.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none">
                        {page.content ? (
                            <div dangerouslySetInnerHTML={{ __html: page.content.replace(/\n/g, '<br>') }} />
                        ) : (
                            <p className="text-muted-foreground">This page is under construction.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}