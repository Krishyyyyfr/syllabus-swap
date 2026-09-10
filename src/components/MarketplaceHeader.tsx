import { Search, Plus, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BrandLogo from '@/components/BrandLogo';

interface MarketplaceHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateListing: () => void;
  showAdminLink?: boolean;
}

export default function MarketplaceHeader({ searchQuery, onSearchChange, onCreateListing, showAdminLink }: MarketplaceHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/75 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/" className="shrink-0" aria-label="Edumarts home">
            <BrandLogo size="lg" />
          </Link>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search books, kit, uniform…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 sm:h-11 pl-10 rounded-full border border-border bg-white/90 text-foreground placeholder:text-muted-foreground focus-visible:border-secondary/60 focus-visible:ring-2 focus-visible:ring-secondary/45 focus-visible:shadow-search-focus transition-shadow duration-200"
              maxLength={100}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={onCreateListing}
              className="bg-gradient-sell-cta text-white font-semibold rounded-full px-3 sm:px-5 shadow-md transition-transform duration-200 hover:scale-[1.03] hover:shadow-[0_8px_28px_-4px_rgba(30,74,122,0.35)] active:scale-[0.98] border-0"
            >
              <Plus className="w-4 h-4 sm:mr-0" />
              <span className="hidden sm:inline">Sell item</span>
            </Button>
            {showAdminLink && (
              <Link to="/admin">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-border text-foreground bg-white hover:bg-muted"
                >
                  <Shield className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
