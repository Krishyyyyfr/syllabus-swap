import { useState, useCallback, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Home, ShoppingBag, User, MessageCircle, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchListings } from '@/lib/store';
import { Category, Listing } from '@/lib/types';
import { initAuth, logout as doLogout, User as UserType } from '@/lib/auth';
import { isAdminUser } from '@/lib/admin';
import { startConversation, getUnreadMessageCount } from '@/lib/messages';
import MarketplaceHeader from '@/components/MarketplaceHeader';
import HomeTab from '@/components/HomeTab';
import MarketplaceTab from '@/components/MarketplaceTab';
import ProfileTab from '@/components/ProfileTab';
import MessagesTab from '@/components/MessagesTab';
import ProductDetail from '@/components/ProductDetail';
import CreateListing from '@/components/CreateListing';
import AuthDialog from '@/components/AuthDialog';

type Tab = 'home' | 'marketplace' | 'messages' | 'profile';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchListings()
      .then((data) => {
        if (!cancelled) setListings(data);
      })
      .catch(() => { /* ignore */ })
      .finally(() => {
        if (!cancelled) setListingsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [initialConversationId, setInitialConversationId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const cleanup = initAuth((u, err) => {
      setUser(u);
      if (err) setShowAuth(true);
    });
    return cleanup;
  }, []);

  useEffect(() => {
    const err = searchParams.get('error');
    if (err === 'school_email_required' || err === 'auth_failed') {
      setShowAuth(true);
    }
  }, [searchParams]);

  const refreshMessageCount = useCallback(() => {
    if (!user) return;
    getUnreadMessageCount().then(setMessageCount);
  }, [user]);

  useEffect(() => {
    if (user) refreshMessageCount();
  }, [user, refreshMessageCount]);

  const refreshListings = useCallback(() => {
    fetchListings().then(setListings);
  }, []);

  const handleTabClick = (tab: Tab) => {
    if ((tab === 'profile' || tab === 'messages') && !user) {
      setShowAuth(true);
      return;
    }
    if (tab !== 'messages') setInitialConversationId(null);
    if (tab === 'marketplace') setCategory('all');
    setActiveTab(tab);
  };

  const goToMarketplace = (cat: Category | 'all' = 'all') => {
    setInitialConversationId(null);
    setCategory(cat);
    setActiveTab('marketplace');
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && activeTab === 'home') {
      setActiveTab('marketplace');
    }
  };

  const handleCreateListing = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setShowCreateListing(true);
  };

  const handleLogout = () => {
    doLogout();
    setUser(null);
    setActiveTab('home');
  };

  const handleMessageSeller = async (listing: Listing) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    if (user.email.toLowerCase() === listing.sellerContact.toLowerCase()) return;
    setSelectedListing(null);
    try {
      const convo = await startConversation(
        listing.id,
        listing.title,
        { id: user.id, name: user.name },
        { id: listing.sellerContact, name: listing.sellerName }
      );
      setInitialConversationId(convo.id);
      setActiveTab('messages');
      refreshMessageCount();
    } catch (e) {
      console.error('Failed to start conversation:', e);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <div className="relative z-10 flex flex-col flex-1 min-h-screen">
        <MarketplaceHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onCreateListing={handleCreateListing}
          showAdminLink={isAdminUser(user)}
        />

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 pb-8">
          {activeTab === 'home' && (
            <HomeTab
              listings={listings}
              loading={listingsLoading}
              onSelectListing={setSelectedListing}
              onBrowseMarketplace={goToMarketplace}
              onCreateListing={handleCreateListing}
            />
          )}
          {activeTab === 'marketplace' && (
            <MarketplaceTab
              listings={listings}
              searchQuery={searchQuery}
              onSelectListing={setSelectedListing}
              category={category}
              onCategoryChange={setCategory}
              loading={listingsLoading}
            />
          )}
          {activeTab === 'messages' && user && (
            <MessagesTab
              user={user}
              initialConversationId={initialConversationId}
              onConversationUpdate={refreshMessageCount}
              onListingRemoved={refreshListings}
            />
          )}
          {activeTab === 'profile' && user && (
            <ProfileTab
              user={user}
              listings={listings}
              onSelectListing={setSelectedListing}
              onLogout={handleLogout}
              onOpenMessages={() => { setInitialConversationId(null); setActiveTab('messages'); }}
              messageCount={messageCount}
            />
          )}
        </main>

        <nav className="sticky bottom-0 z-40 border-t border-border/80 bg-white/80 backdrop-blur-xl shadow-[0_-8px_30px_-12px_rgba(30,42,68,0.12)] pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-6xl mx-auto flex px-1">
            {[
              { id: 'home' as const, label: 'Home', icon: Home },
              { id: 'marketplace' as const, label: 'Market', icon: ShoppingBag },
              { id: 'messages' as const, label: 'Messages', icon: MessageCircle, count: user ? messageCount : 0 },
              { id: 'contact' as const, label: 'Contact', icon: Mail, href: '/contact' },
              { id: 'profile' as const, label: user ? 'Profile' : 'Sign in', icon: User },
            ].map(({ id, label, icon: Icon, count, href }) => {
              const active = !href && activeTab === id;
              const className = cn(
                'flex-1 flex flex-col items-center gap-0.5 py-2 mx-0.5 my-1.5 rounded-2xl transition-all duration-200',
                active
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
              );
              const content = (
                <>
                  <span className="relative inline-flex">
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-transform duration-300 ease-out',
                        active && 'scale-110'
                      )}
                    />
                    {typeof count === 'number' && count > 0 && (
                      <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] rounded-full bg-secondary text-secondary-foreground text-[10px] font-semibold flex items-center justify-center px-1 shadow-sm">
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </span>
                  <span className={cn('text-[11px] font-semibold', active && 'text-primary')}>{label}</span>
                </>
              );
              if (href) {
                return (
                  <Link key={id} to={href} className={className}>
                    {content}
                  </Link>
                );
              }
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleTabClick(id as Tab)}
                  className={className}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </nav>

        <ProductDetail
          listing={selectedListing}
          open={!!selectedListing}
          onClose={() => setSelectedListing(null)}
          onMessageSeller={handleMessageSeller}
          currentUserEmail={user?.email}
          onListingRemoved={() => {
            refreshListings();
            setSelectedListing(null);
          }}
        />

        <CreateListing
          open={showCreateListing}
          onClose={() => setShowCreateListing(false)}
          onCreated={refreshListings}
          user={user}
        />

        <AuthDialog
          open={showAuth}
          onClose={() => setShowAuth(false)}
          onAuth={(u) => {
            setUser(u);
            setActiveTab('profile');
          }}
        />
      </div>
    </div>
  );
};

export default Index;
