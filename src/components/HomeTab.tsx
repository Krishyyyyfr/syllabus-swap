import { useRef, type PointerEvent } from 'react';
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
  const advertised = listings.filter((l) => l.advertised).slice(0, 4);
  const itemCount = listings.length;
  const glowRef = useRef<HTMLDivElement>(null);

  const moveGlow = (event: PointerEvent<HTMLElement>) => {
    const glow = glowRef.current;
    if (!glow) return;
    const rect = event.currentTarget.getBoundingClientRect();
    glow.style.transform = `translate(${event.clientX - rect.left}px, ${event.clientY - rect.top}px) translate(-50%, -50%)`;
  };

  return (
    <div className="space-y-10 animate-fade-up">
      <section
        className="relative overflow-hidden rounded-3xl bg-[#e7f4fc] px-6 py-10 sm:px-10 sm:py-12 text-foreground shadow-card ring-1 ring-border"
        onPointerMove={moveGlow}
      >
        <div
          ref={glowRef}
          className="hero-cursor-glow"
          aria-hidden
        />

        <div className="relative z-[1] max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-navy">
            Buy and sell school essentials, together.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Textbooks, kit, uniform, stationery, and more from students you already know.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={() => onBrowseMarketplace('all')}
              className="rounded-full bg-navy text-white font-bold px-5 h-11 hover:bg-navy/90 border-0 shadow-md"
            >
              Browse marketplace
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onCreateListing}
              className="rounded-full text-navy hover:bg-white/70 hover:text-navy h-11 px-4"
            >
              <Plus className="w-4 h-4" />
              Sell an item
            </Button>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} listed
          </p>
        </div>

        <div className="relative z-[1] mt-8 -mx-1 flex gap-2 overflow-x-auto scrollbar-hide px-1 py-2">
          {HOME_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onBrowseMarketplace(cat)}
              className="shrink-0 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-medium text-navy ring-1 ring-navy/10 hover:bg-white transition-colors"
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: ShoppingBag, title: 'List in minutes', body: 'Snap a photo and set your price.' },
          { icon: MessageCircle, title: 'Chat on campus', body: 'Message sellers with your school account.' },
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

      {(loading || advertised.length > 0) && (
        <section>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-secondary" />
              <h3 className="font-body text-lg font-bold text-foreground">Featured</h3>
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
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {advertised.map((listing) => (
                <ProductCard key={listing.id} listing={listing} onClick={() => onSelectListing(listing)} />
              ))}
            </div>
          )}
        </section>
      )}

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
