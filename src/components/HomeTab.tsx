import { Listing, Category, CATEGORY_LABELS } from '@/lib/types';
import ProductCard, { ProductCardSkeleton } from './ProductCard';
import { Megaphone, Clock, ArrowRight, Plus, ShieldCheck, MessageCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HomeTabProps {
  listings: Listing[];
  loading?: boolean;
  onSelectListing: (listing: Listing) => void;
  onBrowseMarketplace: (category?: Category | 'all') => void;
  onCreateListing: () => void;
}

const HOME_CATEGORIES: Category[] = ['books', 'stationery', 'kit', 'uniform', 'electronics', 'notes'];

export default function HomeTab({
  listings,
  loading,
  onSelectListing,
  onBrowseMarketplace,
  onCreateListing,
}: HomeTabProps) {
  const recent = listings.slice(0, 8);
  const advertised = listings.filter((l) => l.advertised);
  const itemCount = listings.length;

  return (
    <div className="space-y-5 animate-fade-up">
      <section className="relative overflow-hidden rounded-2xl bg-[#e7f4fc] px-4 py-3.5 sm:px-5 sm:py-4 text-foreground shadow-card ring-1 ring-border">
        <div className="relative max-w-xl">
          <h1 className="text-lg sm:text-xl font-extrabold leading-snug tracking-tight text-navy">
            Buy and sell school essentials, together.
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-snug">
            Textbooks, kit, uniform, stationery, and more from students you already know.
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => onBrowseMarketplace('all')}
              className="rounded-full bg-navy text-white font-bold px-3.5 h-8 text-xs hover:bg-navy/90 border-0 shadow-sm"
            >
              Browse marketplace
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onCreateListing}
              className="rounded-full text-navy hover:bg-white/70 hover:text-navy h-8 px-3 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Sell an item
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} listed
          </p>
        </div>

        <div className="relative mt-2.5 -mx-1 flex gap-1.5 overflow-x-auto scrollbar-hide px-1 py-1">
          {HOME_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onBrowseMarketplace(cat)}
              className="shrink-0 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-navy ring-1 ring-navy/10 hover:bg-white transition-colors"
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-secondary" />
            <h3 className="font-body text-base font-bold text-foreground">Advertised</h3>
          </div>
          <button
            type="button"
            onClick={() => onBrowseMarketplace('all')}
            className="text-xs font-semibold text-secondary hover:text-primary transition-colors"
          >
            See all
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : advertised.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {advertised.map((listing) => (
              <ProductCard key={listing.id} listing={listing} onClick={() => onSelectListing(listing)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 rounded-2xl border border-dashed border-border bg-card/60">
            <p className="text-foreground font-semibold text-sm">No advertised products yet</p>
            <p className="text-muted-foreground text-xs mt-1">Promoted listings will show up here.</p>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: ShoppingBag, title: 'List in minutes', body: 'Snap a photo and set your price.' },
          { icon: MessageCircle, title: 'Chat on campus', body: 'Message sellers in seconds.' },
          { icon: ShieldCheck, title: 'Verified students', body: 'Only school emails can join.' },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-border bg-card/80 px-4 py-4 shadow-card">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-primary">
              <Icon className="w-4 h-4" />
            </div>
            <p className="mt-3 font-semibold text-sm text-foreground">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-body text-lg font-bold text-foreground">Recently listed</h3>
          </div>
          <button
            type="button"
            onClick={() => onBrowseMarketplace('all')}
            className="text-sm font-semibold text-secondary hover:text-primary transition-colors"
          >
            See all
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : recent.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recent.map((listing) => (
              <ProductCard key={listing.id} listing={listing} onClick={() => onSelectListing(listing)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-14 rounded-2xl border border-dashed border-border bg-card/60">
            <p className="text-foreground font-semibold">No listings yet</p>
            <p className="text-muted-foreground text-sm mt-1">Be the first to sell something on Edumart.</p>
            <Button type="button" onClick={onCreateListing} className="mt-4">
              <Plus className="w-4 h-4" />
              Sell an item
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
