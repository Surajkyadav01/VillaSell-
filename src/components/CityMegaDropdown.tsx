import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, ChevronRight, Check } from 'lucide-react';

interface CityItem {
  id: string;
  name: string;
  subtitle?: string;
  badge?: string;
  icon: React.ReactNode;
}

const POPULAR_CITIES: CityItem[] = [
  {
    id: 'mumbai',
    name: 'Mumbai',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-indigo-600" fill="currentColor">
        {/* Gateway of India Landmark */}
        <path d="M4 19h16v2H4v-2zm1-2h2V9h2v8h6V9h2v8h2V7l-7-3-7 3v10zm6-7h2v6h-2v-6zm-4 0h1v6H7v-6zm9 0h1v6h-1v-6z" />
      </svg>
    )
  },
  {
    id: 'bangalore',
    name: 'Bengaluru',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600" fill="currentColor">
        {/* Modern Silicon Tech High-Rise */}
        <path d="M5 21h14v-2H5v2zm2-4h10V4l-5-2-5 2v13zm2-10h2v2H9V7zm0 4h2v2H9v-2zm4-4h2v2h-2V7zm0 4h2v2h-2v-2z" />
      </svg>
    )
  },
  {
    id: 'pune',
    name: 'Pune',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-600" fill="currentColor">
        {/* Shaniwar Wada Historic Fort Gate */}
        <path d="M3 21h18v-2H3v2zm2-4h3v-4h8v4h3V7l-7-3-7 3v10zm5-3h4v3h-4v-3zm-1-6h2v2H9V8zm4 0h2v2h-2V8z" />
      </svg>
    )
  },
  {
    id: 'chennai',
    name: 'Chennai',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-orange-600" fill="currentColor">
        {/* Dravidian Temple Gopuram */}
        <path d="M12 2l-2 3h4l-2-3zm-3 4l-1 3h8l-1-3H9zm-2 4l-1 4h12l-1-4H7zm-2 5l-1 4h16l-1-4H5zm-1 5h16v2H4v-2zm7-3h2v2h-2v-2z" />
      </svg>
    )
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-teal-600" fill="currentColor">
        {/* Howrah Bridge Structure */}
        <path d="M2 19h20v2H2v-2zm2-2l2-10 6 6 6-6 2 10H4zm4-5.5L7 16h3l-2-4.5zm8 0L14 16h3l-1-4.5zM12 11l-2 5h4l-2-5z" />
      </svg>
    )
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-yellow-600" fill="currentColor">
        {/* Jhulta Minar / Heritage Landmark */}
        <path d="M6 21h12v-2H6v2zm2-4h2V8l-2 1v8zm6 0h2V8l-2 1v8zm-4 0h2V4l-2 1v12zm-3-9l2-2v-1l-2 1v2zm8 0l2-2v-1l-2 1v2z" />
      </svg>
    )
  },
  {
    id: 'delhi',
    name: 'Delhi',
    subtitle: 'Delhi NCR',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-rose-600" fill="currentColor">
        {/* India Gate War Memorial Arch */}
        <path d="M4 21h16v-2H4v2zm2-4h3V9h6v8h3V6l-6-2-6 2v11zm4-6h4v6h-4v-6zm-1-3h6v1H9V8z" />
      </svg>
    )
  },
  {
    id: 'noida',
    name: 'Noida',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-600" fill="currentColor">
        {/* Noida Expressway Twin Towers */}
        <path d="M4 21h16v-2H4v2zm2-4h4V5l-4 1v11zm6 0h6V3l-6 1v13zm-4-8h2v2H8V9zm0 4h2v2H8v-2zm6-6h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
      </svg>
    )
  },
  {
    id: 'gurgaon',
    name: 'Gurgaon',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-purple-600" fill="currentColor">
        {/* DLF Cyber Hub Skyscraper */}
        <path d="M6 21h12v-2H6v2zm1-4h10V4l-3-2H7v15zm2-11h2v2H9V6zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-8h2v2h-2V6zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
      </svg>
    )
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-600" fill="currentColor">
        {/* Charminar 4 Minarets */}
        <path d="M4 21h16v-2H4v2zm2-4h2V5H6v12zm10 0h2V5h-2v12zm-6 0h4v-5c0-1.1-.9-2-2-2s-2 .9-2 2v5zm-1-7h6V8h-6v2zm-2-6h2v1H7V4zm10 0h2v1h-2V4z" />
      </svg>
    )
  },
  {
    id: 'thane',
    name: 'Thane',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-600" fill="currentColor">
        {/* Thane Creek & Lake City */}
        <path d="M3 21h18v-2H3v2zm1-5h16c-1-4-4-7-8-7s-7 3-8 7zm8-5c2.5 0 4.8 1.8 5.7 4H6.3c.9-2.2 3.2-4 5.7-4zM12 2l-2 3h4l-2-3z" />
      </svg>
    )
  },
  {
    id: 'navimumbai',
    name: 'Navi Mumbai',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-indigo-500" fill="currentColor">
        {/* Palm Beach Modern Coastal Towers */}
        <path d="M3 21h18v-2H3v2zm3-4h3V8L6 9v8zm4 0h4V5l-4 1v11zm5 0h3v-6l-3 1v5zm-7-7h2v2h-2V10zm0 3h2v2h-2v-2zm-3 0h1v2H8v-2z" />
      </svg>
    )
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-500" fill="currentColor">
        {/* Kashi Temple Spire & Ghat */}
        <path d="M12 2L9 8h6l-3-6zm-4 7l-2 5h12l-2-5H8zm-3 6l-2 4h18l-2-4H5zm-2 5h18v2H3v-2zm8-4h2v2h-2v-2z" />
      </svg>
    )
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-purple-500" fill="currentColor">
        {/* Rumi Darwaza Royal Arch */}
        <path d="M4 21h16v-2H4v2zm2-4h2v-4c0-2.2 1.8-4 4-4s4 1.8 4 4v4h2V7l-6-3-6 3v10zm5-4c0-.6.4-1 1-1s1 .4 1 1v4h-2v-4z" />
      </svg>
    )
  }
];

