import React, { useState } from 'react';
import { Search, MapPin, Home, IndianRupee, CheckCircle2, ShieldCheck, Zap, Sparkles, ChevronRight } from 'lucide-react';
import { PropertyCategory, SearchFilterState } from '../types/property';
import { CITIES } from '../data/cities';
import { CustomDropdown } from './CustomDropdown';
import { getAssetUrl } from '../utils/assetHelper';

interface HeroSearchProps {
  filters: SearchFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  totalMatches: number;
  onSearchClick: () => void;
  onPostPropertyClick?: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filters,
  setFilters,
  totalMatches,
  onSearchClick,
  onPostPropertyClick,
}) => {
  const [hasInteracted, setHasInteracted] = useState(false);

  // If user changed any filter from initial default
  const isCustomFilter =
    filters.category !== 'all' ||
    filters.city !== 'All Cities' ||
    filters.keyword.trim() !== '' ||
    filters.bhk !== 'all' ||
    filters.budgetRange !== 'all' ||
    Boolean(filters.propertyType && filters.propertyType !== 'all');

  const showFoundBadge = hasInteracted || isCustomFilter;

  const categories: { key: PropertyCategory | 'all'; label: string; badge?: string }[] = [
    { key: 'all', label: 'ALL' },
    { key: 'buy', label: 'BUY' },
    { key: 'rent', label: 'RENT' },
    { key: 'commercial', label: 'COMMERCIAL' },
    { key: 'plots', label: 'PLOTS', badge: 'Hot' },
  ];

  const bhkOptions = [
    { value: 'all', label: 'All BHK' },
    { value: '1', label: '1 BHK' },
    { value: '2', label: '2 BHK' },
    { value: '3', label: '3 BHK' },
    { value: '4+', label: '4+ BHK / Villa' },
  ];

  const budgetOptions = [
    { value: 'all', label: 'All Budgets' },
    { value: 'under-50l', label: 'Under ₹50L' },
    { value: '50l-1cr', label: '₹50L - ₹1Cr' },
    { value: '1cr-3cr', label: '₹1Cr - ₹3Cr' },
    { value: 'above-3cr', label: 'Above ₹3Cr' },
  ];

  const popularKeywords = [
    'Mumbai',
    'Civil Lines',
    'Gomti Nagar',
    'Sector 128 Noida',
    'Cyber City',
    'Sarjapur Road',
    'Worli',
    'Koregaon Park'
  ];

  return (
    <div 
      className="relative pt-8 sm:pt-12 pb-14 sm:pb-18 px-3 sm:px-6 lg:px-8 overflow-hidden min-h-[520px] sm:min-h-[560px] lg:min-h-[600px] flex flex-col justify-center border-b border-slate-200"
    >
      {/* High-Performance LCP Hero Background Image (Smooth Sky/Slate Backdrop to Eliminate Black Flash) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none -z-0 overflow-hidden bg-gradient-to-b from-sky-100/90 via-slate-100 to-slate-200">
        <picture className="w-full h-full block">
          {/* Mobile High-Speed WebP (41KB vs 146KB/1.9MB for instant mobile load) */}
          <source
            media="(max-width: 640px)"
            srcSet={getAssetUrl('images/villasellhomepage_mobile.webp')}
            type="image/webp"
          />
          {/* Desktop High-Resolution WebP */}
          <source
            media="(min-width: 641px)"
            srcSet={getAssetUrl('images/villasellhomepage.webp')}
            type="image/webp"
          />
          <img
            src={getAssetUrl('images/villasellhomepage.webp')}
            alt="VillaSell Luxury Villas & Modern City Properties"
            width="1981"
            height="793"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
        </picture>
      </div>

      {/* FOREGROUND MAIN CONTENT */}
      <div className="relative max-w-5xl mx-auto w-full z-10">
        
        {/* Main Tagline & Verification Badge (Kept unchanged) */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-blue-200/90 text-blue-900 text-xs font-bold mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Welcome to VillaSell Real Estate Hub</span>
            <span className="bg-emerald-600 text-white font-black text-[10px] px-1.5 py-0.2 rounded-full uppercase tracking-wider">
              100% Verified
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-slate-950 mb-2.5 leading-tight [text-shadow:_0_1px_4px_rgba(255,255,255,0.9)]">
            <span className="text-blue-700 [text-shadow:_0_1px_3px_rgba(255,255,255,0.9)]">Villa</span><span className="text-amber-500 [text-shadow:_0_1px_3px_rgba(255,255,255,0.9)]">Sell</span>{' '}
            Find Your Dream Villa, Apartment & Commercial Property
          </h1>
          <p className="text-slate-800 text-xs sm:text-base font-medium max-w-2xl mx-auto leading-relaxed px-2 [text-shadow:_0_1px_3px_rgba(255,255,255,0.8)]">
            India's premier zero-brokerage property marketplace offering verified luxury villas, modern apartments, and premium commercial spaces with end-to-end legal assistance.
          </p>
        </div>

        {/* Unified Search Card */}
        <div className="max-w-4xl mx-auto">
          {/* Top Dark Tab Pill (Mobile Horizontal Scrollable) */}
          <div className="overflow-x-auto max-w-full pb-0.5 no-scrollbar">
            <div className="inline-flex items-center bg-slate-900/90 backdrop-blur-md p-1 sm:p-1.5 rounded-t-xl sm:rounded-t-2xl border-t border-x border-slate-700/60 shadow-lg min-w-max">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setHasInteracted(true);
                    setFilters((prev) => ({ ...prev, category: cat.key }));
                  }}
                  className={`relative px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    filters.category === cat.key
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-950/40 border border-blue-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-tight ${
                      filters.category === cat.key ? 'bg-amber-400 text-slate-950' : 'bg-amber-400/30 text-amber-300'
                    }`}>
                      {cat.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Unified White Search Box with Depth */}
          <div className="bg-white/95 backdrop-blur-md rounded-b-2xl sm:rounded-b-3xl rounded-tr-xl sm:rounded-tr-2xl shadow-xl p-3 sm:p-5 text-slate-900 border border-white/90">
            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center">
              {/* City Selector */}
              <div className="md:col-span-3 bg-slate-50 hover:bg-slate-100/90 rounded-xl p-2.5 border border-slate-200 transition-colors">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>City</span>
                </label>
                <CustomDropdown
                  value={filters.city}
                  onChange={(val) => {
                    setHasInteracted(true);
                    setFilters((prev) => ({ ...prev, city: val }));
                  }}
                  options={CITIES}
                  placeholder="Select City"
                  size="sm"
                  buttonClassName="px-0 py-0.5 text-slate-900 font-bold"
                />
              </div>

              {/* Keyword / Locality Search */}
              <div className="md:col-span-4 bg-slate-50 hover:bg-slate-100/90 rounded-xl p-2.5 border border-slate-200 transition-colors">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Search className="w-3.5 h-3.5 text-blue-600" />
                  <span>Locality or Project</span>
                </label>
                <input
                  type="text"
                  placeholder="Search for locality, landmark, project..."
                  value={filters.keyword}
                  onChange={(e) => {
                    setHasInteracted(true);
                    setFilters((prev) => ({ ...prev, keyword: e.target.value }));
                  }}
                  className="w-full bg-transparent font-semibold text-slate-900 text-sm focus:outline-none placeholder:text-slate-400 py-0.5"
                />
              </div>

              {/* BHK Selector */}
              <div className="md:col-span-2 bg-slate-50 hover:bg-slate-100/90 rounded-xl p-2.5 border border-slate-200 transition-colors">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-blue-600" />
                  <span>Bedrooms</span>
                </label>
                <CustomDropdown
                  value={filters.bhk}
                  onChange={(val) => {
                    setHasInteracted(true);
                    setFilters((prev) => ({ ...prev, bhk: val }));
                  }}
                  options={bhkOptions}
                  placeholder="Select BHK"
                  size="sm"
                  buttonClassName="px-0 py-0.5 text-slate-900 font-bold"
                />
              </div>

              {/* Budget Selector */}
              <div className="md:col-span-3 bg-slate-50 hover:bg-slate-100/90 rounded-xl p-2.5 border border-slate-200 transition-colors">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                  <span>Budget</span>
                </label>
                <CustomDropdown
                  value={filters.budgetRange}
                  onChange={(val) => {
                    setHasInteracted(true);
                    setFilters((prev) => ({ ...prev, budgetRange: val }));
                  }}
                  options={budgetOptions}
                  placeholder="Select Budget"
                  size="sm"
                  buttonClassName="px-0 py-0.5 text-slate-900 font-bold"
                />
              </div>
            </div>

            {/* Bottom Row: Trending Localities & Blue Search Button */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto sm:flex-wrap text-xs text-slate-500 max-w-full no-scrollbar py-0.5">
                <span className="font-bold text-slate-700 shrink-0">Trending:</span>
                {popularKeywords.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setHasInteracted(true);
                      if (loc === 'Mumbai') {
                        setFilters((prev) => ({ ...prev, city: 'Mumbai', keyword: '' }));
                      } else {
                        setFilters((prev) => ({ ...prev, keyword: loc }));
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition-colors text-[11px] font-medium cursor-pointer shrink-0 whitespace-nowrap active:scale-95"
                  >
                    {loc}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setHasInteracted(true);
                  onSearchClick();
                }}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-900/25 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-95 shrink-0"
              >
                <Search className="w-4 h-4 text-emerald-300" />
                <span>Search</span>
                {showFoundBadge && (
                  <span className="bg-blue-900/80 text-blue-100 text-xs px-2 py-0.5 rounded-full font-bold ml-1 animate-in fade-in duration-200">
                    {totalMatches} Found
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Signature "Are you a Property Owner? Sell / Rent for FREE >" Banner */}
          <div className="mt-4 flex justify-center">
            {onPostPropertyClick ? (
              <button
                onClick={onPostPropertyClick}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-blue-950 border border-slate-300/80 text-xs font-semibold shadow-xs transition-all cursor-pointer group"
              >
                <span>Are you a Property Owner?</span>
                <span className="text-blue-600 font-extrabold flex items-center gap-0.5 group-hover:underline">
                  Sell / Rent for FREE
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-slate-700 border border-slate-300/80 text-xs font-semibold shadow-xs">
                <span>Are you a Property Owner?</span>
                <span className="text-blue-600 font-extrabold">Sell / Rent for FREE &gt;</span>
              </div>
            )}
          </div>
        </div>

        {/* Value Propositions / Trust Strip (Translucent floating cards over the city skyline) */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-800 text-xs max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">100% RERA Verified</p>
              <p className="text-slate-500 text-[11px]">Strict legal compliance</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Zero Brokerage</p>
              <p className="text-slate-500 text-[11px]">Direct seller connections</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">WhatsApp Connect</p>
              <p className="text-slate-500 text-[11px]">Chat with verified owners</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Free Property Listing</p>
              <p className="text-slate-500 text-[11px]">Sell or rent in 4 easy steps</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
