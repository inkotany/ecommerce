import { Button } from '@/components/ui/button';
import { Heart, Star } from 'lucide-react';

export default function GridList() {
  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Product Card */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="group bg-card overflow-hidden rounded-xl border"
          >
            <div className="bg-muted relative aspect-square">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                alt="Product image"
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <Button
                size="icon"
                variant="ghost"
                className="bg-background/80 absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate font-medium">
                    Classic Leather Watch
                  </h3>
                  <div className="mt-1 flex items-center gap-1">
                    <Star className="fill-primary text-primary h-3.5 w-3.5" />
                    <span className="text-sm">4.9</span>
                    <span className="text-muted-foreground text-sm">(128)</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">$299</div>
                  <div className="text-muted-foreground text-sm line-through">
                    $399
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button size="sm" className="w-full">
                  Buy Now
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
