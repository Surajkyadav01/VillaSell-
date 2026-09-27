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
  ChevronDown
} from 'lucide-react';
import { BRAND_CONFIG, CITIES } from '../data/mockProperties';
import { ActiveView, PropertyCategory, UserProfile } from '../types/property';
import { CustomDropdown } from './CustomDropdown';
import { CityMegaDropdown } from './CityMegaDropdown';
import { MenuDrawer } from './MenuDrawer';
import { ServicesDropdown } from './ServicesDropdown';

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
  onLogout: () => void;
  menuDrawerOpen?: boolean;
  setMenuDrawerOpen?: (open: boolean) => void;
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
  onLogout,
  menuDrawerOpen,
  setMenuDrawerOpen,
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
    setActiveView(view);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#1b4a80] via-[#255e9c] to-[#2b568d] border-b border-sky-300/35 shadow-md backdrop-blur-md">
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between h-18">
            {/* Left: Custom Luxury Real Estate Logo & City Selector in corner */}
            <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 shrink-0">
              {/* Logo */}
              <button
                onClick={() => navigateTo('home')}
                className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer focus:outline-none shrink-0"
                title="VillaSell Home"
              >
                {/* Luxury Architectural Villa Emblem */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-800 to-slate-900 border border-blue-300/35 flex items-center justify-center shadow-lg shadow-slate-900/60 group-hover:scale-105 group-hover:border-amber-400/50 transition-all shrink-0">
                  <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                    Villa<span className="text-amber-400">Sell</span>
                  </span>
                  <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[9px] uppercase font-black tracking-wider rounded bg-emerald-500 text-slate-950 shadow-xs">
                    Verified
                  </span>
                </div>
              </button>

              {/* All Cities Selector (Housing.com style: mega cities popup with search & landmark grid) */}
              <div className="w-auto shrink-0 mr-1 sm:mr-4 lg:mr-8 xl:mr-10">
                <CityMegaDropdown
                  selectedCity={selectedCity}
                  onSelectCity={(city) => {
                    onSelectCity(city);
                    if (activeView !== 'home') setActiveView('home');
                  }}
                />
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 font-bold text-sm ml-2 xl:ml-4">
              <button
                onClick={() => handleCategoryClick('buy')}
                className={`px-2.5 xl:px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeView === 'home' && selectedCategory === 'buy'
                    ? 'text-white bg-blue-500/80 shadow-inner border border-blue-300/40'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Buy
              </button>

              <button
                onClick={() => handleCategoryClick('rent')}
                className={`px-2.5 xl:px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeView === 'home' && selectedCategory === 'rent'
                    ? 'text-white bg-blue-500/80 shadow-inner border border-blue-300/40'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Rent
              </button>

              <button
                onClick={() => handleCategoryClick('commercial')}
                className={`px-2.5 xl:px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeView === 'home' && selectedCategory === 'commercial'
                    ? 'text-white bg-blue-500/80 shadow-inner border border-blue-300/40'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Commercial
              </button>

              <button
                onClick={() => handleCategoryClick('plots')}
                className={`px-2.5 xl:px-3 py-2 rounded-xl transition-all cursor-pointer ${
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

              <div className="w-px h-5 bg-sky-300/30 mx-1" />

              <button
                onClick={() => navigateTo('contact')}
                className={`px-2.5 xl:px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeView === 'contact'
                    ? 'text-white bg-blue-500/80 shadow-inner border border-blue-300/40'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Shortlist Heart Button */}
              <button
                onClick={() => navigateTo('shortlist')}
                className={`relative p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
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
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-950/40 hover:shadow-lg transition-all cursor-pointer transform active:scale-95 border border-sky-300/30 shrink-0"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>Post Property</span>
                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded-full bg-emerald-400 text-slate-950 tracking-wider">
                  FREE
                </span>
              </button>

              {/* LOGIN / USER ACCOUNT FEATURE */}
              {!currentUser ? (
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-sky-300/30 hover:border-amber-400/60 shadow-xs transition-all cursor-pointer shrink-0"
                  title="Login or Sign Up"
                >
                  <User className="w-4 h-4 text-amber-300" />
                  <span>Login</span>
                </button>
              ) : (
                <div className="relative shrink-0" ref={userMenuRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900/70 hover:bg-blue-900 border border-blue-400/40 text-white transition-all cursor-pointer"
                    title="User Account Menu"
                  >
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-lg object-cover border border-amber-400/50"
                    />
                    <span className="hidden md:inline-block font-extrabold text-xs max-w-[85px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
                  </button>

                  {/* User Profile Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="p-2.5 border-b border-slate-100">
                        <div className="font-extrabold text-xs text-slate-900 line-clamp-1">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{currentUser.phone || currentUser.email}</div>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800">
                          Verified {currentUser.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            navigateTo('shortlist');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold hover:bg-blue-50 text-slate-700 cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-blue-600" />
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
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold hover:bg-blue-50 text-slate-700 cursor-pointer"
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
              )}

              {/* EXECUTIVE MENU BUTTON */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 hover:border-blue-300 transition-all cursor-pointer focus:outline-none shrink-0"
                title="Open Main Menu"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 text-white" />
                <span className="font-bold text-xs">Menu</span>
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

