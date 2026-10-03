import React, { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
import { 
  Building2, 
  Home as HomeIcon, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  Mail, 
  CheckCircle2, 
  SlidersHorizontal, 
  RotateCcw, 
  Star, 
  Quote, 
  ArrowRight,
  Gem,
  Award,
  Clock,
  Layers,
  Store,
  Trees,
  Check,
  Loader2,
  ArrowUp
} from 'lucide-react';
import { 
  Property, 
  ActiveView, 
  PropertyCategory, 
  SearchFilterState,
  UserProfile 
} from './types/property';
import { 
  INITIAL_PROPERTIES, 
  CUSTOMER_REVIEWS, 
  BRAND_CONFIG, 
  CITIES 
} from './data/mockProperties';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { PropertyCard } from './components/PropertyCard';
import { PropertyCardSkeleton } from './components/PropertyCardSkeleton';
import { Footer } from './components/Footer';
import { CustomDropdown } from './components/CustomDropdown';
import { LazySection } from './components/LazySection';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FindPropertyPreferredCity } from './components/FindPropertyPreferredCity';
import { deduplicatePropertyList } from './utils/propertyHelper';

// Code-split heavy full-page views and modals to keep initial bundle ultra-light
const PropertyDetailView = lazy(() => import('./components/PropertyDetailView').then(m => ({ default: m.PropertyDetailView })));
const PostPropertyView = lazy(() => import('./components/PostPropertyView').then(m => ({ default: m.PostPropertyView })));
const ShortlistView = lazy(() => import('./components/ShortlistView').then(m => ({ default: m.ShortlistView })));
const ContactView = lazy(() => import('./components/ContactView').then(m => ({ default: m.ContactView })));
const LegalView = lazy(() => import('./components/LegalView').then(m => ({ default: m.LegalView })));
const HomeLoanView = lazy(() => import('./components/HomeLoanView').then(m => ({ default: m.HomeLoanView })));
const HousingPremiumView = lazy(() => import('./components/HousingPremiumView').then(m => ({ default: m.HousingPremiumView })));
const EmiCalculatorView = lazy(() => import('./components/EmiCalculatorView').then(m => ({ default: m.EmiCalculatorView })));
const PropertyValuationView = lazy(() => import('./components/PropertyValuationView').then(m => ({ default: m.PropertyValuationView })));
const RentReceiptView = lazy(() => import('./components/RentReceiptView').then(m => ({ default: m.RentReceiptView })));
const CityPropertiesView = lazy(() => import('./components/CityPropertiesView').then(m => ({ default: m.CityPropertiesView })));
const AdminDashboardView = lazy(() => import('./components/AdminDashboardView').then(m => ({ default: m.AdminDashboardView })));
const DashboardView = lazy(() => import('./components/dashboard/DashboardView').then(m => ({ default: m.DashboardView })));
const AuthModal = lazy(() => import('./components/AuthModal').then(m => ({ default: m.AuthModal })));
import { sanitizeUserPhone, isHelplineOrAdminPhone } from './utils/phoneSanitizer';

