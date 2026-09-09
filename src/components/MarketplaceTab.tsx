import { Listing, Category } from '@/lib/types';
import ProductCard, { ProductCardSkeleton } from './ProductCard';
import CategoryFilter from './CategoryFilter';
import { PackageSearch } from 'lucide-react';

interface MarketplaceTabProps {
  listings: Listing[];
  searchQuery: string;
  onSelectListing: (listing: Listing) => void;
  category: Category | 'all';
  onCategoryChange: (cat: Category | 'all') => void;
  loading?: boolean;
}

export default function MarketplaceTab({
  listings,
  searchQuery,
  onSelectListing,
  category,
  onCategoryChange,
  loading,
}: MarketplaceTabProps) {
  const filtered = listings
    .filter((l) => {
      const matchesCategory = category === 'all' || l.category === category;
      const matchesSearch = !searchQuery ||
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (category !== 'all') return 0;
      const adDiff = Number(b.advertised) - Number(a.advertised);
      return adDiff !== 0 ? adDiff : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="font-body text-xl font-extrabold text-foreground tracking-tight">Marketplace</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {loading ? 'Loading listings…' : `${filtered.length} ${filtered.length === 1 ? 'item' : 'items'}`}
          {searchQuery ? ` matching “${searchQuery}”` : ''}
        </p>
      </div>

      <CategoryFilter selected={category} onChange={onCategoryChange} />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((listing) => (
            <ProductCard key={listing.id} listing={listing} onClick={() => onSelectListing(listing)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card/70">
          <PackageSearch className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold text-foreground">No items found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery ? `No results for “${searchQuery}”` : 'No listings in this category yet.'}
          </p>
        </div>
      )}
    </div>
  );
}
