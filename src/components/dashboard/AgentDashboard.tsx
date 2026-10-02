import React, { useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  UploadCloud, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Phone, 
  Mail, 
  Eye, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  BadgePercent,
  CheckCircle2,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag
} from 'lucide-react';
import { Property, UserProfile, PropertyInquiry, PropertyType, PropertyCategory } from '../../types/property';
import { sanitizeUserPhone, resolveUserDisplayName } from '../../utils/phoneSanitizer';

interface AgentDashboardProps {
  user: UserProfile;
  properties: Property[];
  onAddProperty: (property: Property) => void;
  onUpdateProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  inquiries: PropertyInquiry[];
  onUpdateInquiryStatus: (inquiryId: string, newStatus: 'New' | 'Contacted' | 'Closed') => void;
  shortlist?: string[];
  showToast: (msg: string) => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  user,
  properties,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty,
  onSelectProperty,
  inquiries,
  onUpdateInquiryStatus,
  shortlist = [],
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'my-listings' | 'post-fast' | 'leads'>('my-listings');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Cloudinary Upload & Fast Post State
  const [fastTitle, setFastTitle] = useState('');
  const [fastCategory, setFastCategory] = useState<PropertyCategory>('buy');
  const [fastType, setFastType] = useState<PropertyType>('Luxury Apartment');
  const [fastCity, setFastCity] = useState('Bangalore');
  const [fastLocality, setFastLocality] = useState('');
  const [fastPriceCr, setFastPriceCr] = useState('2.45');
  const [fastBhk, setFastBhk] = useState(3);
  const [fastArea, setFastArea] = useState(1850);
  const [fastDesc, setFastDesc] = useState('');
  
