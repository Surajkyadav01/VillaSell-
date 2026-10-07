import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Heart, 
  PlusCircle, 
  Phone, 
  Menu, 
  X, 
  Sparkles, 
  Building2, 
  Store, 
  Trees, 
  MapPin,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  Briefcase,
  ShoppingBag
} from 'lucide-react';
import { BRAND_CONFIG, CITIES } from '../data/mockProperties';
import { sanitizeUserPhone, resolveUserDisplayName } from '../utils/phoneSanitizer';
import { ActiveView, PropertyCategory, UserProfile } from '../types/property';
import { CustomDropdown } from './CustomDropdown';
import { CityMegaDropdown } from './CityMegaDropdown';
import { MenuDrawer } from './MenuDrawer';
import { ServicesDropdown } from './ServicesDropdown';
import { DownloadAppButton } from './DownloadAppButton';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedCategory: PropertyCategory | 'all';
  onSelectCategory: (cat: PropertyCategory | 'all') => void;
  shortlistCount: number;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onOpenLoginWithMode?: (mode: 'login' | 'signup' | 'admin') => void;
  onLogout: () => void;
  onNavigateToPostProperty?: () => void;
  menuDrawerOpen?: boolean;
  setMenuDrawerOpen?: (open: boolean) => void;
  pendingCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  selectedCategory,
  onSelectCategory,
  shortlistCount,
  selectedCity,
  onSelectCity,
  currentUser,
  onOpenLogin,
  onOpenLoginWithMode,
  onNavigateToPostProperty,
  onLogout,
  menuDrawerOpen,
  setMenuDrawerOpen,
  pendingCount = 0,
}) => {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const isDrawerOpen = menuDrawerOpen !== undefined ? menuDrawerOpen : internalMenuOpen;
  const setIsDrawerOpen = setMenuDrawerOpen || setInternalMenuOpen;

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (cat: PropertyCategory | 'all') => {
    onSelectCategory(cat);
    setActiveView('home');
  };

  const navigateTo = (view: ActiveView) => {
    if (view === 'post-property') {
      if (onNavigateToPostProperty) {
        onNavigateToPostProperty();
        return;
      }
      if (!currentUser) {
        if (onOpenLoginWithMode) {
          onOpenLoginWithMode('signup');
        } else {
          onOpenLogin();
        }
        return;
      }
    }
    setActiveView(view);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full max-w-full bg-gradient-to-r from-[#1b4a80] via-[#255e9c] to-[#2b568d] border-b border-sky-300/35 shadow-md backdrop-blur-md">
        <div className="w-full max-w-full px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 sm:h-18 w-full max-w-full min-w-0">
            {/* Left: Custom Luxury Real Estate Logo & City Selector in corner */}
            <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 shrink-0">
              {/* Logo */}
              <button
                onClick={() => navigateTo('home')}
                className="flex items-center gap-1.5 sm:gap-2.5 text-left group cursor-pointer focus:outline-none shrink-0"
                title="VillaSell Home"
              >
                {/* Luxury Architectural Villa Emblem */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-800 to-slate-900 border border-blue-300/40 flex items-center justify-center shadow-md sm:shadow-lg shadow-slate-900/60 group-hover:scale-105 group-hover:border-amber-400/60 transition-all shrink-0">
                  <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-7.5 sm:h-7.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Villa Structure & Roof */}
                    <path
                      d="M16 4L4 14.5H8.5V26.5H23.5V14.5H28L16 4Z"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="rgba(255,255,255,0.08)"
                    />
                    {/* Golden Villa Gable / Balcony Header */}
                    <path
                      d="M16 8.5L9.5 14.5H22.5L16 8.5Z"
                      fill="#f59e0b"
                    />
                    {/* Grand Arched Villa Entrance */}
                    <path
                      d="M13.5 26.5V19.5C13.5 18.4 14.6 17.5 16 17.5C17.4 17.5 18.5 18.4 18.5 19.5V26.5"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {/* Chimney Detail */}
                    <path
                      d="M21.5 8.5V6H24V11"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Brand Typography (VillaSell without .com) */}
                <div className="flex items-center gap-1">
                  <span className="text-lg sm:text-2xl font-black tracking-tight text-white font-sans">
                    Villa<span className="text-amber-400">Sell</span>
                  </span>
                  <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[9px] uppercase font-black tracking-wider rounded bg-emerald-500 text-slate-950 shadow-xs">
                    Verified
                  </span>
                </div>
              </button>

              {/* All Cities Selector (Housing.com style: mega cities popup with search & landmark grid) */}
              <div className="w-auto shrink-0 mr-0.5 sm:mr-2 lg:mr-3">
                <CityMegaDropdown
                  selectedCity={selectedCity}
                  onSelectCity={(city) => {
                    onSelectCity(city);
                    if (activeView !== 'home') setActiveView('home');
                  }}
                />
              </div>
            </div>

            {/* Desktop Navigation Links (Visible on xl+ screens where space permits) */}
            <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1 font-semibold text-[13px] 2xl:text-sm ml-1 2xl:ml-3 shrink-0">
              <button
                onClick={() => handleCategoryClick('buy')}
                className={`px-2 2xl:px-2.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  activeView === 'home' && selectedCategory === 'buy'
                    ? 'text-white bg-blue-500/80 shadow-inner border border-blue-300/40'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Buy
              </button>

              <button
                onClick={() => handleCategoryClick('rent')}
                className={`px-2 2xl:px-2.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  activeView === 'home' && selectedCategory === 'rent'
                    ? 'text-white bg-blue-500/80 shadow-inner border border-blue-300/40'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Rent
              </button>

              <button
                onClick={() => handleCategoryClick('commercial')}
                className={`px-2 2xl:px-2.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  activeView === 'home' && selectedCategory === 'commercial'
                    ? 'text-white bg-blue-500/80 shadow-inner border border-blue-300/40'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Commercial
              </button>

              <button
                onClick={() => handleCategoryClick('plots')}
                className={`px-2 2xl:px-2.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  activeView === 'home' && selectedCategory === 'plots'
                    ? 'text-white bg-blue-500/80 shadow-inner border border-blue-300/40'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Plots
              </button>

              {/* SERVICES DROPDOWN (Housing Edge & Tools) */}
              <ServicesDropdown
                activeView={activeView}
                onNavigate={navigateTo}
              />

              {/* Contact Navigation Link */}
              <button
                onClick={() => navigateTo('contact')}
                className={`px-2 2xl:px-2.5 py-1.5 rounded-xl font-semibold text-[13px] 2xl:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  activeView === 'contact'
                    ? 'text-white bg-blue-500/80 shadow-inner border border-blue-300/40'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0 ml-2">
              {/* Download App Button (Desktop only, strictly hidden on mobile navbar) */}
              <div className="hidden lg:block shrink-0">
                <DownloadAppButton variant="navbar" />
              </div>

              {/* Shortlist Heart Button */}
              <button
                onClick={() => navigateTo('shortlist')}
                className={`relative p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${
                  activeView === 'shortlist'
                    ? 'border-sky-300 bg-blue-500/40 text-white'
                    : 'border-white/20 text-sky-100 hover:text-white hover:border-sky-300 hover:bg-white/10'
                }`}
                title="Saved Properties"
                aria-label="View Saved Properties"
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${shortlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                {shortlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs">
                    {shortlistCount}
                  </span>
                )}
              </button>

              {/* Post Property FREE Button */}
              <button
                onClick={() => navigateTo('post-property')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-950/40 hover:shadow-lg transition-all cursor-pointer transform active:scale-95 border border-sky-300/30 shrink-0"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>Post Property</span>
                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded-full bg-emerald-400 text-slate-950 tracking-wider">
                  FREE
                </span>
              </button>

              {/* LOGIN / USER ACCOUNT */}
              {!currentUser ? (
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-sky-300/30 hover:border-amber-400/60 shadow-xs transition-all cursor-pointer shrink-0"
                  title="Login or Sign Up"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                  <span>Login</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  {/* Role Badge in Navbar (Refined, no brackets, matches site palette) */}
                  <div className="hidden lg:flex items-center">
                    {currentUser.role === 'Buyer' && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-emerald-200 font-extrabold text-xs shadow-sm shadow-emerald-950/20 backdrop-blur-sm tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
                        <span>Buyer Space</span>
                      </span>
                    )}

                    {currentUser.role === 'Agent' && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-200 font-bold text-xs shadow-2xs backdrop-blur-xs">
                        <Briefcase className="w-3 h-3 text-sky-300" />
                        <span>Agent Space</span>
                      </span>
                    )}

                    {(currentUser.role === 'Owner' || currentUser.role === 'Admin') && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 font-bold text-xs shadow-2xs backdrop-blur-xs">
                        <ShieldCheck className="w-3 h-3 text-indigo-300" />
                        <span>{currentUser.role === 'Admin' ? 'Admin Portal' : 'Owner Portal'}</span>
                      </span>
                    )}
                  </div>

                  {/* User Profile Chip with Quick Access Dropdown (Dashboard is accessed here) */}
                  <div className="relative shrink-0" ref={userMenuRef}>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-sky-300/30 text-white transition-all cursor-pointer shadow-xs active:scale-95"
                      title="User Account Menu"
                    >
                      <img
                        src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                        alt={currentUser.name}
                        className="w-7 h-7 rounded-lg object-cover border border-sky-300/40"
                      />
                      <span className="hidden sm:inline font-bold text-xs max-w-[110px] truncate text-slate-100">
                        {(currentUser.name || resolveUserDisplayName(null, currentUser.email)).split(' ')[0]}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-sky-200" />
                    </button>

                    {/* Quick Access Menu with Direct Link to Dedicated Full Dashboard */}
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                        <div className="p-2.5 border-b border-slate-100">
                          <div className="font-extrabold text-xs text-slate-900 line-clamp-1">
                            {currentUser.name || resolveUserDisplayName(null, currentUser.email)}
                          </div>
                          <div className="text-[11px] text-slate-600 font-medium line-clamp-1 break-all">
                            {currentUser.email}
                          </div>
                          {sanitizeUserPhone(currentUser.phone) && (
                            <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                              {sanitizeUserPhone(currentUser.phone)}
                            </div>
                          )}
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            currentUser.role === 'Admin'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            Verified {currentUser.role}
                          </span>
                        </div>

                        <div className="py-1">
                          {currentUser.role === 'Admin' && (
                            <button
                              onClick={() => {
                                navigateTo('admin-panel');
                                setUserDropdownOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black bg-amber-50 text-amber-900 hover:bg-amber-100 cursor-pointer mb-1 border border-amber-200"
                            >
                              <span className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-amber-700" />
                                <span>Admin Control Panel</span>
                              </span>
                              <span className="text-[10px] uppercase font-black px-1.5 py-0.5 bg-amber-500 text-slate-950 rounded">
                                Admin
                              </span>
                            </button>
                          )}

                          {/* Dedicated Dashboard Link */}
                          <button
                            onClick={() => {
                              navigateTo('dashboard');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-extrabold bg-blue-50 text-blue-900 hover:bg-blue-100 cursor-pointer mb-1 border border-blue-200/60"
                          >
                            <span className="flex items-center gap-2">
                              <LayoutDashboard className="w-4 h-4 text-blue-700" />
                              <span>Open Your Dashboard</span>
                            </span>
                            <span className="text-[10px] uppercase font-black px-1.5 py-0.5 bg-blue-600 text-white rounded">
                              Open
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              navigateTo('shortlist');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 text-slate-700 cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-rose-500" />
                              Saved Shortlist
                            </span>
                            {shortlistCount > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
                                {shortlistCount}
                              </span>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              navigateTo('post-property');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 text-slate-700 cursor-pointer"
                          >
                            <PlusCircle className="w-4 h-4 text-blue-600" />
                            Post Property FREE
                          </button>
                        </div>

                        <div className="pt-1 border-t border-slate-100">
                          <button
                            onClick={() => {
                              onLogout();
                              setUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* EXECUTIVE MENU BUTTON (Always clearly visible on Mobile & Desktop) */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-sky-300/40 text-white font-bold text-xs shadow-xs transition-all cursor-pointer focus:outline-none shrink-0"
                title="Open Main Menu"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="font-bold text-xs text-white">Menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Executive Slide-in Navigation Drawer */}
      <MenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentUser={currentUser}
        onOpenLogin={onOpenLogin}
        onLogout={onLogout}
        activeView={activeView}
        setActiveView={setActiveView}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        shortlistCount={shortlistCount}
        selectedCity={selectedCity}
        onSelectCity={onSelectCity}
      />
    </>
  );
};

