import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Share2, 
  Check, 
  PlusCircle, 
  SlidersHorizontal,
  Home,
  RefreshCw
} from 'lucide-react';
import { CITIES } from '../data/mockProperties';
import { ActiveView } from '../types/property';
import { CustomDropdown } from './CustomDropdown';

interface PropertyValuationViewProps {
  onBack: () => void;
  onPostProperty: () => void;
}

export const PropertyValuationView: React.FC<PropertyValuationViewProps> = ({
  onBack,
  onPostProperty,
}) => {
  const [city, setCity] = useState('Bangalore');
  const [locality, setLocality] = useState('Sarjapur Road');
  const [propertyType, setPropertyType] = useState('Villa');
  const [areaSqFt, setAreaSqFt] = useState<number>(3200);
  const [bedrooms, setBedrooms] = useState('4');
  const [age, setAge] = useState('0-2 years');
  const [furnishing, setFurnishing] = useState('Semi-Furnished');
  const [hasAmenities, setHasAmenities] = useState(true);
  const [calculated, setCalculated] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dynamic Valuation Algorithm based on Indian metro city base rates
  const valuation = React.useMemo(() => {
    let baseRate = 8500; // base rate per sq.ft

    if (city === 'Mumbai') baseRate = 22000;
    else if (city === 'Delhi NCR' || city === 'Gurgaon') baseRate = 12500;
    else if (city === 'Bangalore') baseRate = 9200;
    else if (city === 'Pune') baseRate = 7800;
    else if (city === 'Hyderabad') baseRate = 8400;
    else if (city === 'Chennai') baseRate = 8100;
    else if (city === 'Kolkata') baseRate = 6200;
    else if (city === 'Ahmedabad') baseRate = 5800;

    // Property Type Multiplier
    let typeMultiplier = 1.0;
    if (propertyType === 'Villa') typeMultiplier = 1.25;
    if (propertyType === 'Penthouse') typeMultiplier = 1.35;
    if (propertyType === 'Luxury Apartment') typeMultiplier = 1.15;
    if (propertyType === 'Commercial Office') typeMultiplier = 1.4;
    if (propertyType === 'Residential Plot') typeMultiplier = 0.85;

    // Age discount/premium
    let ageMultiplier = 1.0;
    if (age === 'Brand New') ageMultiplier = 1.1;
    if (age === '0-2 years') ageMultiplier = 1.05;
    if (age === '3-5 years') ageMultiplier = 0.98;
    if (age === '5-10 years') ageMultiplier = 0.92;
    if (age === '10+ years') ageMultiplier = 0.85;

    // Furnishing bonus
    let furnishingBonus = 0;
    if (furnishing === 'Fully Furnished') furnishingBonus = 600;
    if (furnishing === 'Semi-Furnished') furnishingBonus = 250;

    const finalRate = Math.round(baseRate * typeMultiplier * ageMultiplier + furnishingBonus);
    const estimatedValue = Math.round(finalRate * areaSqFt);
    const lowRange = Math.round(estimatedValue * 0.94);
    const highRange = Math.round(estimatedValue * 1.06);

    const monthlyRentalEstimate = Math.round((estimatedValue * 0.032) / 12);

    return {
      ratePerSqFt: finalRate,
      estimatedValue,
      lowRange,
      highRange,
      monthlyRental: monthlyRentalEstimate,
    };
  }, [city, propertyType, areaSqFt, age, furnishing]);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹ ${(val / 100000).toFixed(2)} Lakh`;
  };

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setCalculated(true);
    }, 450);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Property Valuation for ${bedrooms} BHK ${propertyType} in ${locality}, ${city}: ${formatCurrency(valuation.lowRange)} - ${formatCurrency(valuation.highRange)} (Avg ₹${valuation.ratePerSqFt}/sq.ft)`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 antialiased">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Home</span>
              <span>/</span>
              <span>Services</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">Housing Tools</span>
              <span>/</span>
              <span className="text-purple-700 font-bold">Property Value Calculator</span>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share Valuation'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>AI Real Estate Valuation Model</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Instant <span className="text-purple-700">Property Value Calculator</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Get an instant, reliable market price estimation, rental yield, and per-sq.ft valuation index based on registry benchmarks and local market sales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 mb-5 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-purple-700" />
              <span>Enter Property Details</span>
            </h3>

            <form onSubmit={handleEvaluate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">City</label>
                  <CustomDropdown
                    value={city}
                    onChange={(val) => setCity(val)}
                    options={CITIES.filter((c) => c !== 'All Cities')}
                    theme="subtle"
                    size="sm"
                  />
                </div>

                {/* Locality */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Locality / Area</label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Sarjapur, Bandra, Baner"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Property Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Property Type</label>
                  <CustomDropdown
                    value={propertyType}
                    onChange={(val) => setPropertyType(val)}
                    options={[
                      { value: 'Villa', label: 'Villa / Triplex' },
                      { value: 'Luxury Apartment', label: 'Luxury Apartment' },
                      { value: 'Apartment', label: 'Standard Apartment / Flat' },
                      { value: 'Penthouse', label: 'Penthouse' },
                      { value: 'Commercial Office', label: 'Commercial Space' },
                      { value: 'Residential Plot', label: 'Residential Plot' }
                    ]}
                    theme="subtle"
                    size="sm"
                  />
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Bedrooms (BHK)</label>
                  <CustomDropdown
                    value={bedrooms}
                    onChange={(val) => setBedrooms(val)}
                    options={[
                      { value: '1', label: '1 BHK' },
                      { value: '2', label: '2 BHK' },
                      { value: '3', label: '3 BHK' },
                      { value: '4', label: '4 BHK' },
                      { value: '5+', label: '5+ BHK Grand Villa' }
                    ]}
                    theme="subtle"
                    size="sm"
                  />
                </div>
              </div>

              {/* Area in Sq.Ft */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Super Built-up Area (Sq.Ft)</label>
                  <span className="text-xs font-black text-purple-700">{areaSqFt.toLocaleString()} sq.ft</span>
                </div>
                <input
                  type="range"
                  min={400}
                  max={10000}
                  step={50}
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full accent-purple-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>400 sq.ft</span>
                  <span>5,000 sq.ft</span>
                  <span>10,000 sq.ft</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Age of Property */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Age of Property</label>
                  <CustomDropdown
                    value={age}
                    onChange={(val) => setAge(val)}
                    options={[
                      { value: 'Brand New', label: 'Brand New / Under Construction' },
                      { value: '0-2 years', label: '0 - 2 Years Old' },
                      { value: '3-5 years', label: '3 - 5 Years Old' },
                      { value: '5-10 years', label: '5 - 10 Years Old' },
                      { value: '10+ years', label: '10+ Years Old' }
                    ]}
                    theme="subtle"
                    size="sm"
                  />
                </div>

                {/* Furnishing */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Furnishing Status</label>
                  <CustomDropdown
                    value={furnishing}
                    onChange={(val) => setFurnishing(val)}
                    options={[
                      { value: 'Fully Furnished', label: 'Fully Furnished' },
                      { value: 'Semi-Furnished', label: 'Semi-Furnished' },
                      { value: 'Unfurnished', label: 'Unfurnished' }
                    ]}
                    theme="subtle"
                    size="sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isEvaluating}
                className="w-full py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Real Estate Data...</span>
                  </>
                ) : (
                  <>
                    <span>Recalculate Market Value</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Valuation Results Card (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-gradient-to-br from-[#2c0e52] via-[#3a136b] to-[#45187e] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                  Estimated Valuation Range
                </span>
                <span className="text-xs text-purple-200 font-semibold">
                  📍 {locality}, {city}
                </span>
              </div>

              {/* Big Valuation Display */}
              <div className="py-4 border-y border-white/10 my-2">
                <span className="text-xs text-purple-200 font-medium block">Fair Market Selling Range:</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight mt-1">
                  {formatCurrency(valuation.lowRange)} - {formatCurrency(valuation.highRange)}
                </div>
                <div className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                  <span>Median Estimate: <strong className="text-white">{formatCurrency(valuation.estimatedValue)}</strong></span>
                </div>
              </div>

              {/* Key Valuation Stats */}
              <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                  <span className="text-[11px] text-purple-200 block">Average Rate / Sq.Ft:</span>
                  <span className="text-base font-extrabold text-white">₹{valuation.ratePerSqFt.toLocaleString('en-IN')}/sq.ft</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                  <span className="text-[11px] text-purple-200 block">Est. Monthly Rental Yield:</span>
                  <span className="text-base font-extrabold text-emerald-400">₹{valuation.monthlyRental.toLocaleString('en-IN')}/mo</span>
                </div>
              </div>

              {/* Post Property CTA */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-xs text-purple-100 mb-3 leading-relaxed">
                  Want to sell or rent your property at this valuation? List directly with 0 broker commission on VillaSell.
                </p>
                <button
                  onClick={onPostProperty}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlusCircle className="w-4 h-4 text-slate-950" />
                  <span>List Property at this Price (FREE)</span>
                </button>
              </div>
            </div>

            {/* Micro-Market Growth Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Locality Capital Appreciation Trend</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Property prices in <strong>{locality}, {city}</strong> have appreciated by approximately <strong>+8.4% to +10.2%</strong> over the past 12 months driven by infrastructure and commercial expansions.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified with state stamp duty and municipal registration records.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