export default function App() {
  // Navigation & View State (NO MODALS: All views are full-page!)
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCityForView, setSelectedCityForView] = useState<string>('Mumbai');

  // User Profile / Authentication State with localStorage
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('villasell_user');
      if (!saved) return null;
      const parsed: UserProfile = JSON.parse(saved);
      // Strict Security: Only official authorized admin email can have Admin privileges
      if (parsed.role === 'Admin' && parsed.email?.toLowerCase() !== 'supportvillasell@gmail.com') {
        parsed.role = 'Buyer';
      }
      // Never attach company helpline phone to regular buyer/seller profile
      parsed.phone = sanitizeUserPhone(parsed.phone);
      try {
        localStorage.setItem('villasell_user', JSON.stringify(parsed));
      } catch {}
      return parsed;
    } catch {
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'admin'>('login');
  const [postPropertyAuthPrompt, setPostPropertyAuthPrompt] = useState(false);

  const handleOpenLogin = (mode: 'login' | 'signup' | 'admin' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleNavigateToPostProperty = () => {
    if (!currentUser) {
      setPostPropertyAuthPrompt(true);
      handleOpenLogin('signup');
      showToast('Please sign in or create an account to list your property.');
      return;
    }
    setActiveView('post-property');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Core Properties State (Live synchronized with Firestore)
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [isFirestoreLive, setIsFirestoreLive] = useState(false);

  // Live Firebase Auth & Firestore sync (Deferred non-blocking load for instant mobile FCP/LCP)
  useEffect(() => {
    let unsubAuth: (() => void) | undefined;
    let unsubFirestore: (() => void) | undefined;
    let isMounted = true;

    const initFirebase = () => {
      import('./services/firebase')
        .then(({ onAuthStatusChanged, subscribeToFirestoreProperties }) => {
          if (!isMounted) return;

          unsubAuth = onAuthStatusChanged((user) => {
            if (!isMounted) return;
            if (user) {
              user.phone = sanitizeUserPhone(user.phone);
              setCurrentUser(user);
              try {
                localStorage.setItem('villasell_user', JSON.stringify(user));
              } catch (e) {
                console.error(e);
              }
            }
          });

          unsubFirestore = subscribeToFirestoreProperties(
            (firestoreList) => {
              if (!isMounted) return;
              setIsFirestoreLive(true);
              if (firestoreList && firestoreList.length > 0) {
                const firestoreIds = new Set(firestoreList.map((p) => p.id));
                const remainingInitials = INITIAL_PROPERTIES.filter((p) => !firestoreIds.has(p.id));
                setProperties(deduplicatePropertyList([...firestoreList, ...remainingInitials]));
              } else {
                setProperties(deduplicatePropertyList(INITIAL_PROPERTIES));
              }
            },
            () => {
              if (!isMounted) return;
              setProperties((current) => deduplicatePropertyList(current.length > 0 ? current : INITIAL_PROPERTIES));
            }
          );
        })
        .catch((err) => {
          console.warn('Firebase deferred init notice:', err);
        });
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleHandle = (window as any).requestIdleCallback(initFirebase, { timeout: 1200 });
      return () => {
        isMounted = false;
        (window as any).cancelIdleCallback(idleHandle);
        unsubAuth?.();
        unsubFirestore?.();
      };
    } else {
      const timer = setTimeout(initFirebase, 250);
      return () => {
        isMounted = false;
        clearTimeout(timer);
        unsubAuth?.();
        unsubFirestore?.();
      };
    }
  }, []);

  // Shortlist State with localStorage (Defaults to 100% empty list; only buyer/client selected properties appear)
  const [shortlist, setShortlist] = useState<string[]>(() => {
    try {
      // Purge any legacy demo shortlist keys stored in user browser
      localStorage.removeItem('villasell_shortlist');
      const saved = localStorage.getItem('villasell_shortlist_v2');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('villasell_shortlist_v2', JSON.stringify(shortlist));
    } catch (e) {
      console.error(e);
    }
  }, [shortlist]);

  // Toast Notification
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const pendingCount = useMemo(() => {
    return properties.filter((p) => p.approvalStatus === 'pending').length;
  }, [properties]);

  const handleLoginSuccess = (user: UserProfile) => {
    // Strict Security: Only official authorized admin email can hold the Admin role
    if (user.role === 'Admin' && user.email?.toLowerCase() !== 'supportvillasell@gmail.com') {
      user.role = 'Buyer';
    }
    user.phone = sanitizeUserPhone(user.phone);
    setCurrentUser(user);
    try {
      localStorage.setItem('villasell_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    setAuthModalOpen(false);

    if (user.role === 'Admin') {
      setActiveView('admin-panel');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`Welcome Administrator ${user.name}! Admin Control Panel loaded.`);
    } else if (postPropertyAuthPrompt) {
      setPostPropertyAuthPrompt(false);
      setActiveView('post-property');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`Welcome, ${user.name}! You are signed in. You can now post your property.`);
    } else {
      setActiveView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`Welcome back, ${user.name}! Opening your User Dashboard.`);
    }
  };

  // Route protection for admin-panel
  useEffect(() => {
    if (activeView === 'admin-panel') {
      if (!currentUser || currentUser.role !== 'Admin' || currentUser.email?.toLowerCase() !== 'supportvillasell@gmail.com') {
        setActiveView('home');
      }
    }
  }, [activeView, currentUser]);

  const handleLogout = async () => {
    try {
      const { logoutFromFirebase } = await import('./services/firebase');
      await logoutFromFirebase();
    } catch (e) {
      console.warn('Firebase logout notice:', e);
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem('villasell_user');
    } catch (e) {
      console.error(e);
    }
    if (activeView === 'admin-panel' || activeView === 'dashboard') {
      setActiveView('home');
    }
    showToast('You have been logged out.');
  };

  // Search & Filter State
  const [filters, setFilters] = useState<SearchFilterState>({
    category: 'all',
    city: 'All Cities',
    keyword: '',
    bhk: 'all',
    budgetRange: 'all',
    propertyType: 'all',
    sortBy: 'featured',
  });
  const [activeQuickCard, setActiveQuickCard] = useState<string | null>(null);

  // Shortlist toggle handler
  const handleToggleShortlist = (id: string) => {
    setShortlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from saved shortlist');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Property added to your shortlist!');
        return [...prev, id];
      }
    });
  };

  const handleClearShortlist = () => {
    setShortlist([]);
    showToast('Shortlist cleared');
  };

  // View property details (full page)
  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setActiveView('property-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // New property added via Post Property form
  const handlePropertyAdded = (newProp: Property) => {
    setProperties((prev) => deduplicatePropertyList([newProp, ...prev.filter(p => p.id !== newProp.id)]));
    showToast(`Property submitted! Awaiting Admin verification (Alert sent to ${BRAND_CONFIG.email}).`);
  };

  // Filter and Sort properties
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // 1. Restriction: Only approved properties appear on the public website search and catalog
      const status = prop.approvalStatus || 'approved';
      if (status === 'pending' || status === 'rejected') {
        return false;
      }

      // Category filter
      if (filters.category && filters.category !== 'all' && prop.category !== filters.category) {
        return false;
      }

      // City filter
      if (filters.city && filters.city !== 'All Cities') {
        const filterCity = filters.city.toLowerCase();
        const propCity = prop.city.toLowerCase();
        const propLoc = prop.locality.toLowerCase();
        const propAddr = prop.address.toLowerCase();

        let matches = propCity === filterCity;

        // Bengaluru / Bangalore synonym
        if (filterCity.includes('bangalore') || filterCity.includes('bengaluru')) {
          matches = propCity.includes('bangalore') || propCity.includes('bengaluru');
        }

        // Delhi NCR / Noida / Gurgaon
        if (filterCity.includes('delhi') || filterCity.includes('ncr')) {
          matches = propCity.includes('delhi') || propCity.includes('ncr') || propLoc.includes('delhi') || propLoc.includes('gurugram') || propLoc.includes('noida');
        } else if (filterCity === 'noida') {
          matches = propCity.includes('noida') || propLoc.includes('noida') || propAddr.includes('noida');
        } else if (filterCity === 'gurgaon') {
          matches = propCity.includes('gurgaon') || propCity.includes('gurugram') || propLoc.includes('gurugram') || propAddr.includes('gurugram') || propAddr.includes('gurgaon');
        }

        // Mumbai / Thane / Navi Mumbai
        if (filterCity === 'thane') {
          matches = propCity.includes('thane') || propLoc.includes('thane');
        } else if (filterCity === 'navi mumbai') {
          matches = propCity.includes('navi mumbai') || propLoc.includes('navi mumbai');
        }

        // Prayagraj / Allahabad
        if (filterCity.includes('prayagraj') || filterCity.includes('allahabad')) {
          matches = propCity.includes('prayagraj') || propCity.includes('allahabad') || propLoc.includes('civil lines') || propLoc.includes('sangam') || propLoc.includes('ashok nagar') || propAddr.includes('prayagraj');
        }

        // Lucknow
        if (filterCity === 'lucknow') {
          matches = propCity.includes('lucknow') || propLoc.includes('gomti') || propLoc.includes('hazratganj') || propAddr.includes('lucknow');
        }

        // Varanasi
        if (filterCity === 'varanasi' || filterCity === 'kashi') {
          matches = propCity.includes('varanasi') || propLoc.includes('sigra') || propLoc.includes('shivpur') || propAddr.includes('varanasi');
        }

        if (!matches) {
          return false;
        }
      }

      // Keyword search
      if (filters.keyword.trim()) {
        const query = filters.keyword.toLowerCase().trim();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesLocality = prop.locality.toLowerCase().includes(query);
        const matchesAddress = prop.address.toLowerCase().includes(query);
        const matchesType = prop.propertyType.toLowerCase().includes(query);
        const matchesCity = prop.city.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocality && !matchesAddress && !matchesType && !matchesCity) {
          return false;
        }
      }

      // BHK filter
      if (filters.bhk !== 'all') {
        if (filters.bhk === '4+') {
          if (prop.bedrooms < 4) return false;
        } else {
          if (prop.bedrooms !== Number(filters.bhk)) return false;
        }
      }

      // Budget filter
      if (filters.budgetRange !== 'all') {
        if (filters.budgetRange === 'under-50l' && prop.price >= 5000000) return false;
        if (filters.budgetRange === '50l-1cr' && (prop.price < 5000000 || prop.price > 10000000)) return false;
        if (filters.budgetRange === '1cr-3cr' && (prop.price < 10000000 || prop.price > 30000000)) return false;
        if (filters.budgetRange === 'above-3cr' && prop.price <= 30000000) return false;
      }

      // Property type filter
      if (filters.propertyType !== 'all') {
        if (prop.propertyType !== filters.propertyType) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [properties, filters]);

  // Lazy Loading & Infinite Scrolling State
  const INITIAL_VISIBLE_COUNT = 6;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);

  // Reset pagination count when search filters or active category change
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [filters]);

  // Infinite Scroll IntersectionObserver: Automatically load more items as user scrolls
  useEffect(() => {
    if (activeView !== 'home') return;
    const sentinel = loadMoreSentinelRef.current;
    if (!sentinel) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isLoadingMore && visibleCount < filteredProperties.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 6, filteredProperties.length));
            setIsLoadingMore(false);
          }, 350);
        }
      },
      { rootMargin: '250px 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [activeView, isLoadingMore, visibleCount, filteredProperties.length]);

  const handleLoadMoreManually = () => {
    if (isLoadingMore || visibleCount >= filteredProperties.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 6, filteredProperties.length));
      setIsLoadingMore(false);
    }, 300);
  };

  const visibleProperties = useMemo(() => {
    return filteredProperties.slice(0, visibleCount);
  }, [filteredProperties, visibleCount]);

  // Shortlisted property objects
  const shortlistedProps = useMemo(() => {
    return properties.filter((p) => shortlist.includes(p.id));
  }, [properties, shortlist]);

  const resetFilters = () => {
    setActiveQuickCard(null);
    setFilters({
      category: 'all',
      city: 'All Cities',
      keyword: '',
      bhk: 'all',
      budgetRange: 'all',
      propertyType: 'all',
      sortBy: 'featured',
    });
  };

  const scrollToProperties = () => {
    const el = document.getElementById('featured-listings');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCityPage = (cityName: string) => {
    setSelectedCityForView(cityName);
    setActiveView('city-properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900 pb-16 md:pb-0">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Navbar (Hidden in dedicated Admin Panel) */}
      {activeView !== 'admin-panel' && (
        <Navbar
          activeView={activeView}
          setActiveView={setActiveView}
          selectedCategory={filters.category}
          onSelectCategory={(cat) => setFilters((prev) => ({ ...prev, category: cat }))}
          shortlistCount={shortlist.length}
          selectedCity={filters.city}
          onSelectCity={(c) => {
            setFilters((prev) => ({
              ...prev,
              city: c,
              category: 'all',
              keyword: '',
            }));
            setActiveView('home');
            setTimeout(() => {
              scrollToProperties();
            }, 120);
          }}
          currentUser={currentUser}
          onOpenLogin={() => handleOpenLogin('login')}
          onOpenLoginWithMode={handleOpenLogin}
          onNavigateToPostProperty={handleNavigateToPostProperty}
          onLogout={handleLogout}
          menuDrawerOpen={mobileMenuOpen}
          setMenuDrawerOpen={setMobileMenuOpen}
          pendingCount={pendingCount}
        />
      )}

      {/* ROUTING VIEWS (Full Page, No Popups) */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <Suspense fallback={
          <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2 py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs font-bold text-slate-500">Loading view...</span>
          </div>
        }>
        {/* VIEW: DEDICATED ADMIN CONTROL PANEL */}
        {activeView === 'admin-panel' && (
          <AdminDashboardView
            user={currentUser || {
              name: 'VillaSell Admin (Super Admin)',
              email: BRAND_CONFIG.email,
              phone: BRAND_CONFIG.phone,
              role: 'Admin',
              city: 'Varanasi',
            }}
            properties={properties}
            onUpdateProperty={(updatedProp) => {
              setProperties((prev) => prev.map((p) => p.id === updatedProp.id ? updatedProp : p));
            }}
            onDeleteProperty={(id) => {
              setProperties((prev) => prev.filter((p) => p.id !== id));
            }}
            onSelectProperty={handleSelectProperty}
            onBackToWebsite={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToPostProperty={() => {
              setActiveView('post-property');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLogout={handleLogout}
            showToast={showToast}
          />
        )}

        {/* VIEW: USER DEDICATED DASHBOARD (Buyer, Agent, Owner) */}
        {activeView === 'dashboard' && currentUser && (
          <DashboardView
            user={currentUser}
            onUpdateUserRole={(newRole) => {
              setCurrentUser((prev) => prev ? { ...prev, role: newRole } : null);
            }}
            onUpdateUserProfile={(updated) => {
              setCurrentUser((prev) => {
                if (!prev) return null;
                const next = { ...prev, ...updated };
                next.phone = sanitizeUserPhone(next.phone);
                try {
                  localStorage.setItem('villasell_user', JSON.stringify(next));
                } catch {}
                return next;
              });
            }}
            onBackToMarketplace={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            properties={properties}
            onAddProperty={handlePropertyAdded}
            onUpdateProperty={(updatedProp) => {
              setProperties((prev) => prev.map((p) => p.id === updatedProp.id ? updatedProp : p));
            }}
            onDeleteProperty={(id) => {
              setProperties((prev) => prev.filter((p) => p.id !== id));
            }}
            onSelectProperty={handleSelectProperty}
            shortlist={shortlist}
            onToggleShortlist={handleToggleShortlist}
            inquiries={[]}
            onUpdateInquiryStatus={() => {}}
            siteVisits={[]}
            onAddSiteVisit={() => {}}
            onCancelSiteVisit={() => {}}
            searchAlerts={[]}
            onAddSearchAlert={() => {}}
            onDeleteSearchAlert={() => {}}
            buyerRequirements={[]}
            onAddBuyerRequirement={() => {}}
            onLogout={handleLogout}
            onNavigateToPostProperty={() => {
              setActiveView('post-property');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            showToast={showToast}
          />
        )}

        {/* VIEW 1: PROPERTY DETAIL */}
        {activeView === 'property-detail' && selectedProperty && (
          <PropertyDetailView
            property={selectedProperty}
            onBack={() => setActiveView('home')}
            isShortlisted={shortlist.includes(selectedProperty.id)}
            onToggleShortlist={handleToggleShortlist}
            allProperties={properties}
            onSelectProperty={handleSelectProperty}
          />
        )}

        {/* VIEW 2: POST PROPERTY FOR FREE */}
        {activeView === 'post-property' && (
          <PostPropertyView
            onBack={() => setActiveView('home')}
            onPropertyAdded={handlePropertyAdded}
            onViewProperty={handleSelectProperty}
            currentUser={currentUser}
            onRequireAuth={() => {
              setPostPropertyAuthPrompt(true);
              handleOpenLogin('signup');
            }}
            onNavigateToDashboard={() => {
              setActiveView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToAdminPanel={() => {
              if (currentUser?.role === 'Admin') {
                setActiveView('admin-panel');
              } else {
                handleOpenLogin('admin');
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW 3: SHORTLIST / SAVED */}
        {activeView === 'shortlist' && (
          <ShortlistView
            shortlistedProperties={shortlistedProps}
            onBack={() => setActiveView('home')}
            onToggleShortlist={handleToggleShortlist}
            onClearAll={handleClearShortlist}
            onSelectProperty={handleSelectProperty}
          />
        )}

        {/* VIEW 4: CONTACT US */}
        {activeView === 'contact' && (
          <ContactView onBack={() => setActiveView('home')} />
        )}

        {/* VIEW 5: LEGAL & POLICIES */}
        {(activeView === 'privacy-policy' ||
          activeView === 'terms' ||
          activeView === 'rera-disclaimer' ||
          activeView === 'cookie-policy') && (
          <LegalView
            viewType={activeView}
            onBack={() => setActiveView('home')}
            onSelectView={setActiveView}
          />
        )}

        {/* VIEW 6: HOME LOAN (Housing Edge) */}
        {activeView === 'home-loan' && (
          <HomeLoanView
            onBack={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
            onNavigateToEmi={() => {
              setActiveView('emi-calculator');
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
          />
        )}

        {/* VIEW 7: HOUSING PREMIUM (Housing Edge) */}
        {activeView === 'housing-premium' && (
          <HousingPremiumView
            onBack={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
            onPostProperty={() => {
              setActiveView('post-property');
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
          />
        )}

        {/* VIEW 8: EMI CALCULATOR (Tools) */}
        {activeView === 'emi-calculator' && (
          <EmiCalculatorView
            onBack={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
            onNavigateToHomeLoan={() => {
              setActiveView('home-loan');
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
          />
        )}

        {/* VIEW 9: PROPERTY VALUE CALCULATOR (Tools) */}
        {activeView === 'property-valuation' && (
          <PropertyValuationView
            onBack={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
            onPostProperty={() => {
              setActiveView('post-property');
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
          />
        )}

        {/* VIEW 10: RENT RECEIPT GENERATOR (Tools) */}
        {activeView === 'rent-receipt-generator' && (
          <RentReceiptView
            onBack={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
          />
        )}

        {/* VIEW 11: CITY PROPERTIES (Dedicated Full Internal Page for Selected City) */}
        {activeView === 'city-properties' && (
          <CityPropertiesView
            cityName={selectedCityForView}
            allProperties={properties}
            onBack={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
            onSelectProperty={handleSelectProperty}
            shortlistedIds={shortlist}
            onToggleShortlist={handleToggleShortlist}
            onSwitchCity={(newCityName) => {
              setSelectedCityForView(newCityName);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW 12: HOMEPAGE */}
        {activeView === 'home' && (
          <div>
            {/* Hero Unified Search & Category Tabs */}
            <HeroSearch
              filters={filters}
              setFilters={setFilters}
              totalMatches={filteredProperties.length}
              onSearchClick={scrollToProperties}
              onPostPropertyClick={handleNavigateToPostProperty}
            />

            {/* Quick Category Cards Section (Compact, Professional & Subtle Animated Gradient on Click) */}
            <LazySection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                {/* Card 1: Luxury Villas */}
                <div
                  onClick={() => {
                    setActiveQuickCard('villa');
                    setFilters((prev) => ({ ...prev, category: 'buy', propertyType: 'Villa' }));
                    scrollToProperties();
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl border cursor-pointer select-none transition-all duration-300 active:scale-[0.97] ${
                    activeQuickCard === 'villa'
                      ? 'bg-gradient-to-r from-blue-50 via-sky-50 to-blue-100/60 animate-subtle-shimmer border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-md shadow-xs'
                  }`}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                    activeQuickCard === 'villa' ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-50 text-blue-700'
                  }`}>
                    <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">Luxury Villas</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Triplex & Heritage Villas
                  </p>
                </div>

                {/* Card 2: Luxury Apartments */}
                <div
                  onClick={() => {
                    setActiveQuickCard('flats');
                    setFilters((prev) => ({ ...prev, category: 'buy', propertyType: 'Luxury Apartment' }));
                    scrollToProperties();
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl border cursor-pointer select-none transition-all duration-300 active:scale-[0.97] ${
                    activeQuickCard === 'flats'
                      ? 'bg-gradient-to-r from-blue-50 via-sky-50 to-blue-100/60 animate-subtle-shimmer border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-md shadow-xs'
                  }`}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                    activeQuickCard === 'flats' ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-50 text-blue-700'
                  }`}>
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">High-Rise Flats</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Sea & Skyline Views
                  </p>
                </div>

                {/* Card 3: Ready to Move */}
                <div
                  onClick={() => {
                    setActiveQuickCard('ready');
                    setFilters((prev) => ({ ...prev, category: 'buy', propertyType: 'all' }));
                    scrollToProperties();
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl border cursor-pointer select-none transition-all duration-300 active:scale-[0.97] ${
                    activeQuickCard === 'ready'
                      ? 'bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-100/60 animate-subtle-shimmer border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-emerald-200 hover:shadow-md shadow-xs'
                  }`}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                    activeQuickCard === 'ready' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">Ready to Move</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Zero waiting possession
                  </p>
                </div>

                {/* Card 4: Commercial Spaces */}
                <div
                  onClick={() => {
                    setActiveQuickCard('commercial');
                    setFilters((prev) => ({ ...prev, category: 'commercial', propertyType: 'all' }));
                    scrollToProperties();
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl border cursor-pointer select-none transition-all duration-300 active:scale-[0.97] ${
                    activeQuickCard === 'commercial'
                      ? 'bg-gradient-to-r from-blue-50 via-sky-50 to-blue-100/60 animate-subtle-shimmer border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-md shadow-xs'
                  }`}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                    activeQuickCard === 'commercial' ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-50 text-blue-700'
                  }`}>
                    <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">Commercial Hubs</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Offices & Retail Shops
                  </p>
                </div>

                {/* Card 5: Gated Plots */}
                <div
                  onClick={() => {
                    setActiveQuickCard('plots');
                    setFilters((prev) => ({ ...prev, category: 'plots', propertyType: 'all' }));
                    scrollToProperties();
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl border cursor-pointer select-none transition-all duration-300 active:scale-[0.97] col-span-2 sm:col-span-1 ${
                    activeQuickCard === 'plots'
                      ? 'bg-gradient-to-r from-blue-50 via-sky-50 to-blue-100/60 animate-subtle-shimmer border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-md shadow-xs'
                  }`}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                    activeQuickCard === 'plots' ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-50 text-blue-700'
                  }`}>
                    <Trees className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">Residential Plots</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Sanctioned Villa Lands
                  </p>
                </div>
              </div>
            </LazySection>

            {/* Find Your Property in Your Preferred City (RealEstateIndia inspired feature with authentic landmark images) */}
            <LazySection id="preferred-cities">
              <FindPropertyPreferredCity onSelectCity={handleOpenCityPage} />
            </LazySection>

            {/* Featured & Verified Listings Grid (Progressive / Lazy Loaded) */}
            <LazySection id="featured-listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
              {/* Header & Controls */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wide">
                      {filters.city === 'All Cities' ? 'All Top Metros' : `📍 ${filters.city}`}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      • {filteredProperties.length} Properties Available
                    </span>
                    {filters.city !== 'All Cities' && (
                      <button
                        onClick={() => setFilters((prev) => ({ ...prev, city: 'All Cities' }))}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-bold underline ml-1 cursor-pointer"
                      >
                        Show All Cities
                      </button>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {filters.city !== 'All Cities' ? (
                      <span>Properties, Buildings & Rentals in <span className="text-blue-600">{filters.city}</span></span>
                    ) : (
                      <>
                        {filters.category === 'all' && 'All Verified Properties & Rentals'}
                        {filters.category === 'buy' && 'Featured Properties For Sale'}
                        {filters.category === 'rent' && 'Verified Rental Homes & Apartments'}
                        {filters.category === 'commercial' && 'Prime Commercial & Office Assets'}
                        {filters.category === 'plots' && 'RERA Sanctioned Residential Plots'}
                      </>
                    )}
                  </h2>

                  {/* Filter Pills for the chosen city */}
                  {filters.city !== 'All Cities' && (
                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      <span className="text-xs font-bold text-slate-500 mr-1">View:</span>
                      <button
                        onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          filters.category === 'all'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        All in {filters.city}
                      </button>
                      <button
                        onClick={() => setFilters((prev) => ({ ...prev, category: 'buy' }))}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          filters.category === 'buy'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        For Sale / Villas
                      </button>
                      <button
                        onClick={() => setFilters((prev) => ({ ...prev, category: 'rent' }))}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          filters.category === 'rent'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        For Rent
                      </button>
                      <button
                        onClick={() => setFilters((prev) => ({ ...prev, category: 'commercial' }))}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          filters.category === 'commercial'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Commercial
                      </button>
                    </div>
                  )}
                </div>

                {/* Sorting & Filter Controls */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Property Type Dropdown */}
                  <div className="w-44 sm:w-48">
                    <CustomDropdown
                      value={filters.propertyType}
                      onChange={(val) => setFilters((prev) => ({ ...prev, propertyType: val }))}
                      options={[
                        { value: 'all', label: 'All Property Types' },
                        { value: 'Villa', label: 'Villa' },
                        { value: 'Luxury Apartment', label: 'Luxury Apartment' },
                        { value: 'Apartment', label: 'Apartment' },
                        { value: 'Penthouse', label: 'Penthouse' },
                        { value: 'Commercial Office', label: 'Commercial Office' },
                        { value: 'Residential Plot', label: 'Residential Plot' },
                      ]}
                      theme="subtle"
                      size="sm"
                    />
                  </div>

                  {/* Sort By Dropdown */}
                  <div className="w-40 sm:w-44">
                    <CustomDropdown
                      value={filters.sortBy}
                      onChange={(val) => setFilters((prev) => ({ ...prev, sortBy: val as any }))}
                      options={[
                        { value: 'featured', label: 'Featured First' },
                        { value: 'price-asc', label: 'Price: Low to High' },
                        { value: 'price-desc', label: 'Price: High to Low' },
                        { value: 'newest', label: 'Newly Listed' },
                      ]}
                      theme="subtle"
                      size="sm"
                    />
                  </div>

                  {/* Reset Filters */}
                  {(filters.city !== 'All Cities' ||
                    filters.keyword ||
                    filters.bhk !== 'all' ||
                    filters.budgetRange !== 'all' ||
                    filters.propertyType !== 'all') && (
                    <button
                      onClick={resetFilters}
                      className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Reset all filters"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Listings Grid */}
              {filteredProperties.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs my-8">
                  <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
                    <SlidersHorizontal className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">No Matching Properties Found</h3>
                  <p className="text-xs text-slate-500 mb-5">
                    We could not find listings matching your current search parameters. Try broadening your budget or location.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {visibleProperties.map((prop) => (
                      <PropertyCard
                        key={prop.id}
                        property={prop}
                        isShortlisted={shortlist.includes(prop.id)}
                        onToggleShortlist={handleToggleShortlist}
                        onSelectProperty={handleSelectProperty}
                      />
                    ))}

                    {/* Skeletons while loading next batch */}
                    {isLoadingMore && (
                      <>
                        <PropertyCardSkeleton />
                        <PropertyCardSkeleton />
                        <PropertyCardSkeleton />
                      </>
                    )}
                  </div>

                  {/* Lazy Loading Infinite Scroll Sentinel & Controls */}
                  {visibleCount < filteredProperties.length && (
                    <div className="mt-10 flex flex-col items-center justify-center gap-3">
                      {/* Invisible sentinel for scroll trigger */}
                      <div ref={loadMoreSentinelRef} className="h-4 w-full" />

                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold border border-blue-100 shadow-xs">
                        {isLoadingMore ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                            <span>Loading more properties...</span>
                          </>
                        ) : (
                          <span>Showing {visibleProperties.length} of {filteredProperties.length} properties</span>
                        )}
                      </div>

                      <button
                        onClick={handleLoadMoreManually}
                        disabled={isLoadingMore}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-800 disabled:opacity-60 text-white font-bold text-xs shadow-md cursor-pointer transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isLoadingMore ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Loading Properties...</span>
                          </>
                        ) : (
                          <span>Load More Properties ({filteredProperties.length - visibleProperties.length} remaining)</span>
                        )}
                      </button>
                    </div>
                  )}

                  {/* All items loaded notice */}
                  {visibleCount >= filteredProperties.length && filteredProperties.length > INITIAL_VISIBLE_COUNT && (
                    <div className="mt-12 text-center py-6 border-t border-slate-200">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>You have viewed all {filteredProperties.length} properties</span>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-900 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                          <span>Back to top of listings</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </LazySection>

            {/* Why Choose VillaSell (Lazy Loaded on Scroll) */}
            <LazySection className="bg-gradient-to-b from-white to-slate-50 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wider">
                    The VillaSell Difference
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 mt-2">
                    Why Smart Buyers & Sellers Prefer Us
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Eliminating traditional broker friction with guaranteed legal security and direct deals.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Feature 1 */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-200 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900 mb-1.5">100% Verified Owners</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Every listed villa, flat, and plot is authenticated through registry verification and municipal records.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-200 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900 mb-1.5">Free Legal Assistance</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Our in-house legal team audits title clearance, encumbrance certificates, and RERA approval at no cost.
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-200 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                      <Gem className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900 mb-1.5">Zero Hidden Charges</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Transparent pricing directly between buyer and seller. Save up to ₹5 to 15 Lakhs in broker commissions.
                    </p>
                  </div>

                  {/* Feature 4 */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-200 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                      <Phone className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900 mb-1.5">24x7 Customer Support</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Helpline assistance at <span className="font-bold text-slate-900">{BRAND_CONFIG.phone}</span> with dedicated site tour coordinators.
                    </p>
                  </div>
                </div>
              </div>
            </LazySection>

            {/* Direct Owner Contact / Helpline Banner (Lazy Loaded on Scroll) */}
            <LazySection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7">
                    <span className="bg-emerald-500 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-full tracking-wider">
                      Official Property Desk
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black mt-3 mb-2 leading-tight">
                      Have a Question or Need Guided Assistance?
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                      Speak directly with the VillaSell official advisory team. We help with site visits, loan pre-approvals, and registry documentation.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-200">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Instant phone consultation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Free property valuation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>No obligation advice</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-3">
                    <a
                      href={`tel:${BRAND_CONFIG.phoneClean}`}
                      className="w-full py-3 px-4 rounded-xl bg-white text-slate-900 font-black text-sm flex items-center justify-center gap-2.5 hover:bg-slate-100 transition-colors shadow-lg"
                    >
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>Call: {BRAND_CONFIG.phone}</span>
                    </a>

                    <a
                      href={BRAND_CONFIG.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-colors shadow-lg shadow-emerald-950/20"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Consultation</span>
                    </a>

                    <a
                      href={`mailto:${BRAND_CONFIG.email}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      <span>{BRAND_CONFIG.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </LazySection>

            {/* Customer Reviews & Testimonials Section (Lazy Loaded on Scroll) */}
            <LazySection className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider">
                      Verified Buyer Testimonials
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                      Trusted by Hundreds of Families
                    </h2>
                  </div>

                  <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="text-slate-900 font-black">4.9 / 5.0</span>
                    <span className="text-slate-500 font-normal text-xs">(Based on 450+ reviews)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {CUSTOMER_REVIEWS.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        {/* Rating stars */}
                        <div className="flex items-center gap-1 text-amber-500 mb-3">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-500" />
                          ))}
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 mb-2">"{rev.title}"</h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          {rev.comment}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-200/70 flex items-center gap-3">
                        <img
                          src={rev.avatarUrl}
                          alt={rev.author}
                          loading="lazy"
                          decoding="async"
                          className="w-10 h-10 rounded-full object-cover border border-blue-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">{rev.author}</span>
                            {rev.verifiedBuyer && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                          </div>
                          <span className="text-[11px] text-blue-600 font-medium block">
                            {rev.propertyBought}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </LazySection>
          </div>
        )}
        </Suspense>
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden in dedicated Admin Panel) */}
      {activeView !== 'admin-panel' && (
        <MobileBottomNav
          activeView={activeView}
          setActiveView={setActiveView}
          shortlistCount={shortlist.length}
          onPostPropertyClick={handleNavigateToPostProperty}
          onSearchClick={() => {
            if (activeView !== 'home') setActiveView('home');
            setTimeout(() => {
              scrollToProperties();
            }, 60);
          }}
          onOpenMenu={() => setMobileMenuOpen(true)}
        />
      )}

      {/* Professional Housing.com Style Footer (Hidden in dedicated Admin Panel) */}
      {activeView !== 'admin-panel' && (
        <Footer
          onSelectView={(view) => {
            if (view === 'post-property') {
              handleNavigateToPostProperty();
              return;
            }
            setActiveView(view);
          }}
          onSelectCategory={(cat) => setFilters((prev) => ({ ...prev, category: cat }))}
          onSelectCity={(city) => setFilters((prev) => ({ ...prev, city }))}
        />
      )}

      {/* User Login & Authentication Modal (Code-split) */}
      {authModalOpen && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => {
              setAuthModalOpen(false);
              setPostPropertyAuthPrompt(false);
            }}
            onLoginSuccess={handleLoginSuccess}
            initialMode={authModalMode}
            customMessage={
              postPropertyAuthPrompt
                ? 'List your property for free with 0% brokerage. Sign in or create an account to manage your listings, review buyer inquiries, and track live status updates.'
                : undefined
            }
          />
        </Suspense>
      )}
    </div>
  );
}
