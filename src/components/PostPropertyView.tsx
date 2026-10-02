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
  Home,
  HelpCircle,
  PhoneCall,
  MessageSquare,
  Camera,
  CheckSquare,
  Info,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  Award,
  FileText,
  Lightbulb,
  Phone,
  Video,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  Play,
  Plus,
  X,
  LayoutDashboard,
  LogIn
} from 'lucide-react';
import { Property, PropertyCategory, PropertyType, AdminEmailNotification, UserProfile } from '../types/property';
import { CITIES, BRAND_CONFIG } from '../data/mockProperties';
import { sanitizeUserPhone, isHelplineOrAdminPhone, resolveUserDisplayName } from '../utils/phoneSanitizer';
import { CustomDropdown } from './CustomDropdown';
import { savePropertyToFirestore, recordAdminEmailNotification, recordUserPostedProperty } from '../services/firebase';
import { uploadToCloudinary, isVideoUrl } from '../services/cloudinary';

export interface MediaUploadItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: 'image' | 'video';
  previewUrl: string;
  secureUrl?: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface PostPropertyViewProps {
  onBack: () => void;
  onPropertyAdded: (newProperty: Property) => void;
  onViewProperty: (property: Property) => void;
  onNavigateToAdminPanel?: () => void;
  onNavigateToDashboard?: () => void;
  currentUser?: UserProfile | null;
  onRequireAuth?: () => void;
}

