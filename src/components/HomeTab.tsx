import { useRef, type PointerEvent } from 'react';
import { Listing, Category, CATEGORY_LABELS } from '@/lib/types';
import ProductCard, { ProductCardSkeleton } from './ProductCard';
import { Megaphone, Clock, ArrowRight, Plus, ShieldCheck, MessageCircle, ShoppingBag, HeartHandshake, Heart, Server } from 'lucide-react';
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

      <div className="space-y-4">
        <section className="group relative overflow-hidden rounded-[1.75rem] bg-[#d6eef9] px-5 py-5 sm:px-6 sm:py-6 ring-1 ring-navy/10 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover hover:ring-navy/20 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
          <div className="money-card-shine" aria-hidden />
          <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-navy/10 blur-2xl transition-transform duration-500 group-hover:scale-150" aria-hidden />

          <div className="relative flex flex-wrap items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white shadow-md transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6">
              <span className="absolute inset-0 rounded-2xl bg-secondary/40 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
              <HeartHandshake className="relative h-6 w-6 money-heart" />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm transition-transform duration-300 group-hover:scale-[1.03]">
              <Heart className="h-3 w-3 fill-white/90" />
              What causes you help?
            </span>
          </div>

          <p className="relative mt-3.5 text-sm text-navy/85 leading-relaxed">
            Listing and advertising fees keep Edumarts running. The remaining money goes to Edenvale Hospice, a local charity that cares for people with life-limiting illness and supports their families through some of the hardest days.
          </p>

          <div className="relative mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="group/keep flex items-center gap-3 rounded-2xl bg-white/75 px-3.5 py-3 ring-1 ring-navy/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md hover:ring-navy/20">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7f4fc] text-navy transition-transform duration-300 ease-out group-hover/keep:scale-110 group-hover/keep:rotate-6">
                <Server className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-navy">Keeps Edumarts running</p>
                <p className="text-[11px] text-muted-foreground">Hosting, photos, and chat</p>
              </div>
            </div>
            <div className="group/hospice flex items-center gap-3 rounded-2xl bg-white/75 px-3.5 py-3 ring-1 ring-navy/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md hover:ring-navy/20">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7f4fc] text-navy transition-transform duration-300 ease-out group-hover/hospice:scale-110 group-hover/hospice:-rotate-6">
                <Heart className="h-4 w-4 fill-navy/15 money-heart" />
              </span>
              <div>
                <p className="text-xs font-bold text-navy">Helps Edenvale Hospice</p>
                <p className="text-[11px] text-muted-foreground">Care for patients and families</p>
              </div>
            </div>
          </div>
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
      </div>

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
            <p className="text-muted-foreground text-sm mt-1">Be the first to sell something on Edumarts.</p>
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
