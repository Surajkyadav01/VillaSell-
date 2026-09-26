import React from 'react';
import { Search, MapPin, Home, IndianRupee, CheckCircle2, ShieldCheck, Zap, Sparkles, ChevronRight } from 'lucide-react';
import { PropertyCategory, SearchFilterState } from '../types/property';
import { CITIES } from '../data/mockProperties';
import { CustomDropdown } from './CustomDropdown';

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
    'Sarjapur Road',
    'Worli Sea Face',
    'Golf Course Extension',
    'Shivpur',
    'Koregaon Park',
    'Gomti Nagar',
    'BKC'
  ];

  return (
    <div className="relative bg-gradient-to-r from-[#3e1470] via-[#5b2497] to-[#511e89] text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[580px] flex flex-col justify-center">
      {/* ----------------- HOUSING.COM STYLE BACKGROUND GRAPHICS ----------------- */}

      {/* 1. Atmospheric Gradient & Depth Lighting */}
      <div className="absolute inset-0 bg-radial from-purple-400/20 via-transparent to-black/30 pointer-events-none" />
      <div className="absolute -top-32 -left-20 w-[600px] h-[600px] bg-purple-500/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* 2. Floating Vector Clouds */}
      <div className="absolute top-6 left-12 opacity-35 pointer-events-none hidden md:block">
        <svg width="220" height="70" viewBox="0 0 220 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 50C25 50 15 40 15 28C15 17 25 10 36 10C42 4 52 0 63 0C80 0 94 10 99 24C104 20 111 18 118 18C132 18 143 28 144 41C149 39 155 38 160 38C174 38 185 49 185 62C185 64 184 66 183 68H40C39.5 62 40 55 40 50Z" fill="white" fillOpacity="0.18" />
        </svg>
      </div>

      <div className="absolute top-14 left-1/3 opacity-25 pointer-events-none hidden lg:block">
        <svg width="180" height="55" viewBox="0 0 180 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 40C18 40 10 32 10 22C10 13 18 8 27 8C32 3 40 0 49 0C62 0 74 8 78 19C82 16 88 14 94 14C105 14 114 22 115 32C119 30 124 29 128 29C139 29 148 38 148 48H30Z" fill="white" fillOpacity="0.15" />
        </svg>
      </div>

      {/* 3. Flying Birds Silhouettes */}
      <div className="absolute top-16 left-1/4 opacity-40 pointer-events-none hidden sm:block">
        <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 15 Q 18 8 26 15 Q 34 8 42 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M48 24 Q 54 18 60 24 Q 66 18 72 24" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M80 12 Q 86 6 92 12 Q 98 6 104 12" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* 4. Housing.com Exact City Skyline (Multi-layered Towers with Soft Blurred Back Towers & Crisp Glowing Foreground Architecture) */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Deep background soft blur towers */}
        <div className="absolute bottom-0 left-0 w-full max-w-[750px] h-[480px]">
          <svg width="100%" height="100%" viewBox="0 0 750 480" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMax meet">
            <defs>
              {/* Deep background tower gradients */}
              <linearGradient id="blurTowerGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#3b0764" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="blurTowerGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#2e1065" stopOpacity="0.1" />
              </linearGradient>

              {/* Mid & Foreground glowing gradients */}
              <linearGradient id="glowTowerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#7e22ce" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b0764" stopOpacity="0.05" />
              </linearGradient>

              <filter id="softTowerBlur" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3.5" />
              </filter>
            </defs>

            {/* LAYER 1: Deep Blurred Background Towers (Just like Housing.com screenshot) */}
            <g filter="url(#softTowerBlur)" opacity="0.85">
              {/* Massive Center-Left Highrise */}
              <rect x="360" y="80" width="160" height="400" rx="6" fill="url(#blurTowerGrad2)" />
              {/* Left Mid Background Tower */}
              <rect x="80" y="160" width="110" height="320" rx="4" fill="url(#blurTowerGrad1)" />
              {/* Center Tower Behind Search */}
              <rect x="220" y="190" width="130" height="290" rx="4" fill="url(#blurTowerGrad1)" />
              {/* Far Right Tower */}
              <rect x="540" y="140" width="140" height="340" rx="6" fill="url(#blurTowerGrad2)" />
            </g>

            {/* LAYER 2: Mid-ground Towers with Glass Panels & Subtle Windows */}
            <g opacity="0.9">
              {/* Tall Tower with stepped crown */}
              <rect x="375" y="110" width="125" height="370" rx="4" fill="url(#glowTowerGrad)" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
              <line x1="390" y1="130" x2="485" y2="130" stroke="rgba(255,255,255,0.3)" strokeDasharray="3 4" />
              <line x1="390" y1="155" x2="485" y2="155" stroke="rgba(255,255,255,0.3)" strokeDasharray="3 4" />
              <line x1="390" y1="180" x2="485" y2="180" stroke="rgba(255,255,255,0.3)" strokeDasharray="3 4" />
              <line x1="390" y1="205" x2="485" y2="205" stroke="rgba(255,255,255,0.3)" strokeDasharray="3 4" />
              <line x1="390" y1="230" x2="485" y2="230" stroke="rgba(255,255,255,0.3)" strokeDasharray="3 4" />

              {/* Tower 2 Behind Left Search */}
              <rect x="235" y="220" width="95" height="260" rx="3" fill="url(#glowTowerGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1="245" y1="240" x2="320" y2="240" stroke="rgba(255,255,255,0.25)" strokeDasharray="2 3" />
              <line x1="245" y1="265" x2="320" y2="265" stroke="rgba(255,255,255,0.25)" strokeDasharray="2 3" />
              <line x1="245" y1="290" x2="320" y2="290" stroke="rgba(255,255,255,0.25)" strokeDasharray="2 3" />
            </g>

            {/* LAYER 3: Prominent Foreground Skyscrapers with Sharp White Architectural Outlines (As in Screenshot) */}
            {/* Main Far-Left Tall Skyscraper (100% visible on left edge of screen) */}
            <g>
              <rect x="0" y="95" width="68" height="385" rx="3" fill="url(#glowTowerGrad)" stroke="rgba(255,255,255,0.65)" strokeWidth="1.6" />
              {/* Horizontal Floor Louvers */}
              {[...Array(24)].map((_, i) => (
                <line 
                  key={`l1-${i}`}
                  x1="8" 
                  y1={115 + i * 14} 
                  x2="60" 
                  y2={115 + i * 14} 
                  stroke={i % 3 === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)"} 
                  strokeWidth={i % 3 === 0 ? "1.4" : "1"} 
                />
              ))}
            </g>

            {/* Second Skyscraper (Left Center) */}
            <g>
              <rect x="115" y="165" width="95" height="315" rx="3" fill="url(#glowTowerGrad)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
              {/* Vertical Structural Columns */}
              <line x1="140" y1="165" x2="140" y2="480" stroke="rgba(255,255,255,0.35)" strokeDasharray="4 2" />
              <line x1="165" y1="165" x2="165" y2="480" stroke="rgba(255,255,255,0.4)" />
              <line x1="190" y1="165" x2="190" y2="480" stroke="rgba(255,255,255,0.35)" strokeDasharray="4 2" />
              {/* Floor division slats */}
              {[...Array(18)].map((_, i) => (
                <line 
                  key={`l2-${i}`}
                  x1="125" 
                  y1={185 + i * 15} 
                  x2="200" 
                  y2={185 + i * 15} 
                  stroke="rgba(255,255,255,0.4)" 
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              ))}
            </g>

            {/* Third Skyscraper (Foreground Center-Left) */}
            <g>
              <rect x="245" y="245" width="85" height="235" rx="3" fill="url(#glowTowerGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
              {/* Windows grid lines */}
              {[...Array(14)].map((_, i) => (
                <line 
                  key={`l3-${i}`}
                  x1="255" 
                  y1={260 + i * 14} 
                  x2="320" 
                  y2={260 + i * 14} 
                  stroke="rgba(255,255,255,0.45)" 
                  strokeWidth="1.2"
                />
              ))}
            </g>

            {/* Fourth Tower (Mid Foreground Low Rise) */}
            <g>
              <rect x="80" y="380" width="50" height="100" rx="2" fill="url(#glowTowerGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
              <rect x="18" y="360" width="45" height="120" rx="2" fill="url(#glowTowerGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
            </g>
          </svg>
        </div>

        {/* Real city architectural texture blend to give authentic photographic depth */}
        <div className="absolute inset-0 opacity-15 mix-blend-screen pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
            alt="City architecture silhouette"
            className="w-full h-full object-cover object-bottom filter blur-[1px]"
          />
        </div>

        {/* Bottom smooth dark gradient so search bar and content have maximum contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3e1470]/90 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 5. Right Side Floating 3D Angled Portal Frame (Signature Luxury Real Estate Villa & Architecture Asset) */}
      <div className="absolute right-[-40px] sm:right-[-20px] lg:right-6 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block z-10 select-none">
        <div 
          className="relative w-[340px] xl:w-[410px] h-[450px] xl:h-[510px] transition-transform duration-700 ease-out"
          style={{ perspective: '1000px' }}
        >
          {/* Outer floating decorative glowing outline frame */}
          <div 
            className="absolute inset-0 rounded-[2.5rem] border-2 border-white/35 shadow-[0_0_50px_rgba(168,85,247,0.35)] -rotate-3 scale-[1.03]"
            style={{
              transform: 'rotateY(-15deg) rotateX(4deg) translateZ(-10px)',
              borderColor: 'rgba(255, 255, 255, 0.4)',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.6), 0 0 35px rgba(192, 132, 252, 0.4)'
            }}
          />

          {/* Main 3D Angled Window Card showcasing Stunning Luxury Real Estate Villa */}
          <div 
            className="w-full h-full rounded-[2.2rem] overflow-hidden border-[3px] border-white/70 shadow-2xl relative bg-slate-900 group"
            style={{
              transform: 'rotateY(-14deg) rotateX(3deg)',
              boxShadow: '0 30px 70px -20px rgba(15, 23, 42, 0.8), 0 0 45px rgba(255, 255, 255, 0.3)'
            }}
          >
            {/* Ultra-luxury Contemporary Architecture Villa with Pool & Evening Warm Lighting */}
            <img 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" 
              alt="Luxury Modern Real Estate Villa"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-110 transition-transform duration-700"
            />

            {/* Subtle soft sunlight and purple gradient wash for high-end polish */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-white/10" />

            {/* Floating verification badge inside card corner */}
            <div className="absolute bottom-5 left-5 right-5 bg-slate-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-white flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Verified Luxury Villas</p>
                  <p className="text-[10px] text-emerald-300 font-medium">Direct Owner & Developer Deals</p>
                </div>
              </div>
              <span className="text-[11px] font-extrabold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                0% Brokerage
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- FOREGROUND MAIN CONTENT ----------------- */}
      <div className="relative max-w-6xl mx-auto w-full z-20">
        
        {/* Main Tagline & Verification Numbers (VillaSell Brand Identity) */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Welcome to VillaSell Real Estate Hub</span>
            <span className="bg-emerald-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full uppercase tracking-wider">
              100% Verified
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight drop-shadow-sm">
            Find Your Dream Villa, Apartment & Commercial Property
          </h1>
          <p className="text-purple-100/95 text-sm sm:text-base font-normal max-w-2xl mx-auto leading-relaxed">
            India's premier zero-brokerage property marketplace offering verified luxury villas, modern apartments, and premium commercial spaces with end-to-end legal assistance.
          </p>
        </div>

        {/* Housing.com Unified Search Card */}
        <div className="max-w-4xl mx-auto">
          {/* Top Dark Tab Pill (Housing.com signature style) */}
          <div className="inline-flex items-center bg-slate-950/80 backdrop-blur-md p-1.5 rounded-t-2xl sm:rounded-t-3xl border-t border-x border-white/20 shadow-lg">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilters((prev) => ({ ...prev, category: cat.key }))}
                className={`relative px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-black tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  filters.category === cat.key
                    ? 'bg-purple-700 text-white shadow-md shadow-purple-900/40 border border-purple-500/30'
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

          {/* Unified White Search Box with Depth */}
          <div className="bg-white rounded-b-2xl sm:rounded-b-3xl rounded-tr-2xl sm:rounded-tr-3xl shadow-2xl p-3 sm:p-5 text-slate-900 border border-white/90">
            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center">
              {/* City Selector */}
              <div className="md:col-span-3 bg-slate-50 hover:bg-slate-100/90 rounded-xl p-2.5 border border-slate-200 transition-colors">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-700" />
                  <span>City</span>
                </label>
                <CustomDropdown
                  value={filters.city}
                  onChange={(val) => setFilters((prev) => ({ ...prev, city: val }))}
                  options={CITIES}
                  placeholder="Select City"
                  size="sm"
                  buttonClassName="px-0 py-0.5 text-slate-900 font-bold"
                />
              </div>

              {/* Keyword / Locality Search */}
              <div className="md:col-span-4 bg-slate-50 hover:bg-slate-100/90 rounded-xl p-2.5 border border-slate-200 transition-colors">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Search className="w-3.5 h-3.5 text-purple-700" />
                  <span>Locality or Project</span>
                </label>
                <input
                  type="text"
                  placeholder="Search for locality, landmark, project..."
                  value={filters.keyword}
                  onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
                  className="w-full bg-transparent font-semibold text-slate-900 text-sm focus:outline-none placeholder:text-slate-400 py-0.5"
                />
              </div>

              {/* BHK Selector */}
              <div className="md:col-span-2 bg-slate-50 hover:bg-slate-100/90 rounded-xl p-2.5 border border-slate-200 transition-colors">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-purple-700" />
                  <span>Bedrooms</span>
                </label>
                <CustomDropdown
                  value={filters.bhk}
                  onChange={(val) => setFilters((prev) => ({ ...prev, bhk: val }))}
                  options={bhkOptions}
                  placeholder="Select BHK"
                  size="sm"
                  buttonClassName="px-0 py-0.5 text-slate-900 font-bold"
                />
              </div>

              {/* Budget Selector */}
              <div className="md:col-span-3 bg-slate-50 hover:bg-slate-100/90 rounded-xl p-2.5 border border-slate-200 transition-colors">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-purple-700" />
                  <span>Budget</span>
                </label>
                <CustomDropdown
                  value={filters.budgetRange}
                  onChange={(val) => setFilters((prev) => ({ ...prev, budgetRange: val }))}
                  options={budgetOptions}
                  placeholder="Select Budget"
                  size="sm"
                  buttonClassName="px-0 py-0.5 text-slate-900 font-bold"
                />
              </div>
            </div>

            {/* Bottom Row: Trending Localities & Housing.com Purple Search Button */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500">
                <span className="font-bold text-slate-700">Trending:</span>
                {popularKeywords.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, keyword: loc }))}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-800 text-slate-600 transition-colors text-[11px] font-medium cursor-pointer"
                  >
                    {loc}
                  </button>
                ))}
              </div>

              <button
                onClick={onSearchClick}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-95 shrink-0"
              >
                <Search className="w-4 h-4 text-emerald-300" />
                <span>Search</span>
                <span className="bg-purple-900/80 text-purple-200 text-xs px-2 py-0.5 rounded-full font-bold ml-1">
                  {totalMatches} Found
                </span>
              </button>
            </div>
          </div>

          {/* Housing.com Signature "Are you a Property Owner? Sell / Rent for FREE >" Banner */}
          <div className="mt-4 flex justify-center">
            {onPostPropertyClick ? (
              <button
                onClick={onPostPropertyClick}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/80 hover:bg-slate-950 text-slate-200 hover:text-white border border-white/20 text-xs font-semibold backdrop-blur-md transition-all shadow-md cursor-pointer group"
              >
                <span>Are you a Property Owner?</span>
                <span className="text-emerald-400 font-extrabold flex items-center gap-0.5 group-hover:underline">
                  Sell / Rent for FREE
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/80 text-slate-200 border border-white/20 text-xs font-semibold backdrop-blur-md shadow-md">
                <span>Are you a Property Owner?</span>
                <span className="text-emerald-400 font-extrabold">Sell / Rent for FREE &gt;</span>
              </div>
            )}
          </div>
        </div>

        {/* Value Propositions / Trust Strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-200 text-xs max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">100% RERA Verified</p>
              <p className="text-purple-200/80 text-[11px]">Strict legal compliance</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
            <div className="w-7 h-7 rounded-lg bg-purple-400/20 text-purple-300 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Zero Brokerage</p>
              <p className="text-purple-200/80 text-[11px]">Direct seller connections</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">WhatsApp Connect</p>
              <p className="text-purple-200/80 text-[11px]">Chat with verified owners</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
            <div className="w-7 h-7 rounded-lg bg-indigo-400/20 text-indigo-300 flex items-center justify-center shrink-0">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Free Property Listing</p>
              <p className="text-purple-200/80 text-[11px]">Sell or rent in 4 easy steps</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
