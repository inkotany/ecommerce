import { usePage, useForm, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { ProductCard } from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X } from 'lucide-react';
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
    const hasActiveFilters = hasSearch || !!filters.category;

    // Build pagination links that work with current filters
    const paginate = (url: string | null) => {
        if (!url) return;
        router.get(url);
    };

    return (
        <PublicLayout>
            {/* Search & Filters */}
            <section className="bg-muted/30">
                <div className="mx-auto max-w-7xl px-6 py-8 sm:py-10">
                    <div className="max-w-lg mx-auto space-y-4">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                className="h-12 pl-11 pr-12 text-base rounded-xl border-muted bg-background"
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                            />
                            {hasSearch && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </form>

                        {/* Category Pills */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            <button
                                onClick={() => router.get('/')}
                                className={cn(
                                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                                    !filters.category
                                        ? 'bg-foreground text-background shadow-sm'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                )}
                            >
                                All
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => router.get(`/category/${category.slug}`)}
                                    className={cn(
                                        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                                        filters.category === category.slug
                                            ? 'bg-foreground text-background shadow-sm'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                    )}
                                >
                                    {category.icon && <span className="mr-1.5">{category.icon}</span>}
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
                {products.data.length > 0 ? (
                    <>
                        {/* Results bar */}
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">{products.total || products.data.length}</span>{' '}
                                {products.total === 1 ? 'product' : 'products'} found
                            </p>
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.get('/')}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
                                    Clear all filters
                                </Button>
                            )}
                        </div>

                        {/* Product Grid - from block component's grid pattern */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {products.links && products.links.length > 3 && (
                            <nav className="flex justify-center mt-12" aria-label="Pagination">
                                <div className="flex items-center gap-1.5">
                                    {products.links.map((link, index) => {
                                        if (link.label.includes('Previous') || link.label.includes('Next')) {
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => paginate(link.url)}
                                                    disabled={!link.url}
                                                    className={cn(
                                                        'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                                        !link.url
                                                            ? 'text-muted-foreground/40 cursor-not-allowed'
                                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                                    )}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        }
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => paginate(link.url)}
                                                disabled={!link.url}
                                                className={cn(
                                                    'min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all duration-200',
                                                    link.active
                                                        ? 'bg-foreground text-background shadow-sm'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                                                    !link.url && 'opacity-50 cursor-not-allowed'
                                                )}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </nav>
                        )}
                    </>
                ) : (
                    /* Empty State */
                    <div className="text-center py-20 sm:py-28">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-foreground">
                            {hasSearch ? 'No results found' : 'No products available'}
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                            {hasSearch
                                ? 'We couldn\'t find anything matching your search. Try adjusting your keywords or browse all products.'
                                : 'We\'re adding new products daily. Check back soon or explore our categories.'}
                        </p>
                        {hasSearch && (
                            <Button onClick={clearSearch} size="lg" className="rounded-xl">
                                Browse All Products
                            </Button>
                        )}
                        {!hasSearch && (
                            <Button onClick={() => router.get('/')} size="lg" variant="outline" className="rounded-xl">
                                Refresh Products
                            </Button>
                        )}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