interface CityMegaDropdownProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  className?: string;
}

export const CityMegaDropdown: React.FC<CityMegaDropdownProps> = ({
  selectedCity,
  onSelectCity,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto focus search input when opened
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (cityName: string) => {
    // Map internal names if needed
    if (cityName === 'Bengaluru') cityName = 'Bangalore';
    if (cityName === 'Delhi') cityName = 'Delhi NCR';

    onSelectCity(cityName);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Filtered popular cities based on search
  const filteredCities = POPULAR_CITIES.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
      c.id.toLowerCase().includes(q)
    );
  });

  // Display label for the trigger button
  const displayLabel = selectedCity || 'All Cities';

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Trigger Button - Housing.com style: pure clean text + chevron */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 text-white hover:text-purple-200 font-semibold text-sm hover:bg-white/10 rounded-lg transition-colors cursor-pointer select-none focus:outline-none"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span>{displayLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/90 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Housing.com Mega Cities Popover Modal */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed left-3 right-3 sm:left-0 sm:right-auto top-[70px] sm:absolute sm:top-full sm:mt-2.5 z-50 w-auto sm:w-[480px] bg-white rounded-2xl border border-slate-200/90 shadow-2xl shadow-purple-950/25 p-4 sm:p-5 text-slate-800 animate-in fade-in zoom-in-95 duration-150"
            style={{
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.18))'
            }}
          >
          {/* Search Input Bar */}
          <div className="relative mb-3.5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for city"
              className="w-full pl-10 pr-8 py-2 text-sm font-medium bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Section Subheader */}
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">
              Popular cities
            </span>
            {searchQuery && (
              <span className="text-[11px] text-purple-600 font-semibold">
                {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'} found
              </span>
            )}
          </div>

          {/* Grid of Cities (3 Columns like Housing.com) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[280px] overflow-y-auto pr-0.5 custom-scrollbar">
            {filteredCities.map((city) => {
              const isSelected =
                selectedCity.toLowerCase() === city.name.toLowerCase() ||
                (city.name === 'Bengaluru' && selectedCity.toLowerCase() === 'bangalore') ||
                (city.name === 'Delhi' && selectedCity.toLowerCase() === 'delhi ncr');

              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleSelect(city.name)}
                  className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer group ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/90 text-purple-700 font-bold ring-1 ring-purple-600 shadow-xs'
                      : 'border-slate-200/80 bg-white hover:border-purple-400 hover:bg-purple-50/40 hover:shadow-xs text-slate-700'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-100/90 group-hover:bg-white flex items-center justify-center shrink-0 border border-slate-200/50 transition-colors">
                    {city.icon}
                  </div>
                  <span
                    className={`text-xs truncate ${
                      isSelected ? 'font-bold text-purple-700' : 'font-semibold text-slate-800 group-hover:text-purple-700'
                    }`}
                  >
                    {city.name}
                  </span>
                </button>
              );
            })}

            {filteredCities.length === 0 && (
              <div className="col-span-3 py-6 text-center text-slate-400 text-xs">
                No cities found matching "{searchQuery}".
              </div>
            )}
          </div>

          {/* Footer Bar (Housing.com style) */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelect('All Cities')}
                className={`font-bold transition-colors cursor-pointer ${
                  selectedCity === 'All Cities'
                    ? 'text-purple-700 underline'
                    : 'text-slate-600 hover:text-purple-700'
                }`}
              >
                All India / All Cities
              </button>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400 font-normal">International</span>
            </div>

            <button
              type="button"
              onClick={() => handleSelect('All Cities')}
              className="text-purple-600 hover:text-purple-800 font-bold flex items-center gap-0.5 cursor-pointer transition-colors"
            >
              <span>View all cities</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
};
