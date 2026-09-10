import { User } from '@/lib/auth';
import { Listing } from '@/lib/types';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { LogOut, Package, Mail, MessageCircle } from 'lucide-react';

interface ProfileTabProps {
  user: User;
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
  onLogout: () => void;
  onOpenMessages: () => void;
  messageCount?: number;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ProfileTab({ user, listings, onSelectListing, onLogout, onOpenMessages, messageCount = 0 }: ProfileTabProps) {
  const myListings = listings.filter(
    (l) => l.sellerContact.toLowerCase() === user.email.toLowerCase()
  );
  const initials = initialsFromName(user.name);

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="relative overflow-hidden rounded-3xl bg-hero-edumarts p-6 sm:p-8 text-white shadow-card">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-secondary/30 blur-2xl" aria-hidden />
        <div className="relative z-[1] flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-extrabold tracking-tight shadow-sm text-navy"
              aria-hidden
            >
              {initials}
            </div>
            <div className="min-w-0 space-y-2">
              <h2 className="font-body text-xl font-extrabold tracking-tight">{user.name}</h2>
              <VerifiedBadge variant="onDark" />
              <p className="text-white/75 text-sm flex items-center gap-2 mt-1">
                <Mail className="w-3.5 h-3.5 shrink-0 opacity-80" /> {user.email}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenMessages}
              className="text-white hover:bg-white/15 hover:text-white rounded-full"
            >
              <MessageCircle className="w-4 h-4 mr-1" /> Messages
              {messageCount > 0 && (
                <span className="ml-1.5 bg-white text-navy text-[10px] rounded-full px-1.5 py-0.5 font-semibold">
                  {messageCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-white hover:bg-white/15 hover:text-white rounded-full"
            >
              <LogOut className="w-4 h-4 mr-1" /> Sign out
            </Button>
          </div>
        </div>

        <div className="relative z-[1] mt-8 grid grid-cols-2 gap-3 sm:max-w-md">
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">Active listings</p>
            <p className="mt-1 font-body text-2xl font-extrabold tabular-nums tracking-tight">{myListings.length}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">Listings sold</p>
            <p className="mt-1 font-body text-2xl font-extrabold tabular-nums tracking-tight">-</p>
            <p className="text-[10px] text-white/55 mt-1 leading-snug">Shown when you mark items sold in Messages</p>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-primary" />
          <h3 className="font-body text-lg font-bold text-foreground">My listings</h3>
          <span className="text-sm text-muted-foreground">({myListings.length})</span>
        </div>
        {myListings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {myListings.map((listing) => (
              <ProductCard key={listing.id} listing={listing} onClick={() => onSelectListing(listing)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card/70 rounded-2xl border border-dashed border-border">
            <Package className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-foreground text-sm font-semibold">You haven&apos;t listed any items yet.</p>
            <p className="text-muted-foreground text-xs mt-1">Tap &quot;Sell item&quot; to get started.</p>
          </div>
        )}
      </section>
    </div>
  );
}
