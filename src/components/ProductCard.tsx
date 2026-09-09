import { Listing, CATEGORY_LABELS, CATEGORY_TAG_CLASSNAMES, CONDITION_LABELS } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock, ImageOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProductCardProps {
  listing: Listing;
  onClick: () => void;
}

function formatPrice(price: number) {
  return `R${price.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card border border-border/80 overflow-hidden shadow-card">
      <div className="aspect-[4/3] bg-muted animate-pulse" />
      <div className="p-3.5 space-y-2.5">
        <div className="h-4 bg-muted rounded-md animate-pulse w-4/5" />
        <div className="h-5 bg-muted rounded-md animate-pulse w-1/3" />
        <div className="h-3 bg-muted rounded-md animate-pulse w-1/2" />
      </div>
    </div>
  );
}

export default function ProductCard({ listing, onClick }: ProductCardProps) {
  const hasPhoto = listing.imageUrls && listing.imageUrls.length > 0;

  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl bg-card border border-border/80 overflow-hidden shadow-card transition-all duration-300 ease-out hover:shadow-card-hover hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="aspect-[4/3] overflow-hidden relative bg-muted">
        {hasPhoto ? (
          <>
            <img
              src={listing.imageUrls[0]}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
              loading="lazy"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
              aria-hidden
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground" aria-hidden>
            <ImageOff className="w-8 h-8 opacity-40" />
            <span className="text-xs px-2 text-center">No photo</span>
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex flex-wrap items-start justify-between gap-1.5 z-[1]">
          <Badge
            className={cn(
              'font-medium text-[11px] backdrop-blur-sm',
              CATEGORY_TAG_CLASSNAMES[listing.category]
            )}
          >
            {CATEGORY_LABELS[listing.category]}
          </Badge>
          {listing.advertised && (
            <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary font-semibold text-[10px] px-1.5 py-0 h-5 border-0 shadow-sm">
              Featured
            </Badge>
          )}
        </div>
        <p className="absolute bottom-2.5 left-2.5 z-[1] rounded-full bg-white/95 px-2.5 py-0.5 text-sm font-extrabold text-navy shadow-sm tracking-tight">
          {formatPrice(listing.price)}
        </p>
      </div>
      <div className="p-3.5 space-y-2">
        <h3 className="font-semibold text-card-foreground line-clamp-2 font-body text-[14px] leading-snug">
          {listing.title}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="text-[11px] font-medium text-muted-foreground border-border bg-muted/40">
            {CONDITION_LABELS[listing.condition]}
          </Badge>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3 opacity-80" />
            {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </button>
  );
}