export const PostPropertyView: React.FC<PostPropertyViewProps> = ({
  onBack,
  onPropertyAdded,
  onViewProperty,
  onNavigateToAdminPanel,
  onNavigateToDashboard,
  currentUser,
  onRequireAuth,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [createdProperty, setCreatedProperty] = useState<Property | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form State
  // Step 1: Basic Info
  const [userRole, setUserRole] = useState<'Owner' | 'Agent' | 'Builder'>('Owner');
  const [listingPurpose, setListingPurpose] = useState<PropertyCategory>('buy');
  const [propertyType, setPropertyType] = useState<PropertyType>('Villa');
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);

  // Step 2: Location & Validation
  const [city, setCity] = useState('Bangalore');
  const [locality, setLocality] = useState('');
  const [projectName, setProjectName] = useState('');
  const [address, setAddress] = useState('');
  const [step2Errors, setStep2Errors] = useState<{
    city?: string;
    locality?: string;
    projectName?: string;
    address?: string;
  }>({});
  const [step2Touched, setStep2Touched] = useState(false);

  // Step 2 Validator
  const validateStep2Fields = (
    cLocality = locality,
    cProject = projectName,
    cAddress = address,
    cCity = city
  ) => {
    const errs: { city?: string; locality?: string; projectName?: string; address?: string } = {};

    if (!cCity || !cCity.trim() || cCity === 'All Cities') {
      errs.city = 'Please select a valid city from the list.';
    }

    if (!cLocality || !cLocality.trim()) {
      errs.locality = 'Locality / Landmark is required. Please enter area name (e.g. Sarjapur Road, Whitefield).';
    } else if (cLocality.trim().length < 3) {
      errs.locality = 'Locality must be at least 3 characters long.';
    }

    if (!cProject || !cProject.trim()) {
      errs.projectName = 'Project or Society Name is required (e.g. Prestige Palms, DLF Enclave).';
    } else if (cProject.trim().length < 2) {
      errs.projectName = 'Project / Society name must be at least 2 characters.';
    }

    if (!cAddress || !cAddress.trim()) {
      errs.address = 'Exact Address or House/Plot Number is required.';
    } else if (cAddress.trim().length < 5) {
      errs.address = 'Please enter a complete address (minimum 5 characters, e.g. Villa 14, Phase 2).';
    }

    return errs;
  };

  const handleContinueToPricing = () => {
    setStep2Touched(true);
    const errs = validateStep2Fields();
    setStep2Errors(errs);

    if (Object.keys(errs).length === 0) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Step 3: Pricing & Area
  const [priceNumber, setPriceNumber] = useState<number>(12500000);
  const [carpetArea, setCarpetArea] = useState<number>(1850);
  const [furnishing, setFurnishing] = useState<'Furnished' | 'Semi-Furnished' | 'Unfurnished'>('Semi-Furnished');
  const [possession, setPossession] = useState('Ready to Move');
  const [facing, setFacing] = useState<'North' | 'East' | 'North-East' | 'West' | 'South-East'>('East');
  const [step3Error, setStep3Error] = useState<string | null>(null);

  const handleContinueToAmenities = () => {
    if (!priceNumber || priceNumber <= 0) {
      setStep3Error('Please enter a valid price/rent amount greater than 0.');
      return;
    }
    if (!carpetArea || carpetArea <= 0) {
      setStep3Error('Please enter a valid carpet area in sq.ft.');
      return;
    }
    setStep3Error(null);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 4: Contact & Amenities & Cloudinary Media
  const [contactName, setContactName] = useState(currentUser?.name || resolveUserDisplayName(null, currentUser?.email));
  const [contactPhone, setContactPhone] = useState(sanitizeUserPhone(currentUser?.phone));
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [description, setDescription] = useState('');

  React.useEffect(() => {
    if (currentUser) {
      if (!contactName) setContactName(currentUser.name || resolveUserDisplayName(null, currentUser.email));
      if (!contactEmail) setContactEmail(currentUser.email || '');
      const userCleanPhone = sanitizeUserPhone(currentUser.phone);
      if (!contactPhone || isHelplineOrAdminPhone(contactPhone)) {
        setContactPhone(userCleanPhone);
      }
    }
  }, [currentUser]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    '24x7 Security & CCTV',
    '100% Power Backup',
    'Reserved Car Parking',
    'Swimming Pool'
  ]);

  // Media Upload State (Local files uploaded directly to Cloudinary)
  const [mediaList, setMediaList] = useState<MediaUploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFiles = (incomingFiles: FileList | File[]) => {
    setMediaError(null);
    const filesArray = Array.from(incomingFiles);

    const validFiles = filesArray.filter(
      (f) => f.type.startsWith('image/') || f.type.startsWith('video/')
    );

    if (validFiles.length === 0) {
      setMediaError('Please select valid photo (JPG, PNG, WEBP) or video (MP4, MOV) files.');
      return;
    }

    const newItems: MediaUploadItem[] = validFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      previewUrl: URL.createObjectURL(file),
      status: 'uploading',
      progress: 0,
    }));

    setMediaList((prev) => [...prev, ...newItems]);

    // Start uploads immediately
    newItems.forEach((item) => {
      uploadFileItem(item);
    });
  };

  const uploadFileItem = (item: MediaUploadItem) => {
    uploadToCloudinary(item.file, (percent) => {
      setMediaList((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, progress: percent } : m))
      );
    })
      .then((res) => {
        setMediaList((prev) =>
          prev.map((m) =>
            m.id === item.id
              ? {
                  ...m,
                  status: 'success',
                  progress: 100,
                  secureUrl: res.secure_url,
                  type: res.resource_type === 'video' ? 'video' : m.type,
                }
              : m
          )
        );
      })
      .catch((err) => {
        setMediaList((prev) =>
          prev.map((m) =>
            m.id === item.id
              ? {
                  ...m,
                  status: 'error',
                  error: err.message || 'Upload failed',
                }
              : m
          )
        );
      });
  };

  const retryUpload = (id: string) => {
    const item = mediaList.find((m) => m.id === id);
    if (!item) return;
    setMediaList((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: 'uploading', progress: 0, error: undefined } : m
      )
    );
    uploadFileItem(item);
  };

  const removeMedia = (id: string) => {
    const item = mediaList.find((m) => m.id === id);
    if (item && item.previewUrl.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(item.previewUrl);
      } catch {}
    }
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setMediaError(null);

    const isUploadingAny = mediaList.some((m) => m.status === 'uploading');
    if (isUploadingAny) {
      setMediaError('Please wait for photos and videos to finish uploading before publishing.');
      return;
    }

    const successfulMedia = mediaList.filter((m) => m.status === 'success' && m.secureUrl);

    if (successfulMedia.length === 0) {
      setMediaError('Please upload at least 1 property photo or video to publish your listing.');
      return;
    }

    setIsSubmitting(true);

    const formattedPriceStr = formatPrice(priceNumber, listingPurpose);
    const pricePerSqFt = carpetArea > 0 ? Math.round(priceNumber / carpetArea) : 0;

    const uploadedImages = successfulMedia
      .filter((m) => m.type === 'image')
      .map((m) => m.secureUrl!);

    const uploadedVideos = successfulMedia
      .filter((m) => m.type === 'video')
      .map((m) => m.secureUrl!);

    // Default architectural photo fallback if user only uploaded video
    const fallbackImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

    const finalImages = uploadedImages.length > 0
      ? uploadedImages
      : [fallbackImage];

    const generatedTitle = customTitle.trim() || 
      `${bedrooms > 0 ? `${bedrooms} BHK ` : ''}${propertyType} in ${locality || projectName || city}`;

    const newProp: Property = {
      id: `prop-${Date.now()}`,
      title: generatedTitle,
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
      images: finalImages,
      videos: uploadedVideos.length > 0 ? uploadedVideos : undefined,
      amenities: selectedAmenities,
      localityHighlights: [
        { title: 'Nearest Metro Station', distance: '1.2 km', type: 'metro' },
        { title: 'International Airport Link', distance: '30 mins', type: 'airport' },
        { title: 'Super Specialty Hospital', distance: '2.5 km', type: 'hospital' },
        { title: 'Top Ranked School', distance: '1.0 km', type: 'school' }
      ],
      postedBy: {
        name: contactName || currentUser?.name || resolveUserDisplayName(null, currentUser?.email) || 'Verified Owner',
        type: userRole,
        phone: sanitizeUserPhone(contactPhone) || sanitizeUserPhone(currentUser?.phone) || '',
        email: contactEmail || currentUser?.email,
        userId: currentUser?.id
      },
      postedByEmail: contactEmail || currentUser?.email,
      description: description || `Splendid ${propertyType} offered with zero brokerage in prime ${city}. Complete with ${selectedAmenities.slice(0, 3).join(', ')}. Clear title, immediate loan sanction available.`,
      createdAt: new Date().toISOString().split('T')[0],
      approvalStatus: 'pending' // Restricted: Must be approved by Admin before showing on public website
    };

    try {
      const firestoreId = await savePropertyToFirestore(newProp);
      if (firestoreId) {
        newProp.id = firestoreId;
      }

      // Record in user property map so it immediately appears in User Dashboard
      if (currentUser?.email) {
        recordUserPostedProperty(currentUser.email, newProp.id);
      } else if (contactEmail) {
        recordUserPostedProperty(contactEmail, newProp.id);
      }

      // Dispatch & Record notification for Admin (supportvillasell@gmail.com)
      const adminNotif: AdminEmailNotification = {
        id: `notif-${newProp.id}`,
        propertyId: newProp.id,
        propertyTitle: newProp.title,
        propertyCity: newProp.city,
        propertyLocality: newProp.locality,
        propertyPrice: newProp.priceDisplay,
        submittedBy: {
          name: contactName || currentUser?.name || resolveUserDisplayName(null, currentUser?.email) || 'Owner',
          phone: sanitizeUserPhone(contactPhone) || sanitizeUserPhone(currentUser?.phone) || '',
          role: userRole
        },
        adminEmail: BRAND_CONFIG.email,
        timestamp: new Date().toISOString(),
        status: 'pending',
        propertyThumbnail: finalImages[0]
      };
      await recordAdminEmailNotification(adminNotif);
    } catch (err) {
      console.warn('Firestore direct write notice:', err);
    } finally {
      setIsSubmitting(false);
    }

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Auth Required Notice if user is browsing anonymously */}
        {!currentUser && (
          <div className="mb-6 p-4.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-black shadow-sm">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <span>Sign In to Publish Your Listing</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">100% Free • Zero Brokerage</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  List residential or commercial properties with zero brokerage fees. Please sign in or create a free account to track live verification status, manage property details, and receive verified buyer inquiries directly.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onRequireAuth}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs shadow-md shrink-0 cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          </div>
        )}

        {currentStep <= 4 ? (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form & Stepper (8 cols) */}
              <div className="lg:col-span-8">
                {/* Step Progress Indicators */}
                <div className="mb-6">
                  <div className="text-center sm:text-left mb-6">
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
                  <div className="flex items-center justify-between relative max-w-md mx-auto sm:mx-0">
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
              {/* Mandatory warning banner if errors present */}
              {step2Touched && Object.keys(step2Errors).length > 0 && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 font-bold animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-sm">Please fill all mandatory location fields marked with * to proceed.</p>
                    <p className="text-xs font-semibold text-rose-700 mt-0.5">
                      Locality, Project / Society Name, and Exact Address are required before continuing to Pricing.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  City *
                </label>
                <CustomDropdown
                  value={city}
                  onChange={(val) => {
                    setCity(val);
                    if (step2Touched) {
                      setStep2Errors(validateStep2Fields(locality, projectName, address, val));
                    }
                  }}
                  options={CITIES.filter((c) => c !== 'All Cities')}
                  theme="subtle"
                  size="md"
                />
                {step2Errors.city && (
                  <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{step2Errors.city}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Locality / Landmark *</span>
                  <span className="text-[11px] font-semibold text-rose-600 lowercase">mandatory</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarjapur Road, Worli Sea Face, Shivpur, Gomti Nagar"
                  required
                  value={locality}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLocality(val);
                    if (step2Touched) {
                      setStep2Errors(validateStep2Fields(val, projectName, address, city));
                    }
                  }}
                  className={`w-full p-3 rounded-xl border text-sm font-semibold transition-all focus:outline-none ${
                    step2Errors.locality
                      ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 ring-2 ring-rose-200/50'
                      : locality.trim().length >= 3
                      ? 'border-emerald-400 bg-emerald-50/10 focus:border-emerald-500'
                      : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
                {step2Errors.locality ? (
                  <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{step2Errors.locality}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Mention the neighborhood, sector, or nearest known landmark (minimum 3 characters).
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Project or Society Name *</span>
                  <span className="text-[11px] font-semibold text-rose-600 lowercase">mandatory</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prestige Palms, DLF Enclave, Kashi Royal Villas, Green Meadows"
                  required
                  value={projectName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProjectName(val);
                    if (step2Touched) {
                      setStep2Errors(validateStep2Fields(locality, val, address, city));
                    }
                  }}
                  className={`w-full p-3 rounded-xl border text-sm font-semibold transition-all focus:outline-none ${
                    step2Errors.projectName
                      ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 ring-2 ring-rose-200/50'
                      : projectName.trim().length >= 2
                      ? 'border-emerald-400 bg-emerald-50/10 focus:border-emerald-500'
                      : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
                {step2Errors.projectName ? (
                  <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{step2Errors.projectName}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Name of the building, apartment society, gated colony, or builder township.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Exact Address or House/Plot Number *</span>
                  <span className="text-[11px] font-semibold text-rose-600 lowercase">mandatory</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Flat 402, Tower B, Prestige Palms, Ring Road Corridor"
                  required
                  value={address}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAddress(val);
                    if (step2Touched) {
                      setStep2Errors(validateStep2Fields(locality, projectName, val, city));
                    }
                  }}
                  className={`w-full p-3 rounded-xl border text-sm font-semibold transition-all focus:outline-none resize-none ${
                    step2Errors.address
                      ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 ring-2 ring-rose-200/50'
                      : address.trim().length >= 5
                      ? 'border-emerald-400 bg-emerald-50/10 focus:border-emerald-500'
                      : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
                {step2Errors.address ? (
                  <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{step2Errors.address}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Provide complete address with house/flat or plot number (minimum 5 characters).
                  </p>
                )}
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
                  onClick={handleContinueToPricing}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-800 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
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

              {step3Error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs font-bold text-rose-800 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{step3Error}</span>
                </div>
              )}

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
                  onClick={handleContinueToAmenities}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-800 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
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

              {/* Cloudinary Direct Photo & Video Upload */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Property Photos & Videos *
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload original photos & video tours directly from your phone/computer.
                    </p>
                  </div>
                  {mediaList.length > 0 && (
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      {mediaList.filter((m) => m.status === 'success').length} of {mediaList.length} Uploaded
                    </span>
                  )}
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFiles(e.target.files);
                      e.target.value = '';
                    }
                  }}
                />

                {/* Drag-and-Drop Area */}
                <div
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-blue-600 bg-blue-50/80 scale-[1.01] shadow-lg ring-4 ring-blue-500/10'
                      : 'border-slate-300 hover:border-blue-500 bg-slate-50/70 hover:bg-blue-50/30'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs transition-transform ${
                        isDragging
                          ? 'bg-blue-600 text-white scale-110'
                          : 'bg-white text-blue-600 border border-slate-200 shadow-sm'
                      }`}
                    >
                      <Camera className="w-7 h-7" />
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        <span className="text-blue-600 underline underline-offset-2">Click to select files</span> or drag & drop here
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Select multiple photos (JPG, PNG, WEBP) & videos (MP4, MOV) from your device
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 flex-wrap justify-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-2xs">
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                        Photos (Interior & Exterior)
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-2xs">
                        <Video className="w-3.5 h-3.5 text-emerald-600" />
                        Walkthrough Video Tours
                      </span>
                    </div>
                  </div>
                </div>

                {/* Validation error message if any */}
                {mediaError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs font-bold text-rose-800 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{mediaError}</span>
                  </div>
                )}

                {/* Live Global Upload Progress Indicator */}
                {mediaList.some((m) => m.status === 'uploading') && (
                  <div className="p-3.5 rounded-xl bg-blue-50/90 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                      <span className="text-xs font-bold text-blue-900">
                        Uploading files ({mediaList.filter((m) => m.status === 'uploading').length} in progress)...
                      </span>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-48">
                      <div className="flex-1 bg-blue-200/80 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.round(
                              mediaList.reduce(
                                (acc, curr) => acc + (curr.status === 'success' ? 100 : curr.progress),
                                0
                              ) / mediaList.length
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-black text-blue-800 shrink-0">
                        {Math.round(
                          mediaList.reduce(
                            (acc, curr) => acc + (curr.status === 'success' ? 100 : curr.progress),
                            0
                          ) / mediaList.length
                        )}
                        %
                      </span>
                    </div>
                  </div>
                )}

                {/* Preview Thumbnails Grid with Delete and Status Indicators */}
                {mediaList.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Selected Files ({mediaList.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add More Photos/Videos</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {mediaList.map((item, idx) => (
                        <div
                          key={item.id}
                          className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-2xs"
                        >
                          {item.type === 'video' ? (
                            <div className="w-full h-full relative flex items-center justify-center bg-slate-950">
                              <video
                                src={item.secureUrl || item.previewUrl}
                                className="w-full h-full object-cover opacity-75"
                                muted
                                playsInline
                              />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs">
                                  <Play className="w-4 h-4 fill-white ml-0.5" />
                                </div>
                              </div>
                              <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-bold text-white flex items-center gap-1">
                                <Video className="w-3 h-3 text-emerald-400" /> Video
                              </span>
                            </div>
                          ) : (
                            <img
                              src={item.secureUrl || item.previewUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}

                          {/* Cover Photo Badge on First Image */}
                          {idx === 0 && item.status === 'success' && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-blue-600/95 text-white text-[10px] font-black tracking-wide shadow-xs">
                              Cover Photo
                            </span>
                          )}

                          {/* Uploading Status Overlay with Spinner and % */}
                          {item.status === 'uploading' && (
                            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-2 text-white">
                              <Loader2 className="w-5 h-5 text-blue-400 animate-spin mb-1" />
                              <span className="text-[11px] font-extrabold text-blue-200">
                                {item.progress}%
                              </span>
                              <div className="w-16 bg-slate-700 rounded-full h-1 mt-1 overflow-hidden">
                                <div
                                  className="bg-blue-400 h-1 transition-all duration-200"
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Success Badge */}
                          {item.status === 'success' && idx !== 0 && (
                            <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-emerald-600/90 text-white text-[10px] font-bold flex items-center gap-0.5 shadow-2xs">
                              <Check className="w-3 h-3" /> Ready
                            </span>
                          )}

                          {/* Error Overlay with Retry Button */}
                          {item.status === 'error' && (
                            <div className="absolute inset-0 bg-rose-950/85 flex flex-col items-center justify-center p-2 text-white text-center">
                              <AlertCircle className="w-5 h-5 text-rose-300 mb-1" />
                              <span className="text-[10px] font-bold text-rose-100 line-clamp-1 mb-1">
                                {item.error || 'Upload failed'}
                              </span>
                              <button
                                type="button"
                                onClick={() => retryUpload(item.id)}
                                className="px-2 py-1 rounded bg-white text-rose-800 text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-rose-50"
                              >
                                <RefreshCw className="w-3 h-3" /> Retry
                              </button>
                            </div>
                          )}

                          {/* Delete / Remove Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeMedia(item.id);
                            }}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
                            title="Remove file"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>

                          {/* File Name Tag */}
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 pt-3 text-white text-[10px] truncate pointer-events-none">
                            <span className="font-medium truncate block">{item.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Custom Property Headline / Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ultra Luxury 4 BHK Triplex Villa with Private Pool"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-blue-600"
                />
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
                  disabled={isSubmitting || mediaList.some((m) => m.status === 'uploading')}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 text-white font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/20 transition-all transform active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Publishing Listing...</span>
                    </>
                  ) : mediaList.some((m) => m.status === 'uploading') ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Uploading Media...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Publish Property Listing (100% Free)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
                </div>
              </div>

              {/* Right Column: Interactive Step Assistant & Guidance (4 cols) */}
              <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
                {/* 1. Quick Step Tracker Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-slate-100">
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                    <div>
                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">Listing Progress (Step-by-Step)</h3>
                      <p className="text-[11px] text-slate-500">Publish your property in 4 easy steps</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { step: 1, title: 'Basic Information', desc: 'Category, property type & layout' },
                      { step: 2, title: 'Location & Address', desc: 'City, locality & famous landmarks' },
                      { step: 3, title: 'Pricing & Dimensions', desc: 'Carpet area & expected pricing' },
                      { step: 4, title: 'Photos & Videos', desc: 'Direct upload, amenities & contact' },
                    ].map((s) => (
                      <div
                        key={s.step}
                        className={`flex items-start gap-3 p-2.5 rounded-2xl transition-all ${
                          currentStep === s.step
                            ? 'bg-blue-50/90 border border-blue-200 shadow-2xs'
                            : currentStep > s.step
                            ? 'bg-emerald-50/60 border border-emerald-100'
                            : 'opacity-70 border border-transparent'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            currentStep === s.step
                              ? 'bg-blue-600 text-white shadow-xs'
                              : currentStep > s.step
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {currentStep > s.step ? <Check className="w-3.5 h-3.5" /> : s.step}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${currentStep === s.step ? 'text-blue-900' : 'text-slate-800'}`}>
                              {s.title}
                            </span>
                            {currentStep === s.step && (
                              <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-[9px] font-extrabold text-white uppercase tracking-wider">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Contextual Tip for Active Step */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 shadow-2xs">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Pro Tip for Step {currentStep}:</span>
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed font-medium">
                    {currentStep === 1 &&
                      'Select the precise property type (e.g. Villa or Apartment) and exact BHK configuration to help genuine buyers locate your listing faster.'}
                    {currentStep === 2 &&
                      'Mention nearby landmarks, highways, or metro stations alongside your locality. Verified landmarks generate up to 3x more buyer inquiries.'}
                    {currentStep === 3 &&
                      'Set a realistic and competitive price aligned with current market trends in your area. Balanced pricing closes deals twice as quickly.'}
                    {currentStep === 4 &&
                      'Upload high-quality daylight photographs and walkthrough video tours directly from your device. Real media generates up to 5x more verified buyer calls.'}
                  </p>
                </div>

                {/* 3. 100% Free Owner Benefits */}
                <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>100% Free Owner Listing</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-white mb-3">
                    Why Post on{' '}
                    <span className="inline-flex items-baseline font-black tracking-tight">
                      <span className="text-white">Villa</span>
                      <span className="text-amber-400">Sell</span>
                    </span>
                    ?
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Zero Brokerage:</strong> No commissions, fees, or hidden charges</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Direct Contact:</strong> Buyers & tenants connect directly with you</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Instant Go-Live:</strong> Listing becomes live immediately upon submit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Verified Reach:</strong> Discoverable by 50,000+ active home seekers</span>
                    </li>
                  </ul>
                </div>

                {/* 4. Need Assistance / Phone Helpline Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 text-center shadow-xs">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-800">Need Help Posting Your Property?</h4>
                  <p className="text-[11px] text-slate-500 mt-1 mb-3">
                    Our real estate advisors are ready to assist you free of charge.
                  </p>
                  <a
                    href="tel:+918383826205"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call: +91 83838 26205</span>
                  </a>
                  <a
                    href="https://wa.me/918383826205?text=Hello%20VillaSell,%20I%20need%20help%20posting%20my%20property."
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full mt-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* COMPREHENSIVE INSTRUCTION & SELLER GUIDE SECTION (BELOW FORM) */}
            <div className="mt-12 sm:mt-14 pt-8 sm:pt-10 border-t border-slate-200">
              {/* Section Header with Logo Colors */}
              <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-10 px-2 sm:px-4">
                <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 border border-blue-200">
                  <FileText className="w-3.5 h-3.5" />
                  Complete Step-by-Step Instructions
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mt-3 tracking-tight leading-snug">
                  <span>How to Post a Property on </span>
                  <span className="inline-flex items-baseline font-black tracking-tight">
                    <span className="text-[#1b4a80]">Villa</span>
                    <span className="text-amber-500">Sell</span>
                  </span>
                  <span>? </span>
                  <span className="inline-block whitespace-nowrap">
                    (Complete Guide)
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 max-w-2xl mx-auto">
                  A seamless, 100% free process for home owners, agents, and buyers. Publish your property in four simple steps and connect directly with verified clients.
                </p>
              </div>

              {/* 4 Step Process Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10 sm:mb-12">
                {/* Step 1 Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    1
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 mb-2 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Step 1: Enter Basic Details</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Identify your role (Owner, Agent, or Builder) and choose your listing goal: Sale (Buy), Rent, Commercial, or Plots. Pick your property type (Villa, Luxury Apartment, Penthouse) and set the bedroom & bathroom count.
                  </p>
                </div>

                {/* Step 2 Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    2
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Step 2: Precise Location & City</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Select your city (Bangalore, Mumbai, Delhi NCR, Lucknow, Pune, etc.) and enter the exact locality or gated community name. Mention prominent landmarks or metro stations for fast, reliable navigation.
                  </p>
                </div>

                {/* Step 3 Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    3
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 mb-2 flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Step 3: Carpet Area & Fair Price</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Specify the accurate carpet area in square feet (Sq.Ft) and state your competitive asking price in Lakhs or Crores. Indicate furnishing status (Furnished / Semi-Furnished) and primary Vastu facing direction.
                  </p>
                </div>

                {/* Step 4 Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-sm mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    4
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 mb-2 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Step 4: Photos & Instant Publish</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pick appealing lifestyle photo presets or paste a high-resolution image link. Select verified amenities (Security, Lift, Parking, Power Backup) and click "Publish Property Listing" to go live instantly!
                  </p>
                </div>
              </div>

              {/* 4 Golden Rules for Fast Closures */}
              <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 mb-10 sm:mb-12 shadow-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Pro Tips for Property Owners</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                  4 Golden Rules to Sell or Rent Your Property Faster
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6">
                  Following these industry-proven best practices helps you secure verified buyer inquiries up to 3x faster:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="text-amber-400 font-black text-sm sm:text-base mb-1">📸 High-Definition Photos</div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Capture natural daylight shots of living rooms, bedrooms, and balconies. Good visuals attract 5x more clicks.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="text-amber-400 font-black text-sm sm:text-base mb-1">💰 Competitive Market Price</div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Price in alignment with current local transactions. Realistic pricing accelerates negotiations and closures.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="text-amber-400 font-black text-sm sm:text-base mb-1">📍 Detailed Nearby Access</div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Highlight proximity to IT parks, expressways, schools, and hospitals so buyers recognize location benefits.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="text-amber-400 font-black text-sm sm:text-base mb-1">⚡ Active WhatsApp & Phone</div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Provide a prompt phone number. Fast response to buyer questions increases your chance of closing high-value deals.
                    </p>
                  </div>
                </div>
              </div>

              {/* Frequently Asked Questions (FAQ) */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 mb-10 sm:mb-12 shadow-xs">
                <div className="text-center max-w-2xl mx-auto mb-8 px-2">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                    Frequently Asked Questions
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    Frequently Asked Questions About Posting on{' '}
                    <span className="inline-flex items-baseline font-black tracking-tight">
                      <span className="text-[#1b4a80]">Villa</span>
                      <span className="text-amber-500">Sell</span>
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Click on any question below to see its detailed answer.
                  </p>
                </div>

                <div className="space-y-3 max-w-3xl mx-auto">
                  {[
                    {
                      q: 'Is posting a property on VillaSell really 100% free?',
                      a: 'Yes, absolutely! Listing your property on VillaSell is completely free of charge. We do not charge any upfront fees, hidden listing subscriptions, or brokerage commissions to property owners or buyers.',
                    },
                    {
                      q: 'How long does it take for my property listing to go live?',
                      a: 'Your property goes live instantly the moment you complete Step 4 and click "Publish Property Listing". It becomes immediately visible and searchable to thousands of home buyers across your city.',
                    },
                    {
                      q: 'How will interested buyers or tenants contact me?',
                      a: 'Your verified phone number and direct WhatsApp contact button appear directly on your property card. Interested buyers connect straight with you with zero middleman interference.',
                    },
                    {
                      q: 'Can I update my property price, details, or photos later?',
                      a: 'Yes, you can edit your listing details, adjust the asking price, update photos, or mark your property as sold/rented anytime.',
                    },
                  ].map((faq, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full p-4 sm:p-4.5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-800 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                            Q{idx + 1}
                          </span>
                          <span className="text-slate-900">{faq.q}</span>
                        </span>
                        {openFaq === idx ? (
                          <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>
                      {openFaq === idx && (
                        <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50 animate-in fade-in duration-150">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Support Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md mx-auto sm:mx-0">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                      Need Assistance with Property Listing?
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Our real estate advisory team is available to assist you with free onboarding and marketing.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                  <a
                    href="tel:+918383826205"
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Support</span>
                  </a>
                  <a
                    href="https://wa.me/918383826205?text=Hello%20VillaSell,%20I%20need%20help%20posting%20my%20property."
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 5: Success Screen */
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md">
            {createdProperty && (
              <div className="text-center py-6 space-y-6 animate-in zoom-in-95">
                <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Clock className="w-10 h-10 text-amber-600" />
                </div>

                <div>
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                    ⏳ Pending Admin Approval
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                    Property Submitted for Verification!
                  </h2>
                  <p className="text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
                    Your property details, photos, and video tours are under verification. An instant notification alert has been dispatched to the Admin at <span className="font-bold text-slate-900">{BRAND_CONFIG.email}</span>.
                  </p>
                </div>

                {/* Status Notice Banner */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 max-w-lg mx-auto text-left flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900">
                    <p className="font-extrabold text-sm mb-0.5">Admin Quality & Zero-Brokerage Check</p>
                    <p className="text-amber-800 leading-relaxed">
                      Admin will review the pricing, photos, and contact authenticity. As soon as the Admin approves the listing, it will automatically go live on the public website search and catalog.
                    </p>
                  </div>
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
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {createdProperty.images.length} Photo{createdProperty.images.length > 1 ? 's' : ''}
                      </span>
                      {createdProperty.videos && createdProperty.videos.length > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <Video className="w-3 h-3 text-emerald-600" />
                          {createdProperty.videos.length} Video{createdProperty.videos.length > 1 ? 's' : ''}
                        </span>
                      )}
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  {onNavigateToDashboard && (
                    <button
                      onClick={onNavigateToDashboard}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-950/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Go to My Dashboard (Track Status)</span>
                    </button>
                  )}

                  <button
                    onClick={() => onViewProperty(createdProperty)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    Preview My Submission
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
        )}
      </div>
    </div>
  );
};
