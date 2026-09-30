import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Compass, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Heart, 
  Share2, 
  Phone, 
  MessageCircle, 
  Calculator, 
  Car, 
  Waves, 
  Dumbbell, 
  Trees, 
  Sparkles, 
  Building,
  Plane,
  Train,
  School,
  Store,
  Check,
  Send,
  Play,
  Video
} from 'lucide-react';
import { Property } from '../types/property';
import { BRAND_CONFIG } from '../data/mockProperties';
import { isVideoUrl } from '../services/cloudinary';

interface PropertyDetailViewProps {
  property: Property;
  onBack: () => void;
  isShortlisted: boolean;
  onToggleShortlist: (id: string) => void;
  allProperties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  property,
  onBack,
  isShortlisted,
  onToggleShortlist,
  allProperties,
  onSelectProperty,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);

  // Combined gallery media list (images & videos)
  const mediaItems = useMemo(() => {
    const list: { url: string; isVideo: boolean }[] = [];
    (property.images || []).forEach((url) => {
      list.push({ url, isVideo: isVideoUrl(url) });
    });
    (property.videos || []).forEach((url) => {
      if (!list.some((item) => item.url === url)) {
        list.push({ url, isVideo: true });
      }
    });
    return list.length > 0
      ? list
      : [{ url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80', isVideo: false }];
  }, [property.images, property.videos]);

  // Inquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryDate, setInquiryDate] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState(
    `Hi, I would like to schedule a site visit and discuss details for "${property.title}".`
  );
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // EMI Calculator State
  const defaultLoanAmount = Math.max(1000000, Math.round(property.price * 0.8));
  const [loanAmount, setLoanAmount] = useState(defaultLoanAmount);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  // EMI Formula Calculation
  const emiCalculation = useMemo(() => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    if (p <= 0 || r <= 0 || n <= 0) {
      return { monthlyEmi: 0, totalInterest: 0, totalPayment: 0 };
    }

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = emi * n;
    const totalInt = totalPay - p;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInt),
      totalPayment: Math.round(totalPay),
    };
  }, [loanAmount, interestRate, tenureYears]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;
    setInquirySubmitted(true);
  };

  const whatsappInquiryUrl = `https://wa.me/918383826205?text=${encodeURIComponent(
    `Hello VillaSell Team, I am inquiring about Property ID [${property.id}]: "${property.title}" in ${property.locality}, ${property.city}. Price: ${property.priceDisplay}. My name is ${inquiryName || 'Buyer'}. Please connect me with the owner.`
  )}`;

  // Similar properties in same city or category
  const similarProperties = allProperties
    .filter((p) => p.id !== property.id && (p.city === property.city || p.category === property.category))
    .slice(0, 3);

  const getLocalityIcon = (type: string) => {
    switch (type) {
      case 'metro':
        return <Train className="w-4 h-4 text-blue-600" />;
      case 'airport':
        return <Plane className="w-4 h-4 text-blue-600" />;
      case 'hospital':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'school':
        return <School className="w-4 h-4 text-blue-600" />;
      case 'mall':
        return <Store className="w-4 h-4 text-blue-600" />;
      default:
        return <MapPin className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Action Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Listings</span>
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Home</span>
              <span>/</span>
              <span>{property.city}</span>
              <span>/</span>
              <span>{property.category.toUpperCase()}</span>
              <span>/</span>
              <span className="text-slate-800 font-bold line-clamp-1 max-w-xs">{property.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleShortlist(property.id)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isShortlisted
                  ? 'border-rose-300 bg-rose-50 text-rose-600'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title={isShortlisted ? 'Saved' : 'Save Property'}
            >
              <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-rose-600' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              title="Share Link"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <a
              href={`tel:${BRAND_CONFIG.phoneClean}`}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call Helpline</span>
              <span className="sm:hidden">Call</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Main Grid: Left Details & Right Sticky Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Photo Gallery, Overview, Amenities, EMI, Locality */}
          <div className="lg:col-span-8 space-y-8">
            {/* Gallery Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs overflow-hidden">
              {/* Big Main Media Item */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 mb-3 group flex items-center justify-center">
                {mediaItems[activeImageIndex]?.isVideo ? (
                  <video
                    key={mediaItems[activeImageIndex]?.url}
                    src={mediaItems[activeImageIndex]?.url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <img
                    src={mediaItems[activeImageIndex]?.url || property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
                  <span className="px-3 py-1 rounded-md bg-blue-600/90 backdrop-blur-md text-white font-bold text-xs shadow-md">
                    {property.propertyType}
                  </span>
                  {property.isZeroBrokerage && (
                    <span className="px-3 py-1 rounded-md bg-emerald-600/90 backdrop-blur-md text-white font-bold text-xs shadow-md">
                      Zero Brokerage
                    </span>
                  )}
                  {mediaItems[activeImageIndex]?.isVideo && (
                    <span className="px-3 py-1 rounded-md bg-amber-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" /> Video Tour
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-md font-semibold pointer-events-none">
                  {mediaItems[activeImageIndex]?.isVideo ? 'Video' : 'Photo'} {activeImageIndex + 1} of {mediaItems.length}
                </div>
              </div>

              {/* Thumbnails */}
              {mediaItems.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                  {mediaItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-blue-600 ring-2 ring-blue-600/20'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      {item.isVideo ? (
                        <div className="w-full h-full bg-slate-950 flex items-center justify-center relative">
                          <video src={item.url} className="w-full h-full object-cover opacity-60" muted playsInline />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="w-4 h-4 fill-white text-white" />
                          </div>
                          <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] text-white font-bold px-1 rounded">
                            Video
                          </span>
                        </div>
                      ) : (
                        <img src={item.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Core Pricing Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Listing
                    </span>
                    {property.reraId && (
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        RERA: {property.reraId}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    {property.title}
                  </h1>

                  <div className="flex items-center gap-2 text-slate-600 text-sm mt-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{property.address}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-3xl font-black text-blue-900 tracking-tight">
                    {property.priceDisplay}
                  </div>
                  {property.pricePerSqFt > 0 && (
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      ₹{property.pricePerSqFt.toLocaleString('en-IN')} per sq.ft
                    </p>
                  )}
                  <span className="inline-block mt-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Negotiable directly with Owner
                  </span>
                </div>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Configuration</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <BedDouble className="w-4 h-4 text-blue-600" />
                    <span>{property.bedrooms > 0 ? `${property.bedrooms} BHK` : property.propertyType}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Carpet Area</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <Maximize2 className="w-4 h-4 text-blue-600" />
                    <span>{property.carpetAreaSqFt} sq.ft</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Facing</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <Compass className="w-4 h-4 text-blue-600" />
                    <span>{property.facing} Facing</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Furnishing</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>{property.furnishing}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Floor Details</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span className="truncate">{property.floor}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Bathrooms</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <Bath className="w-4 h-4 text-blue-600" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Possession</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="truncate">{property.possession}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Posted By</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="truncate">{property.postedBy.type}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span>Property Overview & Details</span>
              </h2>
              <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span>Exclusive Amenities & Facilities</span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {property.amenities.length} Features Included
                </span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 text-xs font-semibold"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Locality & Connectivity Highlights */}
            {property.localityHighlights && property.localityHighlights.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Neighbourhood & Connectivity
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.localityHighlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          {getLocalityIcon(item.type)}
                        </div>
                        <span className="font-semibold text-slate-800 text-xs">{item.title}</span>
                      </div>
                      <span className="text-xs font-bold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded-md">
                        {item.distance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive EMI Calculator Widget */}
            <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-900/20">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">Home Loan EMI Calculator</h2>
                    <p className="text-xs text-slate-500">Live estimates with leading Indian banks</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Estimated EMI</span>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{emiCalculation.monthlyEmi.toLocaleString('en-IN')}<span className="text-xs font-medium text-slate-500">/mo</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Loan Amount Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-600">Loan Amount:</span>
                    <span className="text-blue-600">₹{(loanAmount / 100000).toFixed(1)} Lacs</span>
                  </div>
                  <input
                    type="range"
                    min={500000}
                    max={Math.max(50000000, property.price)}
                    step={100000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹5 Lacs</span>
                    <span>₹5+ Cr</span>
                  </div>
                </div>

                {/* Interest Rate Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-600">Interest Rate:</span>
                    <span className="text-blue-600">{interestRate}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min={6.5}
                    max={14.0}
                    step={0.1}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>6.5%</span>
                    <span>14.0%</span>
                  </div>
                </div>

                {/* Tenure Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-600">Tenure:</span>
                    <span className="text-blue-600">{tenureYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={1}
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>5 Yrs</span>
                    <span>30 Yrs</span>
                  </div>
                </div>
              </div>

              {/* Total Calculation breakdown bar */}
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">Principal Amount</span>
                  <span className="font-bold text-slate-900">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">Total Interest Payable</span>
                  <span className="font-bold text-blue-600">₹{emiCalculation.totalInterest.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block mb-0.5">Total Payment (Loan + Int)</span>
                  <span className="font-bold text-slate-900">₹{emiCalculation.totalPayment.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Sticky Contact Seller & Owner Card */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-36">
            <div className="bg-white rounded-2xl border-2 border-blue-200/80 p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-indigo-600 text-white text-[10px] uppercase font-black px-4 py-1 rounded-bl-xl tracking-wider">
                Direct Connect
              </div>

              <div className="mb-5">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                  Posted by Verified {property.postedBy.type}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{property.postedBy.name}</h3>
                <p className="text-xs text-slate-500">Official Helpline: {BRAND_CONFIG.phone}</p>
              </div>

              {/* Direct Quick Contact Buttons */}
              <div className="space-y-2.5 mb-6">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={`tel:${BRAND_CONFIG.phoneClean}`}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call {BRAND_CONFIG.phone}</span>
                </a>
              </div>

              {/* Interactive Inquiry Form */}
              <div className="border-t border-slate-100 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Schedule Free Site Visit / Inquire
                </h4>

                {inquirySubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center animate-in zoom-in-95">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                      <Check className="w-5 h-5" />
                    </div>
                    <h5 className="font-bold text-emerald-900 text-sm">Inquiry Received!</h5>
                    <p className="text-xs text-emerald-700 mt-1">
                      Our property manager will call you at <span className="font-semibold">{inquiryPhone}</span> within 15 minutes.
                    </p>
                    <button
                      onClick={() => setInquirySubmitted(false)}
                      className="mt-3 text-xs font-bold text-emerald-800 underline cursor-pointer"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Full Name *"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        placeholder="Mobile Number (e.g. +91 9876543210) *"
                        required
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <input
                        type="date"
                        placeholder="Preferred Visit Date"
                        value={inquiryDate}
                        onChange={(e) => setInquiryDate(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-600 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Instant Inquiry</span>
                    </button>
                  </form>
                )}
              </div>

              {/* VillaSell Guarantee */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero spam guarantee. Your details are shared solely with the verified property manager.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-14 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Similar Verified Properties</h3>
                <p className="text-xs text-slate-500">Handpicked alternatives matching your preferences</p>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-bold text-blue-600 hover:text-blue-900 cursor-pointer"
              >
                Browse All Properties →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((simProp) => (
                <div
                  key={simProp.id}
                  onClick={() => {
                    onSelectProperty(simProp);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="aspect-[16/10] overflow-hidden relative bg-slate-100">
                    <img
                      src={simProp.images[0]}
                      alt={simProp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {simProp.propertyType}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-lg font-black text-slate-900 mb-1">{simProp.priceDisplay}</div>
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1 group-hover:text-blue-600 mb-1">
                      {simProp.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{simProp.locality}, {simProp.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Mobile Sticky Floating Contact Bar (Instant WhatsApp & Direct Call on Phones) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3.5 py-2.5 flex items-center gap-2.5 lg:hidden shadow-2xl">
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Owner</span>
          </a>
          <a
            href={`tel:${BRAND_CONFIG.phoneClean}`}
            className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span>Call Agent</span>
          </a>
        </div>
      </div>
    </div>
  );
};
