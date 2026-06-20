import { usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';

function formatContent(text: string): string {
    // Split into sections by numbered items
    const sections = text.split(/(?=\d+\.\s)/).filter(Boolean);

    if (sections.length <= 1) {
        // No numbered list — just split by double newlines
        return text
            .split(/\n\n+/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p) => `<p class="mb-4 leading-relaxed">${inlineFormat(p)}</p>`)
            .join('\n');
    }

    return sections
        .map((section) => {
            const trimmed = section.trim();
            if (!trimmed) return '';
            // Check if this is a numbered item
            const match = trimmed.match(/^(\d+\.\s)(.*)/s);
            if (match) {
                const [, num, body] = match;
                return `<p class="mb-3 leading-relaxed"><span class="font-semibold text-foreground">${num}</span>${inlineFormat(body)}</p>`;
            }
            return `<p class="mb-4 leading-relaxed">${inlineFormat(trimmed)}</p>`;
        })
        .join('\n');
}

function inlineFormat(text: string): string {
    return text
        // **bold**
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
        // Handle em dashes
        .replace(/ — /g, ' — ');
}

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
            <div className="mx-auto max-w-3xl px-6 py-14 lg:py-20">
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-10">
                    {page.title}
                </h1>
                <div
                    className="text-muted-foreground text-sm leading-relaxed space-y-1"
                    dangerouslySetInnerHTML={{ __html: formatContent(page.content) }}
                />
            </div>
        </PublicLayout>
    );
}