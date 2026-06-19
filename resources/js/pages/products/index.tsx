import { usePage, useForm, router, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { ProductCard } from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductsIndex() {
    const { products, categories, filters } = usePage<{
        products: { data: any[]; links: any[] };
        categories: any[];
        filters: { category?: string; search?: string };
    }>().props;

    const { data, setData } = useForm({
        search: filters.search || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', { search: data.search });
    };

    const clearSearch = () => {
        setData('search', '');
        router.get('/');
    };

    const hasSearch = !!filters.search;

    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-8">
                {/* Category Pills */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button
                            onClick={() => router.get('/')}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                                !filters.category
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted hover:bg-muted/80"
                            )}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => router.get(`/category/${category.slug}`)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2",
                                    filters.category === category.slug
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted hover:bg-muted/80"
                                )}
                            >
                                <span>{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md mx-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search fashion..."
                            className="pl-10"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                        />
                    </div>
                    <Button type="submit">Search</Button>
                    {hasSearch && (
                        <Button type="button" variant="ghost" onClick={clearSearch}>
                            Clear
                        </Button>
                    )}
                </form>

                {/* Results */}
                {products.data.length > 0 ? (
                    <>
                        <p className="text-sm text-muted-foreground mb-4">
                            {products.data.length} products found
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {products.links.length > 3 && (
                            <div className="flex justify-center mt-8">
                                <div className="flex gap-2">
                                    {products.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={cn(
                                                "px-4 py-2 rounded-md text-sm",
                                                link.active ? "bg-primary text-primary-foreground" : "bg-background border hover:bg-accent",
                                                !link.url && "opacity-50 cursor-not-allowed"
                                            )}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                            {hasSearch ? 'No products match your search' : 'No products available yet'}
                        </h3>
                        <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                            {hasSearch
                                ? 'Try adjusting your search terms to find what you\'re looking for.'
                                : 'Check back soon for new arrivals, or browse our categories to get started.'}
                        </p>
                        {hasSearch && (
                            <Button variant="outline" onClick={clearSearch}>
                                Clear search
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
