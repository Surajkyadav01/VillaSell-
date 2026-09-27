import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Building, 
  MapPin, 
  IndianRupee, 
  User, 
  Sparkles, 
  Upload, 
  ArrowRight, 
  ShieldCheck,
  Check,
  Home
} from 'lucide-react';
import { Property, PropertyCategory, PropertyType } from '../types/property';
import { CITIES, BRAND_CONFIG } from '../data/mockProperties';
import { CustomDropdown } from './CustomDropdown';

interface PostPropertyViewProps {
  onBack: () => void;
  onPropertyAdded: (newProperty: Property) => void;
  onViewProperty: (property: Property) => void;
}

export const PostPropertyView: React.FC<PostPropertyViewProps> = ({
  onBack,
  onPropertyAdded,
  onViewProperty,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [createdProperty, setCreatedProperty] = useState<Property | null>(null);

  // Form State
  // Step 1: Basic Info
  const [userRole, setUserRole] = useState<'Owner' | 'Agent' | 'Builder'>('Owner');
  const [listingPurpose, setListingPurpose] = useState<PropertyCategory>('buy');
  const [propertyType, setPropertyType] = useState<PropertyType>('Villa');
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);

  // Step 2: Location
  const [city, setCity] = useState('Bangalore');
  const [locality, setLocality] = useState('');
  const [projectName, setProjectName] = useState('');
  const [address, setAddress] = useState('');

  // Step 3: Pricing & Area
  const [priceNumber, setPriceNumber] = useState<number>(12500000);
  const [carpetArea, setCarpetArea] = useState<number>(1850);
  const [furnishing, setFurnishing] = useState<'Furnished' | 'Semi-Furnished' | 'Unfurnished'>('Semi-Furnished');
  const [possession, setPossession] = useState('Ready to Move');
  const [facing, setFacing] = useState<'North' | 'East' | 'North-East' | 'West' | 'South-East'>('East');

  // Step 4: Contact & Amenities
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('+91 8383826205');
  const [contactEmail, setContactEmail] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    '24x7 Security & CCTV',
    '100% Power Backup',
    'Reserved Car Parking',
    'Swimming Pool'
  ]);
  const [selectedImagePreset, setSelectedImagePreset] = useState(0);

  const imagePresets = [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'
  ];

  const availableAmenities = [
    '24x7 Security & CCTV',
    '100% Power Backup',
    'Reserved Car Parking',
    'Swimming Pool',
    'Gym & Fitness Studio',
    'Clubhouse & Party Hall',
    'Landscaped Garden',
    'Kids Play Zone',
    'EV Charging Point',
    'Intercom System'
  ];

  const toggleAmenity = (name: string) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== name));
    } else {
      setSelectedAmenities([...selectedAmenities, name]);
    }
  };

  const formatPrice = (val: number, cat: PropertyCategory) => {
    if (cat === 'rent') {
      return `₹ ${val.toLocaleString('en-IN')} / mo`;
    }
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹ ${(val / 100000).toFixed(2)} Lakhs`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedPriceStr = formatPrice(priceNumber, listingPurpose);
    const pricePerSqFt = carpetArea > 0 ? Math.round(priceNumber / carpetArea) : 0;

    const newProp: Property = {
      id: `prop-${Date.now()}`,
      title: `${bedrooms > 0 ? `${bedrooms} BHK ` : ''}${propertyType} in ${locality || projectName || city}`,
      category: listingPurpose,
      propertyType: propertyType,
      city: city,
      locality: locality || projectName || 'Prime Residential Corridor',
      address: address || `${projectName}, ${locality}, ${city}`,
      price: priceNumber,
      priceDisplay: formattedPriceStr,
      pricePerSqFt: pricePerSqFt,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      balconies: 2,
      areaSqFt: Math.round(carpetArea * 1.2),
      carpetAreaSqFt: carpetArea,
      status: possession.includes('Ready') ? 'Ready to Move' : 'Under Construction',
      possession: possession,
      furnishing: furnishing,
      facing: facing,
      floor: propertyType === 'Villa' ? 'G+2 Independent Villa' : '4th of 12 Floors',
      reraId: 'UPRERA-VERIFIED-2026',
      isVerified: true,
      isZeroBrokerage: true,
      isFeatured: true,
      images: [
        imagePresets[selectedImagePreset],
        imagePresets[(selectedImagePreset + 1) % imagePresets.length]
      ],
      amenities: selectedAmenities,
      localityHighlights: [
        { title: 'Nearest Metro Station', distance: '1.2 km', type: 'metro' },
        { title: 'International Airport Link', distance: '30 mins', type: 'airport' },
        { title: 'Super Specialty Hospital', distance: '2.5 km', type: 'hospital' },
        { title: 'Top Ranked School', distance: '1.0 km', type: 'school' }
      ],
      postedBy: {
        name: contactName || 'Verified Owner',
        type: userRole,
        phone: contactPhone || BRAND_CONFIG.phone
      },
      description: description || `Splendid ${propertyType} offered with zero brokerage in prime ${city}. Complete with ${selectedAmenities.slice(0, 3).join(', ')}. Clear title, immediate loan sanction available.`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onPropertyAdded(newProp);
    setCreatedProperty(newProp);
    setCurrentStep(5); // Celebratory success screen
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 animate-in fade-in duration-300">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <div className="text-xs text-slate-500 font-medium">
              <span>Home</span> / <span className="font-bold text-slate-800">Post Property For Free</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Free Listing • Zero Brokerage</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        {/* Step Progress Indicators */}
        {currentStep <= 4 && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wider">
                Step {currentStep} of 4
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                {currentStep === 1 && 'Basic Property Details'}
                {currentStep === 2 && 'Location & Address'}
                {currentStep === 3 && 'Pricing & Dimensions'}
                {currentStep === 4 && 'Amenities & Contact Details'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Reach thousands of genuine buyers and tenants instantly.
              </p>
            </div>

            {/* Stepper bar */}
            <div className="flex items-center justify-between relative max-w-md mx-auto">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />

              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep === step
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md'
                      : currentStep > step
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border-2 border-slate-300 text-slate-500'
                  }`}
                >
                  {currentStep > step ? <Check className="w-4 h-4" /> : step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wizard Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md">
          {/* STEP 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  I am the:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Owner', 'Agent', 'Builder'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setUserRole(role)}
                      className={`py-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        userRole === role
                          ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Listing For:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { key: 'buy', label: 'Sale (Buy)' },
                      { key: 'rent', label: 'Rent' },
                      { key: 'commercial', label: 'Commercial' },
                      { key: 'plots', label: 'Plots' },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setListingPurpose(cat.key)}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        listingPurpose === cat.key
                          ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Property Type:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      'Villa',
                      'Luxury Apartment',
                      'Apartment',
                      'Independent Floor',
                      'Penthouse',
                      'Commercial Office',
                      'Residential Plot',
                    ] as const
                  ).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPropertyType(type)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                        propertyType === type
                          ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {propertyType !== 'Residential Plot' && propertyType !== 'Commercial Office' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Bedrooms (BHK)
                    </label>
                    <CustomDropdown
                      value={bedrooms}
                      onChange={(val) => setBedrooms(Number(val))}
                      options={[
                        { value: 1, label: '1 BHK' },
                        { value: 2, label: '2 BHK' },
                        { value: 3, label: '3 BHK' },
                        { value: 4, label: '4 BHK' },
                        { value: 5, label: '5+ BHK Villa' },
                      ]}
                      theme="subtle"
                      size="md"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Bathrooms
                    </label>
                    <CustomDropdown
                      value={bathrooms}
                      onChange={(val) => setBathrooms(Number(val))}
                      options={[
                        { value: 1, label: '1 Bathroom' },
                        { value: 2, label: '2 Bathrooms' },
                        { value: 3, label: '3 Bathrooms' },
                        { value: 4, label: '4 Bathrooms' },
                        { value: 5, label: '5+ Bathrooms' },
                      ]}
                      theme="subtle"
                      size="md"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-800 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <span>Continue to Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  City *
                </label>
                <CustomDropdown
                  value={city}
                  onChange={(val) => setCity(val)}
                  options={CITIES.filter((c) => c !== 'All Cities')}
                  theme="subtle"
                  size="md"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Locality / Landmark *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarjapur Road, Worli Sea Face, Shivpur, Gomti Nagar"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Project or Society Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prestige Palms, DLF Enclave, Kashi Royal Villas"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Exact Address or House/Plot Number
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Villa 14, Emerald Phase 2, Ring Road Corridor"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-800 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <span>Continue to Pricing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Pricing & Dimensions */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {listingPurpose === 'rent' ? 'Expected Monthly Rent (₹)' : 'Expected Price (₹)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={1000}
                    step={10000}
                    value={priceNumber}
                    onChange={(e) => setPriceNumber(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <p className="text-xs text-blue-600 font-bold mt-1">
                  Preview: {formatPrice(priceNumber, listingPurpose)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Carpet Area (sq.ft) *
                  </label>
                  <input
                    type="number"
                    min={100}
                    value={carpetArea}
                    onChange={(e) => setCarpetArea(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Furnishing Status
                  </label>
                  <CustomDropdown
                    value={furnishing}
                    onChange={(val) => setFurnishing(val)}
                    options={[
                      { value: 'Furnished', label: 'Furnished' },
                      { value: 'Semi-Furnished', label: 'Semi-Furnished' },
                      { value: 'Unfurnished', label: 'Unfurnished' },
                    ]}
                    theme="subtle"
                    size="md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Possession Status
                  </label>
                  <CustomDropdown
                    value={possession}
                    onChange={(val) => setPossession(val)}
                    options={[
                      { value: 'Ready to Move', label: 'Ready to Move (Immediate)' },
                      { value: 'Within 3 Months', label: 'Within 3 Months' },
                      { value: 'Under Construction (2026)', label: 'Under Construction (2026)' },
                    ]}
                    theme="subtle"
                    size="md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Facing Direction
                  </label>
                  <CustomDropdown
                    value={facing}
                    onChange={(val) => setFacing(val)}
                    options={[
                      { value: 'North', label: 'North' },
                      { value: 'East', label: 'East' },
                      { value: 'North-East', label: 'North-East (Vaastu Compliant)' },
                      { value: 'West', label: 'West' },
                      { value: 'South-East', label: 'South-East' },
                    ]}
                    theme="subtle"
                    size="md"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-800 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <span>Continue to Amenities</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Amenities & Contact */}
          {currentStep === 4 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Key Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableAmenities.map((amenity) => {
                    const isChecked = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-2.5 rounded-xl text-left text-xs font-semibold border flex items-center gap-2 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center ${
                            isChecked ? 'bg-blue-600 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="truncate">{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Property Showcase Photo
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {imagePresets.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImagePreset(idx)}
                      className={`relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedImagePreset === idx
                          ? 'border-blue-600 ring-2 ring-blue-600/30'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Preset" className="w-full h-full object-cover" />
                      {selectedImagePreset === idx && (
                        <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kamlesh Kumar"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Contact Phone (WhatsApp enabled) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 8383826205"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Property Description & Special Features
                </label>
                <textarea
                  rows={3}
                  placeholder="Highlight key advantages, nearby landmarks, and legal clear titles..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/20 transition-all transform active:scale-95"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Publish Property Listing (100% Free)</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Success Screen */}
          {currentStep === 5 && createdProperty && (
            <div className="text-center py-8 space-y-6 animate-in zoom-in-95">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Successfully Published
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                  Your Property is Now Live on VillaSell!
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-2">
                  Buyers and tenants in {createdProperty.city} can now discover your listing with zero brokerage.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left flex gap-4 items-center">
                <img
                  src={createdProperty.images[0]}
                  alt="Property"
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div>
                  <span className="text-xs font-bold text-blue-600">{createdProperty.priceDisplay}</span>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{createdProperty.title}</h4>
                  <p className="text-xs text-slate-500">{createdProperty.locality}, {createdProperty.city}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onViewProperty(createdProperty)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  View My Live Listing
                </button>

                <button
                  onClick={onBack}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-sm transition-all cursor-pointer"
                >
                  Back to Marketplace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
