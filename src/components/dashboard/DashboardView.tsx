import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Building, 
  Briefcase, 
  ShoppingBag, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Eye,
  Edit3,
  Trash2,
  Phone,
  Mail,
  MessageSquare,
  Heart,
  MapPin,
  Check,
  X,
  Search,
  Tag,
  ExternalLink,
  User,
  LayoutDashboard
} from 'lucide-react';
import { 
  UserProfile, 
  Property, 
  PropertyInquiry, 
  SiteVisit, 
  SearchAlert, 
  BuyerRequirement,
  UserRole 
} from '../../types/property';
import { 
  updatePropertyInFirestore, 
  deletePropertyFromFirestore, 
  isPropertyOwnedByUser,
  recordUserPostedProperty,
  updateUserProfileInFirestore 
} from '../../services/firebase';
import { BRAND_CONFIG } from '../../data/mockProperties';
import { sanitizeUserPhone, resolveUserDisplayName } from '../../utils/phoneSanitizer';

interface DashboardViewProps {
  user: UserProfile;
  onUpdateUserRole: (newRole: UserRole) => void;
  onUpdateUserProfile?: (updated: Partial<UserProfile>) => void;
  onBackToMarketplace: () => void;
  properties: Property[];
  onAddProperty: (property: Property) => void;
  onUpdateProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  shortlist: string[];
  onToggleShortlist: (id: string) => void;
  inquiries: PropertyInquiry[];
  onUpdateInquiryStatus: (inquiryId: string, newStatus: 'New' | 'Contacted' | 'Closed') => void;
  siteVisits: SiteVisit[];
  onAddSiteVisit: (visit: SiteVisit) => void;
  onCancelSiteVisit: (id: string) => void;
  searchAlerts: SearchAlert[];
  onAddSearchAlert: (alert: SearchAlert) => void;
  onDeleteSearchAlert: (id: string) => void;
  buyerRequirements: BuyerRequirement[];
  onAddBuyerRequirement: (req: BuyerRequirement) => void;
  onLogout: () => void;
  onNavigateToPostProperty: () => void;
  showToast: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onUpdateUserRole,
  onBackToMarketplace,
  properties,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty,
  onSelectProperty,
  shortlist,
  onToggleShortlist,
  inquiries = [],
  onUpdateInquiryStatus,
  onLogout,
  onNavigateToPostProperty,
  showToast,
  onUpdateUserProfile,
}) => {
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-properties' | 'leads' | 'shortlist' | 'profile'>('my-properties');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'sold'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Property Editing State for User
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Phone sanitization helper (Never default user profile to company helpline)
  const cleanUserPhone = sanitizeUserPhone(user.phone);

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState(user.name || resolveUserDisplayName(null, user.email));
  const [profilePhoneInput, setProfilePhoneInput] = useState(cleanUserPhone);

  useEffect(() => {
    setProfileNameInput(user.name || resolveUserDisplayName(null, user.email));
    setProfilePhoneInput(sanitizeUserPhone(user.phone));
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = profileNameInput.trim() || user.name || resolveUserDisplayName(null, user.email);
    const cleanPhone = sanitizeUserPhone(profilePhoneInput);

    try {
      await updateUserProfileInFirestore(user.email, {
        name: cleanName,
        phone: cleanPhone
      });
    } catch (err) {
      console.warn('Profile firestore update notice:', err);
    }

    if (onUpdateUserProfile) {
      onUpdateUserProfile({ name: cleanName, phone: cleanPhone });
    }
    setIsEditingProfile(false);
    showToast('Profile credentials updated successfully!');
  };

  // Filter properties owned by this user
  const myProperties = useMemo(() => {
    return properties.filter((prop) => isPropertyOwnedByUser(prop, user));
  }, [properties, user]);

  // Derive status counts for this user's posted properties
  const pendingCount = useMemo(() => {
    return myProperties.filter((p) => p.approvalStatus === 'pending').length;
  }, [myProperties]);

  const approvedCount = useMemo(() => {
    return myProperties.filter((p) => !p.approvalStatus || p.approvalStatus === 'approved').length;
  }, [myProperties]);

  const rejectedCount = useMemo(() => {
    return myProperties.filter((p) => p.approvalStatus === 'rejected').length;
  }, [myProperties]);

  const soldCount = useMemo(() => {
    return myProperties.filter((p) => p.isSoldOrRented).length;
  }, [myProperties]);

  // Filtered list based on active status tab and search query
  const displayedProperties = useMemo(() => {
    return myProperties.filter((p) => {
      // 1. Status Filter
      if (statusFilter === 'pending' && p.approvalStatus !== 'pending') return false;
      if (statusFilter === 'approved' && p.approvalStatus === 'pending') return false;
      if (statusFilter === 'approved' && p.approvalStatus === 'rejected') return false;
      if (statusFilter === 'rejected' && p.approvalStatus !== 'rejected') return false;
      if (statusFilter === 'sold' && !p.isSoldOrRented) return false;

      // 2. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesCity = p.city.toLowerCase().includes(query);
        const matchesLoc = p.locality.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCity && !matchesLoc) return false;
      }

      return true;
    });
  }, [myProperties, statusFilter, searchQuery]);

  // Shortlisted property items
  const shortlistedProps = useMemo(() => {
    return properties.filter((p) => shortlist.includes(p.id));
  }, [properties, shortlist]);

  // User inquiries matching their properties
  const myPropertyIds = useMemo(() => new Set(myProperties.map((p) => p.id)), [myProperties]);
  const userInquiries = useMemo(() => {
    if (inquiries.length === 0) return [];
    return inquiries.filter((inq) => myPropertyIds.has(inq.propertyId));
  }, [inquiries, myPropertyIds]);

  // Action: Toggle Sold Status
  const handleToggleSold = async (prop: Property) => {
    const updatedStatus = !prop.isSoldOrRented;
    const updated: Property = {
      ...prop,
      isSoldOrRented: updatedStatus
    };
    onUpdateProperty(updated);
    await updatePropertyInFirestore(prop.id, { isSoldOrRented: updatedStatus });
    showToast(updatedStatus ? 'Property marked as Sold Out!' : 'Property marked as Available!');
  };

  // Action: Save Edit Changes
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    onUpdateProperty(editingProperty);
    await updatePropertyInFirestore(editingProperty.id, editingProperty);
    setEditingProperty(null);
    showToast('Your property details were updated successfully!');
  };

  // Action: Confirm Delete
  const handleConfirmDelete = async (id: string) => {
    onDeleteProperty(id);
    await deletePropertyFromFirestore(id);
    setDeleteConfirmId(null);
    showToast('Your property listing was removed.');
  };

  // Action: 1-Click Sample Listing Creator for Testing Admin Approval
  const handleCreateSampleListing = () => {
    const sampleId = `prop-sample-${Date.now()}`;
    const sampleProp: Property = {
      id: sampleId,
      title: `3 BHK Luxury Villa in prime ${user.city || 'Bangalore'}`,
      category: 'buy',
      propertyType: 'Villa',
      city: user.city || 'Bangalore',
      locality: 'Indiranagar Prime Corridor',
      address: `Plot 14, 100ft Road, ${user.city || 'Bangalore'}`,
      price: 24500000,
      priceDisplay: '₹2.45 Cr',
      pricePerSqFt: 9800,
      bedrooms: 3,
      bathrooms: 3,
      balconies: 2,
      areaSqFt: 2500,
      carpetAreaSqFt: 2100,
      status: 'Ready to Move',
      possession: 'Immediate',
      furnishing: 'Semi-Furnished',
      facing: 'East',
      floor: 'Independent G+2 Villa',
      reraId: 'UPRERA-VERIFIED-2026',
      isVerified: false,
      isZeroBrokerage: true,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
      ],
      amenities: ['24x7 Security & CCTV', 'Swimming Pool', 'Clubhouse', 'Car Parking'],
      localityHighlights: [
        { title: 'Metro Station', distance: '800 m', type: 'metro' },
        { title: 'International Airport Link', distance: '35 mins', type: 'airport' }
      ],
      postedBy: {
        name: user.name || resolveUserDisplayName(null, user.email),
        type: user.role === 'Agent' ? 'Agent' : 'Owner',
        phone: sanitizeUserPhone(user.phone) || '',
        email: user.email,
        userId: user.id
      },
      postedByEmail: user.email,
      description: `Spacious luxury villa with clear title and zero brokerage. Waiting for Admin verification to go live.`,
      createdAt: new Date().toISOString().split('T')[0],
      approvalStatus: 'pending' // Initial status is pending
    };

    onAddProperty(sampleProp);
    if (user.email) {
      recordUserPostedProperty(user.email, sampleProp.id);
    }
    showToast('Sample property posted! Status is currently Pending Admin Verification.');
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20 animate-in fade-in duration-200">
      {/* 1. TOP USER DASHBOARD BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Left: Back button + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMarketplace}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Website</span>
            </button>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-xs">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  User Control Dashboard
                </h1>
                <p className="text-[11px] text-slate-500">
                  Manage your posted properties, approvals & buyer inquiries
                </p>
              </div>
            </div>
          </div>

          {/* Right: User Role & Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
            {/* Post Property Quick CTA Button */}
            <button
              onClick={onNavigateToPostProperty}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-black shadow-md shadow-blue-900/20 transition-all cursor-pointer transform active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post New Property</span>
              <span className="px-1.5 py-0.2 text-[9px] font-black uppercase rounded-full bg-emerald-400 text-slate-950">
                FREE
              </span>
            </button>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer border border-slate-200"
                title="Switch Account Role"
              >
                <RefreshCw className="w-3 h-3 text-slate-500" />
                <span>Role: <strong>{user.role}</strong></span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <div className="p-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    Switch Persona:
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onUpdateUserRole('Owner');
                      setRoleSwitcherOpen(false);
                      showToast('Persona switched to Property Owner');
                    }}
                    className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                  >
                    <Building className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">Property Owner / Seller</div>
                      <div className="text-[10px] text-slate-500">Post villas, monitor approvals & leads</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onUpdateUserRole('Agent');
                      setRoleSwitcherOpen(false);
                      showToast('Persona switched to Real Estate Agent / Broker');
                    }}
                    className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">Agent / Broker</div>
                      <div className="text-[10px] text-slate-500">Multiple inventory listings & client inquiries</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onUpdateUserRole('Buyer');
                      setRoleSwitcherOpen(false);
                      showToast('Persona switched to Buyer / Tenant');
                    }}
                    className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">Buyer / Tenant</div>
                      <div className="text-[10px] text-slate-500">Saved properties, inquiries & visits</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* 2. USER WELCOME BANNER & STATS CARDS */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-300/40 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Welcome, {user.name}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-2xs backdrop-blur-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Verified {user.role}</span>
                  </span>
                </div>
                <p className="text-xs text-blue-200 mt-1.5 flex items-center gap-2 flex-wrap">
                  <span>Email: <strong className="text-white">{user.email}</strong></span>
                  {cleanUserPhone ? <span>• Phone: <strong className="text-white">{cleanUserPhone}</strong></span> : null}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToPostProperty}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-950/40 border border-sky-300/30 transition-all cursor-pointer transform active:scale-95 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>Post Another Property</span>
                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded-full bg-emerald-400 text-slate-950">
                  FREE
                </span>
              </button>
            </div>
          </div>

          {/* Real-time Status Metric Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
            {/* Total Posted */}
            <div 
              onClick={() => { setActiveTab('my-properties'); setStatusFilter('all'); }}
              className="bg-white/10 hover:bg-white/15 p-3.5 sm:p-4 rounded-2xl border border-white/10 cursor-pointer transition-colors"
            >
              <div className="text-xs text-blue-200 font-bold">Total Properties</div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">{myProperties.length}</div>
              <div className="text-[10px] text-blue-300 mt-0.5">Submitted by you</div>
            </div>

            {/* Pending Admin Review */}
            <div 
              onClick={() => { setActiveTab('my-properties'); setStatusFilter('pending'); }}
              className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-amber-500/20 border-amber-400'
                  : 'bg-white/10 hover:bg-white/15 border-white/10'
              }`}
            >
              <div className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Review</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{pendingCount}</div>
              <div className="text-[10px] text-amber-200/80 mt-0.5">Under Admin Verification</div>
            </div>

            {/* Live on Website */}
            <div 
              onClick={() => { setActiveTab('my-properties'); setStatusFilter('approved'); }}
              className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-colors ${
                statusFilter === 'approved'
                  ? 'bg-emerald-500/20 border-emerald-400'
                  : 'bg-white/10 hover:bg-white/15 border-white/10'
              }`}
            >
              <div className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Live on Website</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{approvedCount}</div>
              <div className="text-[10px] text-emerald-200/80 mt-0.5">Approved & Searchable</div>
            </div>

            {/* Rejected / Needs Edit */}
            <div 
              onClick={() => { setActiveTab('my-properties'); setStatusFilter('rejected'); }}
              className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-colors ${
                statusFilter === 'rejected'
                  ? 'bg-rose-500/20 border-rose-400'
                  : 'bg-white/10 hover:bg-white/15 border-white/10'
              }`}
            >
              <div className="text-xs text-rose-300 font-bold flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span>Rejected</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">{rejectedCount}</div>
              <div className="text-[10px] text-rose-200/80 mt-0.5">Requires Revision</div>
            </div>
          </div>
        </div>

        {/* 3. MAIN NAVIGATION TABS */}
        <div className="flex border-b border-slate-200 overflow-x-auto gap-2 pb-px no-scrollbar">
          <button
            onClick={() => setActiveTab('my-properties')}
            className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'my-properties'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-2xl shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>My Posted Properties</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-blue-100 text-blue-800">
              {myProperties.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'leads'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-2xl shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Buyer Inquiries & Leads</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800">
              {userInquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('shortlist')}
            className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'shortlist'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-2xl shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Shortlist</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-slate-200 text-slate-800">
              {shortlist.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-2xl shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </button>
        </div>

        {/* 4. TAB CONTENT 1: MY POSTED PROPERTIES & STATUS */}
        {activeTab === 'my-properties' && (
          <div className="space-y-5">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                    statusFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All ({myProperties.length})
                </button>

                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    statusFilter === 'pending'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>Pending Admin Review ({pendingCount})</span>
                </button>

                <button
                  onClick={() => setStatusFilter('approved')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    statusFilter === 'approved'
                      ? 'bg-emerald-600 text-white font-black shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Live on Website ({approvedCount})</span>
                </button>

                <button
                  onClick={() => setStatusFilter('rejected')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    statusFilter === 'rejected'
                      ? 'bg-rose-600 text-white font-black shadow-xs'
                      : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <XCircle className="w-3 h-3" />
                  <span>Rejected ({rejectedCount})</span>
                </button>

                <button
                  onClick={() => setStatusFilter('sold')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    statusFilter === 'sold'
                      ? 'bg-blue-600 text-white font-black shadow-xs'
                      : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  <span>Sold Out ({soldCount})</span>
                </button>
              </div>

              {/* Search input */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search your listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Properties List */}
            {displayedProperties.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200 shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {myProperties.length === 0
                    ? 'You have not posted any property yet'
                    : 'No properties found with this filter'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                  {myProperties.length === 0
                    ? 'Post your luxury villa, apartment, or commercial plot for free with zero brokerage. Once submitted, our Admin verifies it before publishing live.'
                    : 'Try changing your status filter or clearing the search query to see all your posted listings.'}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                  <button
                    onClick={onNavigateToPostProperty}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Property For Free (4 Easy Steps)</span>
                  </button>

                  {myProperties.length === 0 && (
                    <button
                      onClick={handleCreateSampleListing}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm border border-slate-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                      title="Quickly add 1 sample listing to test the admin approval workflow"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>1-Click Test Listing (For Testing Approvals)</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {displayedProperties.map((prop) => {
                  const isPending = prop.approvalStatus === 'pending';
                  const isRejected = prop.approvalStatus === 'rejected';
                  const isApproved = !prop.approvalStatus || prop.approvalStatus === 'approved';

                  return (
                    <div
                      key={prop.id}
                      className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden p-5 sm:p-6"
                    >
                      {/* Top Real-time Status Alert Banner */}
                      <div className="mb-4">
                        {isPending && (
                          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3">
                            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-black text-xs text-amber-900 uppercase tracking-wide">
                                  ⏳ Under Admin Moderation Review
                                </span>
                                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                                  Pending Verification
                                </span>
                              </div>
                              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                                Your property submission has been logged and sent to Administrator (<strong>{BRAND_CONFIG.email}</strong>). Once verified, it will automatically go live on the public website and start receiving buyer leads.
                              </p>
                            </div>
                          </div>
                        )}

                        {isApproved && (
                          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-black text-xs text-emerald-900 uppercase tracking-wide">
                                  ✅ Verified & Live on Website
                                </span>
                                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">
                                  Publicly Visible
                                </span>
                              </div>
                              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                                Admin has verified and published this property. Buyers and tenants searching in {prop.city} can now see your listing and call your phone number directly.
                              </p>
                            </div>
                          </div>
                        )}

                        {isRejected && (
                          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-black text-xs text-rose-900 uppercase tracking-wide">
                                  ❌ Rejected by Admin (Revision Needed)
                                </span>
                                <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded-md">
                                  Action Required
                                </span>
                              </div>
                              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                                This submission was not approved by the administrator. Please click <strong>"Edit Property Details"</strong> below to check pricing, location, or photos and save updates.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Property Details Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        {/* Media Thumbnail (4 cols) */}
                        <div className="lg:col-span-4 relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img
                            src={prop.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                            alt={prop.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-md bg-slate-900/80 text-white backdrop-blur-xs">
                              {prop.propertyType}
                            </span>
                            {prop.isSoldOrRented && (
                              <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-md bg-rose-600 text-white shadow-xs">
                                Sold Out
                              </span>
                            )}
                          </div>
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded bg-black/70 text-white">
                            {prop.images.length} Photos
                          </span>
                        </div>

                        {/* Details (5 cols) */}
                        <div className="lg:col-span-5 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-800 uppercase">
                              For {prop.category === 'rent' ? 'Rent' : 'Sale'}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Submitted: {prop.createdAt}
                            </span>
                          </div>

                          <h4 className="text-base sm:text-lg font-black text-slate-900 line-clamp-2 leading-snug">
                            {prop.title}
                          </h4>

                          <div className="text-xl font-black text-blue-700">
                            {prop.priceDisplay}
                            <span className="text-xs text-slate-500 font-normal ml-2">
                              ({prop.carpetAreaSqFt} sq.ft carpet)
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{prop.address || `${prop.locality}, ${prop.city}`}</span>
                          </div>

                          {/* Quick spec pills */}
                          <div className="flex items-center gap-2 pt-1 flex-wrap text-xs text-slate-600">
                            <span className="px-2 py-1 bg-slate-100 rounded-lg font-semibold">{prop.bedrooms} BHK</span>
                            <span className="px-2 py-1 bg-slate-100 rounded-lg font-semibold">{prop.bathrooms} Baths</span>
                            <span className="px-2 py-1 bg-slate-100 rounded-lg font-semibold">{prop.furnishing}</span>
                            <span className="px-2 py-1 bg-slate-100 rounded-lg font-semibold">{prop.possession}</span>
                          </div>
                        </div>

                        {/* User Actions (3 cols) */}
                        <div className="lg:col-span-3 flex flex-col gap-2 pt-3 lg:pt-0">
                          {/* 1. EDIT BUTTON */}
                          <button
                            onClick={() => setEditingProperty(prop)}
                            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Edit Property Details</span>
                          </button>

                          {/* 2. TOGGLE SOLD STATUS */}
                          <button
                            onClick={() => handleToggleSold(prop)}
                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                              prop.isSoldOrRented
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            <Tag className="w-3.5 h-3.5" />
                            <span>{prop.isSoldOrRented ? 'Mark as Available' : 'Mark as Sold Out'}</span>
                          </button>

                          {/* 3. PREVIEW ON WEBSITE */}
                          <button
                            onClick={() => onSelectProperty(prop)}
                            className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 border border-blue-200 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview Full Page</span>
                          </button>

                          {/* 4. DELETE LISTING */}
                          <button
                            onClick={() => setDeleteConfirmId(prop.id)}
                            className="w-full py-2 px-4 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Listing</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 5. TAB CONTENT 2: BUYER INQUIRIES & LEADS */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>Buyer Inquiries & Leads for Your Properties</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Whenever buyers on VillaSell submit an inquiry or request a tour for your verified properties, their direct details appear here.
              </p>
            </div>

            {userInquiries.length === 0 ? (
              <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-slate-200">
                <Mail className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No Inquiries Received Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Once your properties are approved and live, buyers searching in your city will be able to contact you directly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {userInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{inq.userName}</span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Inquiry for: <strong className="text-slate-800">{inq.propertyTitle}</strong>
                      </p>
                      {inq.message && (
                        <p className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 mt-2 italic">
                          "{inq.message}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${inq.userPhone}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Buyer</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. TAB CONTENT 3: SAVED SHORTLIST */}
        {activeTab === 'shortlist' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                <span>Your Saved Shortlisted Properties</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Properties you have saved while browsing VillaSell across India.
              </p>
            </div>

            {shortlistedProps.length === 0 ? (
              <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-slate-200">
                <Heart className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No Shortlisted Homes Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Click the heart icon on any villa or apartment on the home page to save it here for later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shortlistedProps.map((p) => (
                  <div
                    key={p.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-[16/10] relative">
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => onToggleShortlist(p.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-rose-500 cursor-pointer shadow-xs"
                      >
                        <Heart className="w-4 h-4 fill-rose-500" />
                      </button>
                    </div>
                    <div className="p-3.5 space-y-1.5">
                      <div className="font-black text-sm text-blue-700">{p.priceDisplay}</div>
                      <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{p.title}</h4>
                      <p className="text-[11px] text-slate-500">{p.locality}, {p.city}</p>
                      <button
                        onClick={() => onSelectProperty(p)}
                        className="w-full mt-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. TAB CONTENT 4: MY ACCOUNT PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>My Profile & Account Details</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your authenticated account credentials on the VillaSell platform.
                </p>
              </div>

              {!isEditingProfile && (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {!isEditingProfile ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Full Name</span>
                  <div className="text-sm font-extrabold text-slate-900 mt-1">
                    {user.name || resolveUserDisplayName(null, user.email)}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Email Address</span>
                  <div className="text-sm font-extrabold text-slate-900 mt-1 break-all">
                    {user.email || '—'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Phone Number</span>
                    {!cleanUserPhone && (
                      <span className="text-[10px] text-blue-600 font-bold cursor-pointer hover:underline" onClick={() => setIsEditingProfile(true)}>
                        + Add Phone
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 mt-1">
                    {cleanUserPhone ? (
                      cleanUserPhone
                    ) : (
                      <span className="text-slate-400 font-normal italic">
                        — (Not added. Click "Edit Profile" to add)
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Active Persona</span>
                  <div className="text-sm font-extrabold text-blue-700 mt-1">{user.role}</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileNameInput}
                      onChange={(e) => setProfileNameInput(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address (Authenticated)
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-xs font-bold cursor-not-allowed"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number (Optional - Only shown if you enter it)
                    </label>
                    <input
                      type="tel"
                      value={profilePhoneInput}
                      onChange={(e) => setProfilePhoneInput(e.target.value)}
                      placeholder="e.g. +91 98765 43210 (Leave blank if you don't wish to share)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Leave this blank if you don't want your phone displayed. Admin helpline is never shown in your profile.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm cursor-pointer transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setProfileNameInput(user.name || resolveUserDisplayName(null, user.email));
                      setProfilePhoneInput(cleanUserPhone);
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-blue-950">Need Help or Priority Moderation?</h4>
                <p className="text-xs text-blue-800 mt-0.5">
                  Contact the VillaSell official support desk at <strong className="text-blue-950">{BRAND_CONFIG.email}</strong> or Helpline <strong className="text-blue-950">{BRAND_CONFIG.phone}</strong>.
                </p>
              </div>
              <a
                href={BRAND_CONFIG.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 8. EDIT PROPERTY MODAL */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 text-slate-900 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <span>Edit Your Property Details</span>
              </h3>
              <button
                onClick={() => setEditingProperty(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold uppercase mb-1">Property Title</label>
                <input
                  type="text"
                  value={editingProperty.title}
                  onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold uppercase mb-1">Price Display (e.g. ₹1.85 Cr)</label>
                  <input
                    type="text"
                    value={editingProperty.priceDisplay}
                    onChange={(e) => setEditingProperty({ ...editingProperty, priceDisplay: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold uppercase mb-1">Carpet Area (sq.ft)</label>
                  <input
                    type="number"
                    value={editingProperty.carpetAreaSqFt}
                    onChange={(e) => setEditingProperty({ ...editingProperty, carpetAreaSqFt: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold uppercase mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editingProperty.postedBy?.phone || ''}
                    onChange={(e) => setEditingProperty({ 
                      ...editingProperty, 
                      postedBy: { ...editingProperty.postedBy, phone: e.target.value } 
                    })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold uppercase mb-1">Furnishing Status</label>
                  <select
                    value={editingProperty.furnishing}
                    onChange={(e) => setEditingProperty({ ...editingProperty, furnishing: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProperty.description}
                  onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center text-slate-900 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-slate-900">Delete This Listing?</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              This action cannot be undone. Your property listing will be permanently removed from your dashboard and the website.
            </p>
            <div className="flex gap-2.5 justify-center mt-5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 cursor-pointer shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