  // Cloudinary Specific State
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');
  const [isCloudinaryUploading, setIsCloudinaryUploading] = useState(false);
  const [cloudinaryUploadSuccess, setCloudinaryUploadSuccess] = useState(false);
  const [uploadedCloudinaryImages, setUploadedCloudinaryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  ]);

  // Filter Agent's Properties: either matching email or matching agent name or agent posted
  const myProperties = properties.filter((p) => {
    if (p.postedByEmail && user.email) {
      return p.postedByEmail.toLowerCase() === user.email.toLowerCase();
    }
    return p.postedBy?.type === 'Agent' || p.postedBy?.name.toLowerCase().includes(user.name.split(' ')[0].toLowerCase());
  });

  // Overview metrics
  const activeCount = myProperties.filter(p => !p.isSoldOrRented).length;
  const soldCount = myProperties.filter(p => p.isSoldOrRented).length;
  const agentInquiries = inquiries.filter(inq => inq.targetRole === 'Agent' || inq.targetAgentEmail?.includes('agent'));
  const totalViews = myProperties.reduce((acc, p) => acc + (p.viewsCount || 160), 0);

  // Cloudinary file upload simulator / handler
  const handleCloudinaryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCloudinaryUploading(true);
    setCloudinaryUploadSuccess(false);

    // Simulate Cloudinary CDN upload progress with actual FileReader preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setTimeout(() => {
        const simulatedCloudinaryCdnUrl = (reader.result as string) || `https://res.cloudinary.com/villasell/image/upload/v1711200000/property_${Date.now()}.jpg`;
        setUploadedCloudinaryImages((prev) => [simulatedCloudinaryCdnUrl, ...prev]);
        setCloudinaryUrl(simulatedCloudinaryCdnUrl);
        setIsCloudinaryUploading(false);
        setCloudinaryUploadSuccess(true);
        showToast('Image uploaded successfully via Cloudinary CDN!');
      }, 900);
    };
    reader.readAsDataURL(file);
  };

  const handleAddDirectCloudinaryUrl = () => {
    if (!cloudinaryUrl.trim()) return;
    setUploadedCloudinaryImages((prev) => [cloudinaryUrl.trim(), ...prev]);
    showToast('Cloudinary image URL added!');
  };

  const handleFastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fastTitle.trim() || !fastLocality.trim()) {
      showToast('Please provide a title and locality.');
      return;
    }

    const priceNum = parseFloat(fastPriceCr) * 10000000;
    const newProperty: Property = {
      id: `agent-prop-${Date.now()}`,
      title: fastTitle.trim(),
      category: fastCategory,
      propertyType: fastType,
      city: fastCity,
      locality: fastLocality.trim(),
      address: `${fastLocality.trim()}, ${fastCity}`,
      price: priceNum,
      priceDisplay: `₹ ${fastPriceCr} Cr`,
      pricePerSqFt: Math.round(priceNum / (fastArea || 1000)),
      bedrooms: fastBhk,
      bathrooms: Math.max(1, fastBhk),
      balconies: 2,
      areaSqFt: Math.round(fastArea * 1.25),
      carpetAreaSqFt: fastArea,
      status: 'Ready to Move',
      possession: 'Immediate',
      furnishing: 'Semi-Furnished',
      facing: 'East',
      floor: '5th of 14 Floors',
      isVerified: true,
      isZeroBrokerage: false,
      isFeatured: false,
      approvalStatus: 'approved',
      viewsCount: 1,
      inquiriesCount: 0,
      isSoldOrRented: false,
      postedByEmail: user.email,
      images: uploadedCloudinaryImages.length > 0 ? uploadedCloudinaryImages : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
      ],
      amenities: ['Power Backup', '24x7 Security', 'Covered Parking', 'Elevator', 'Gymnasium'],
      localityHighlights: [
        { title: 'Metro Station', distance: '1.2 km', type: 'metro' },
        { title: 'International Airport', distance: '18 km', type: 'airport' }
      ],
      postedBy: {
        name: user.name || resolveUserDisplayName(null, user.email) || 'Verified Agent',
        type: 'Agent',
        phone: sanitizeUserPhone(user.phone)
      },
      description: fastDesc.trim() || `Prime ${fastBhk} BHK ${fastType} presented exclusively by ${user.name}. High rental yield, premium fittings, and immediate possession.`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddProperty(newProperty);
    showToast('Listing published via Agent Fast Workflow!');
    setFastTitle('');
    setFastLocality('');
    setActiveTab('my-listings');
  };

  const handleToggleSold = (prop: Property) => {
    const updated: Property = {
      ...prop,
      isSoldOrRented: !prop.isSoldOrRented,
      status: prop.isSoldOrRented ? 'Ready to Move' : 'Immediate'
    };
    onUpdateProperty(updated);
    showToast(updated.isSoldOrRented ? 'Marked as Sold / Rented' : 'Marked as Available');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP OVERVIEW METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">My Active Listings</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">{activeCount}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Live in marketplace search</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Buyer Leads Received</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">{agentInquiries.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Direct inquiries & site visits</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Deals Closed / Sold</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">{soldCount}</div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">Properties successfully closed</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Portfolio Views</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">{totalViews}</div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">Organic search impressions</p>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex flex-wrap gap-1.5 shadow-xs">
        <button
          onClick={() => setActiveTab('my-listings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'my-listings'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>My Property Listings ({myProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('post-fast')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'post-fast'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Fast Post with Cloudinary</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'leads'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Client Leads ({agentInquiries.length})</span>
        </button>
      </div>

      {/* 3. TAB 1: MY PROPERTIES */}
      {activeTab === 'my-listings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Manage My Properties</h2>
              <p className="text-xs text-slate-500">
                You have full authority to edit, mark as sold/rented, or remove your exclusive listings.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('post-fast')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Property</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-900/80 text-white backdrop-blur-xs">
                        {prop.category}
                      </span>
                      {prop.isSoldOrRented && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-purple-600 text-white">
                          Sold / Closed
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-slate-900/80 text-white text-xs font-extrabold backdrop-blur-xs">
                      {prop.priceDisplay}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{prop.title}</h4>
                    <p className="text-xs text-slate-500">{prop.locality}, {prop.city}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-1">
                      <span>{prop.bedrooms} BHK</span>
                      <span>•</span>
                      <span>{prop.carpetAreaSqFt} sq.ft</span>
                      <span>•</span>
                      <span>{prop.viewsCount || 42} views</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleToggleSold(prop)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                        prop.isSoldOrRented
                          ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>{prop.isSoldOrRented ? 'Mark Available' : 'Mark as Sold'}</span>
                    </button>

                    <button
                      onClick={() => onSelectProperty(prop)}
                      className="py-2 px-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Live</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setEditingProperty(prop)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Price / Title</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('Delete this listing permanently?')) {
                          onDeleteProperty(prop.id);
                          showToast('Listing removed.');
                        }
                      }}
                      className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 2: FAST POST WITH CLOUDINARY */}
      {activeTab === 'post-fast' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <UploadCloud className="w-4 h-4" />
              <span>Fast Workflow for Verified Agents</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Post Listing with Cloudinary Media CDN
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload ultra high-resolution photos via Cloudinary's global CDN for 5x faster mobile loading and sharper visuals.
            </p>
          </div>

          <form onSubmit={handleFastSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Property Title *
              </label>
              <input
                type="text"
                required
                value={fastTitle}
                onChange={(e) => setFastTitle(e.target.value)}
                placeholder="e.g. Sobha Windsor 3 BHK Ultra Luxury Residence"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Category & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Category *
                </label>
                <select
                  value={fastCategory}
                  onChange={(e) => setFastCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                >
                  <option value="buy">Sale (Buy)</option>
                  <option value="rent">Rent</option>
                  <option value="commercial">Commercial</option>
                  <option value="plots">Plots</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Property Type *
                </label>
                <select
                  value={fastType}
                  onChange={(e) => setFastType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                >
                  <option value="Luxury Apartment">Luxury Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Independent Floor">Independent Floor</option>
                  <option value="Commercial Office">Commercial Office</option>
                </select>
              </div>
            </div>

            {/* City & Locality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  City *
                </label>
                <select
                  value={fastCity}
                  onChange={(e) => setFastCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                >
                  {['Mumbai', 'Lucknow', 'Varanasi', 'Prayagraj', 'Bangalore', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Locality / Society Name *
                </label>
                <input
                  type="text"
                  required
                  value={fastLocality}
                  onChange={(e) => setFastLocality(e.target.value)}
                  placeholder="e.g. Whitefield, Hope Farm Junction"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Price & Area */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Price (in Crores) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={fastPriceCr}
                    onChange={(e) => setFastPriceCr(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Bedrooms (BHK) *
                </label>
                <select
                  value={fastBhk}
                  onChange={(e) => setFastBhk(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                >
                  <option value={1}>1 BHK</option>
                  <option value={2}>2 BHK</option>
                  <option value={3}>3 BHK</option>
                  <option value={4}>4 BHK</option>
                  <option value={5}>5+ BHK</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Carpet Area (sq.ft) *
                </label>
                <input
                  type="number"
                  required
                  value={fastArea}
                  onChange={(e) => setFastArea(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* CLOUDINARY MEDIA UPLOAD BOX */}
            <div className="p-5 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    ☁️
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">Cloudinary Media Integration</h4>
                    <p className="text-[11px] text-slate-500">Auto-compression, WebP optimization & CDN caching</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                  Cloudinary Enabled
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Method 1: Local file upload via Cloudinary */}
                <label className="flex flex-col items-center justify-center p-4 border border-blue-200 rounded-xl bg-white hover:bg-blue-50/80 transition-colors cursor-pointer text-center">
                  <UploadCloud className="w-6 h-6 text-blue-600 mb-1" />
                  <span className="text-xs font-bold text-slate-800">Choose Image to Upload</span>
                  <span className="text-[10px] text-slate-400">Directly syncs to Cloudinary</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCloudinaryFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Method 2: Direct Cloudinary URL */}
                <div className="flex flex-col justify-center p-3 border border-slate-200 rounded-xl bg-white space-y-2">
                  <span className="text-[11px] font-bold text-slate-700">Or Paste Cloudinary Image URL</span>
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      value={cloudinaryUrl}
                      onChange={(e) => setCloudinaryUrl(e.target.value)}
                      placeholder="https://res.cloudinary.com/..."
                      className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddDirectCloudinaryUrl}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {isCloudinaryUploading && (
                <div className="text-center py-2 text-xs font-bold text-blue-600 animate-pulse">
                  Uploading image to Cloudinary CDN...
                </div>
              )}

              {/* Uploaded Thumbnails Preview */}
              {uploadedCloudinaryImages.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-600 mb-2">Uploaded Images ({uploadedCloudinaryImages.length}):</div>
                  <div className="flex flex-wrap gap-2.5">
                    {uploadedCloudinaryImages.map((img, i) => (
                      <div key={i} className="relative w-20 h-16 rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setUploadedCloudinaryImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 p-0.5 rounded-full bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Publish Listing to VillaSell</span>
            </button>
          </form>
        </div>
      )}

      {/* 5. TAB 3: LEADS MANAGEMENT */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">Client Inquiries & Direct Leads</h2>
            <p className="text-xs text-slate-500">
              Prospective buyers and tenants who requested site visits or pricing on your listings.
            </p>
          </div>

          <div className="space-y-3">
            {agentInquiries.map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                      {lead.type}
                    </span>
                    <span className="text-xs text-slate-400">{lead.date}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">{lead.propertyTitle}</h4>
                  <p className="text-xs text-slate-600 italic">"{lead.message}"</p>
                  <div className="text-xs font-semibold text-slate-700 pt-1 flex items-center gap-3">
                    <span>Client: <strong>{lead.userName}</strong></span>
                    <span>Phone: <a href={`tel:${lead.userPhone}`} className="text-blue-600 underline">{lead.userPhone}</a></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={lead.status}
                    onChange={(e) => onUpdateInquiryStatus(lead.id, e.target.value as any)}
                    className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-bold"
                  >
                    <option value="New">New Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Deal Closed</option>
                  </select>

                  <a
                    href={`https://wa.me/${lead.userPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(lead.userName)},%20I%20am%20calling%20regarding%20${encodeURIComponent(lead.propertyTitle)}%20on%20VillaSell...`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK PROPERTY EDIT MODAL */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Edit My Listing</h3>
              <button
                onClick={() => setEditingProperty(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateProperty(editingProperty);
                setEditingProperty(null);
                showToast('Listing updated successfully!');
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingProperty.title}
                  onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price Display</label>
                  <input
                    type="text"
                    required
                    value={editingProperty.priceDisplay}
                    onChange={(e) => setEditingProperty({ ...editingProperty, priceDisplay: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Carpet Area</label>
                  <input
                    type="number"
                    value={editingProperty.carpetAreaSqFt}
                    onChange={(e) => setEditingProperty({ ...editingProperty, carpetAreaSqFt: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
