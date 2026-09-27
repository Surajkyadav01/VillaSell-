import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  SlidersHorizontal, 
  RotateCcw, 
  Search,
  Sparkles,
  Home,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { Property } from '../types/property';
import { PropertyCard } from './PropertyCard';
import { PREFERRED_CITIES_LIST, ADDITIONAL_CITIES_LIST } from './FindPropertyPreferredCity';
import { CustomDropdown } from './CustomDropdown';

interface CityPropertiesViewProps {
  cityName: string;
  allProperties: Property[];
  onBack: () => void;
  onSelectProperty: (property: Property) => void;
  shortlistedIds: string[];
  onToggleShortlist: (propertyId: string) => void;
  onSwitchCity: (newCityName: string) => void;
}

export const CityPropertiesView: React.FC<CityPropertiesViewProps> = ({
  cityName,
  allProperties,
  onBack,
  onSelectProperty,
  shortlistedIds,
  onToggleShortlist,
  onSwitchCity,
}) => {
  // Local filters within this specific city view
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'buy' | 'rent' | 'commercial'>('all');
  const [selectedBhk, setSelectedBhk] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  // Find city info from preferred list
  const allKnownCities = [...PREFERRED_CITIES_LIST, ...ADDITIONAL_CITIES_LIST];
  const cityInfo = allKnownCities.find(
    (c) => c.name.toLowerCase() === cityName.toLowerCase() || c.filterValue.toLowerCase() === cityName.toLowerCase()
  );

  // Filter properties belonging to this city
  const cityProperties = useMemo(() => {
    const target = cityName.toLowerCase();

    return allProperties.filter((prop) => {
      const pCity = prop.city.toLowerCase();
      const pLoc = prop.locality.toLowerCase();
      const pAddr = prop.address.toLowerCase();

      if (target === 'prayagraj' || target === 'allahabad') {
        return pCity.includes('prayagraj') || pCity.includes('allahabad') || pLoc.includes('civil lines') || pLoc.includes('sangam') || pLoc.includes('ashok nagar');
      }
      if (target === 'lucknow') {
        return pCity.includes('lucknow') || pLoc.includes('gomti') || pLoc.includes('hazratganj') || pLoc.includes('aliganj');
      }
      if (target === 'varanasi' || target === 'kashi' || target === 'banaras') {
        return pCity.includes('varanasi') || pCity.includes('kashi') || pLoc.includes('sigra') || pLoc.includes('shivpur') || pLoc.includes('ghat');
      }
      if (target === 'delhi' || target.includes('delhi')) {
        return pCity.includes('delhi') || pCity.includes('ncr') || pLoc.includes('delhi') || pLoc.includes('gurugram') || pLoc.includes('noida');
      }
      if (target === 'gurgaon' || target === 'gurugram') {
        return pCity.includes('gurgaon') || pCity.includes('gurugram') || pLoc.includes('gurugram') || pAddr.includes('gurugram') || pAddr.includes('gurgaon');
      }
      if (target === 'noida') {
        return pCity.includes('noida') || pLoc.includes('noida') || pAddr.includes('noida');
      }
      if (target === 'bangalore' || target === 'bengaluru') {
        return pCity.includes('bangalore') || pCity.includes('bengaluru');
      }
      if (target === 'thane') {
        return pCity.includes('thane') || pLoc.includes('thane');
      }
      if (target === 'navi mumbai') {
        return pCity.includes('navi mumbai') || pLoc.includes('navi mumbai');
      }
      if (target === 'mumbai') {
        return pCity.includes('mumbai') || pLoc.includes('worli') || pLoc.includes('bandra') || pLoc.includes('juhu') || pLoc.includes('bkc');
      }

      return pCity.includes(target) || pLoc.includes(target) || pAddr.includes(target);
    });
  }, [allProperties, cityName]);

  // Apply secondary in-city filters
  const filteredCityProperties = useMemo(() => {
    let result = [...cityProperties];

    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedBhk !== 'all') {
      if (selectedBhk === '4+') {
        result = result.filter((p) => p.bedrooms >= 4);
      } else {
        result = result.filter((p) => p.bedrooms === parseInt(selectedBhk, 10));
      }
    }

    if (selectedType !== 'all') {
      result = result.filter((p) => p.propertyType === selectedType);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'featured') return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    return result;
  }, [cityProperties, searchKeyword, selectedCategory, selectedBhk, selectedType, sortBy]);

  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedCategory('all');
    setSelectedBhk('all');
    setSelectedType('all');
    setSortBy('featured');
  };

  const buyCount = cityProperties.filter((p) => p.category === 'buy').length;
  const rentCount = cityProperties.filter((p) => p.category === 'rent').length;
  const commCount = cityProperties.filter((p) => p.category === 'commercial').length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Top Breadcrumb & Back Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <button onClick={onBack} className="hover:text-slate-900 cursor-pointer flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-400">Cities</span>
            <span>/</span>
            <span className="text-blue-600 font-bold">{cityName}</span>
          </nav>
        </div>
      </div>

      {/* Hero City Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden py-10 sm:py-14">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            
            {/* City Circle Landmark Image */}
            {cityInfo?.imageUrl && (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden shrink-0 bg-slate-800">
                <img
                  src={cityInfo.imageUrl}
                  alt={cityName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* City Title & Metadata */}
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Prime Real Estate Hub</span>
                <span>•</span>
                <span className="text-white font-bold">{cityProperties.length} Properties in VillaSell</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                Properties in <span className="text-blue-300">{cityName}</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Explore all verified luxury villas, high-rise apartments, and prime rental residences in {cityName}. Direct from verified owners with zero brokerage.
              </p>

              {/* Guarantees badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-[11px] text-slate-300">
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  100% RERA Verified
                </span>
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  Zero Brokerage Option
                </span>
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Instant Owner Connect
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        
        {/* Search & Filter Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-lg mb-8">
          
          {/* Row 1: Search & Category tabs */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search locality or project in ${cityName}...`}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/60"
              />
              {searchKeyword && (
                <button
                  type="button"
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All ({cityProperties.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('buy')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'buy'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                For Sale ({buyCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('rent')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'rent'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Rent ({rentCount})
              </button>
              {commCount > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('commercial')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === 'commercial'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Commercial ({commCount})
                </button>
              )}
            </div>

          </div>

          {/* Row 2: Sub-filters (BHK, Type, Sort) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 flex-wrap">
            
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">BHK:</span>
              {['all', '2', '3', '4+'].map((bhk) => (
                <button
                  key={bhk}
                  type="button"
                  onClick={() => setSelectedBhk(bhk)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    selectedBhk === bhk
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {bhk === 'all' ? 'All BHK' : `${bhk} BHK`}
                </button>
              ))}

              {/* Property Type Dropdown */}
              <div className="w-40 sm:w-48">
                <CustomDropdown
                  value={selectedType}
                  onChange={(val) => setSelectedType(String(val))}
                  options={[
                    { value: 'all', label: 'All Property Types' },
                    { value: 'Villa', label: 'Villa' },
                    { value: 'Luxury Apartment', label: 'Luxury Apartment' },
                    { value: 'Apartment', label: 'Apartment' },
                    { value: 'Penthouse', label: 'Penthouse' },
                    { value: 'Commercial Office', label: 'Commercial Office' },
                  ]}
                  theme="subtle"
                  size="sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* Sort By Dropdown */}
              <div className="w-36 sm:w-44">
                <CustomDropdown
                  value={sortBy}
                  onChange={(val) => setSortBy(val as any)}
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

              {/* Reset Filter Button */}
              {(searchKeyword || selectedCategory !== 'all' || selectedBhk !== 'all' || selectedType !== 'all') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-1 hover:bg-rose-100 cursor-pointer shrink-0"
                  title="Reset filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Results Count Banner */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            {filteredCityProperties.length} Properties in {cityName}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Showing verified residential & commercial listings
          </span>
        </div>

        {/* Property Grid or Empty State */}
        {filteredCityProperties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs my-8">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <SlidersHorizontal className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Matching Properties Found</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              We couldn't find listings in {cityName} matching your active sub-filters. Try resetting filters to see all available properties in {cityName}.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-800 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
            >
              Show All {cityProperties.length} Properties in {cityName}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCityProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isShortlisted={shortlistedIds.includes(property.id)}
                onToggleShortlist={onToggleShortlist}
                onSelectProperty={onSelectProperty}
              />
            ))}
          </div>
        )}

        {/* Quick Switch to Other Cities */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="text-center mb-6">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              Explore Properties in Other Top Metros
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Switch easily to browse verified homes across India's leading cities
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {PREFERRED_CITIES_LIST.map((c) => {
              const isCurrent = c.name.toLowerCase() === cityName.toLowerCase() || c.filterValue.toLowerCase() === cityName.toLowerCase();
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSwitchCity(c.filterValue)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600 shadow-2xs'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
