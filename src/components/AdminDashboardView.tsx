import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Edit3, 
  Eye, 
  Search, 
  Filter, 
  ArrowLeft, 
  PlusCircle, 
  ExternalLink, 
  Mail, 
  Phone, 
  Sparkles, 
  Check, 
  X, 
  AlertCircle, 
  Play, 
  Video, 
  Image as ImageIcon,
  Send,
  RefreshCw,
  LogOut,
  MapPin,
  Calendar,
  Layers,
  Star
} from 'lucide-react';
import { 
  Property, 
  UserProfile, 
  PropertyInquiry, 
  AdminEmailNotification 
} from '../types/property';
import { BRAND_CONFIG, CITIES } from '../data/mockProperties';
import { CustomDropdown } from './CustomDropdown';
import { 
  updatePropertyInFirestore, 
  deletePropertyFromFirestore,
  updateNotificationStatus,
  getAdminEmailNotifications,
  deleteAdminNotificationById,
  deleteAdminNotificationByPropertyId,
  fetchAndCleanAdminNotifications,
  deduplicatePropertyList
} from '../services/firebase';

interface AdminDashboardViewProps {
  user: UserProfile;
  properties: Property[];
  onUpdateProperty: (updated: Property) => void;
  onDeleteProperty: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onBackToWebsite: () => void;
  onNavigateToPostProperty: () => void;
  onLogout: () => void;
  showToast: (msg: string) => void;
  inquiries?: PropertyInquiry[];
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  user,
  properties,
  onUpdateProperty,
  onDeleteProperty,
  onSelectProperty,
  onBackToWebsite,
  onNavigateToPostProperty,
  onLogout,
  showToast,
  inquiries = []
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'notifications' | 'inquiries'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Property Editing State
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Email Notifications State & Refresh
  const [notifications, setNotifications] = useState<AdminEmailNotification[]>(() => {
    return getAdminEmailNotifications();
  });
  const [isRefreshingAlerts, setIsRefreshingAlerts] = useState(false);

  const refreshNotifications = () => {
    setNotifications(getAdminEmailNotifications());
  };

  const handleRefreshAlerts = async () => {
    setIsRefreshingAlerts(true);
    try {
      const cleaned = await fetchAndCleanAdminNotifications(properties);
      setNotifications(cleaned);
      showToast('Admin email alerts refreshed & synchronized successfully!');
    } catch (err) {
      console.warn('Alert refresh notice:', err);
      setNotifications(getAdminEmailNotifications());
      showToast('Admin email alerts refreshed.');
    } finally {
      setIsRefreshingAlerts(false);
    }
  };

  // Derive Moderation Stats with Deduplication
  const pendingProperties = useMemo(() => {
    const list = properties.filter((p) => p.approvalStatus === 'pending');
    return deduplicatePropertyList(list);
  }, [properties]);

  const approvedProperties = useMemo(() => {
    const list = properties.filter((p) => !p.approvalStatus || p.approvalStatus === 'approved');
    return deduplicatePropertyList(list);
  }, [properties]);

  const rejectedProperties = useMemo(() => {
    const list = properties.filter((p) => p.approvalStatus === 'rejected');
    return deduplicatePropertyList(list);
  }, [properties]);

  // Combine stored notifications and any pending properties with strict deduplication & deleted filtering
  const displayNotifications = useMemo(() => {
    let deletedIds = new Set<string>();
    try {
      const deletedStr = localStorage.getItem('villasell_deleted_properties');
      if (deletedStr) {
        deletedIds = new Set(JSON.parse(deletedStr));
      }
    } catch {
      // ignore
    }

    // 1. Filter out deleted properties
    const activeList = notifications.filter(
      (n) => !deletedIds.has(n.propertyId) && !deletedIds.has(n.id)
    );

    // 2. Strict deduplication of stored notifications
    const seenPropIds = new Set<string>();
    const seenFingerprints = new Set<string>();
    const dedupedList: AdminEmailNotification[] = [];

    for (const notif of activeList) {
      if (seenPropIds.has(notif.propertyId)) continue;
      const fp = `${(notif.propertyTitle || '').trim().toLowerCase()}|${(notif.propertyLocality || '').trim().toLowerCase()}|${(notif.propertyPrice || '').trim().toLowerCase()}`;
      if (fp.length > 5 && seenFingerprints.has(fp)) continue;

      seenPropIds.add(notif.propertyId);
      if (fp.length > 5) seenFingerprints.add(fp);
      dedupedList.push(notif);
    }

    // 3. Fallback: Include any live pending property that doesn't yet have an alert
    pendingProperties.forEach((prop) => {
      if (deletedIds.has(prop.id)) return;
      const fp = `${(prop.title || '').trim().toLowerCase()}|${(prop.locality || '').trim().toLowerCase()}|${(prop.priceDisplay || '').trim().toLowerCase()}`;
      if (!seenPropIds.has(prop.id) && (fp.length <= 5 || !seenFingerprints.has(fp))) {
        seenPropIds.add(prop.id);
        if (fp.length > 5) seenFingerprints.add(fp);
        dedupedList.unshift({
          id: `notif-${prop.id}`,
          propertyId: prop.id,
          propertyTitle: prop.title,
          propertyCity: prop.city,
          propertyLocality: prop.locality,
          propertyPrice: prop.priceDisplay,
          submittedBy: {
            name: prop.postedBy?.name || 'Verified Owner',
            phone: prop.postedBy?.phone || BRAND_CONFIG.phone,
            role: prop.postedBy?.type || 'Owner',
          },
          adminEmail: BRAND_CONFIG.email,
          timestamp: prop.createdAt || new Date().toISOString(),
          status: 'pending',
          propertyThumbnail: prop.images[0],
        });
      }
    });

    return dedupedList;
  }, [notifications, pendingProperties]);

  // Filtered Properties for All Listings Tab
  const filteredListings = useMemo(() => {
    const list = properties.filter((prop) => {
      const matchSearch =
        prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCity = selectedCity === 'All Cities' || prop.city.toLowerCase() === selectedCity.toLowerCase();

      const currentStatus = prop.approvalStatus || 'approved';
      const matchStatus = statusFilter === 'all' || currentStatus === statusFilter;

      return matchSearch && matchCity && matchStatus;
    });
    return deduplicatePropertyList(list);
  }, [properties, searchTerm, selectedCity, statusFilter]);

  // Action: Approve Property
  const handleApprove = async (property: Property) => {
    const updated: Property = {
      ...property,
      approvalStatus: 'approved',
      isVerified: true
    };
    onUpdateProperty(updated);
    await updatePropertyInFirestore(property.id, { approvalStatus: 'approved', isVerified: true });
    updateNotificationStatus(property.id, 'approved');
    refreshNotifications();
    showToast(`Property "${property.title.slice(0, 28)}..." APPROVED & now live on public website!`);
  };

  // Action: Reject Property
  const handleReject = async (property: Property) => {
    const updated: Property = {
      ...property,
      approvalStatus: 'rejected'
    };
    onUpdateProperty(updated);
    await updatePropertyInFirestore(property.id, { approvalStatus: 'rejected' });
    updateNotificationStatus(property.id, 'rejected');
    refreshNotifications();
    showToast(`Property "${property.title.slice(0, 28)}..." marked as REJECTED.`);
  };

  // Action: Toggle Featured
  const handleToggleFeatured = async (property: Property) => {
    const updated: Property = {
      ...property,
      isFeatured: !property.isFeatured
    };
    onUpdateProperty(updated);
    await updatePropertyInFirestore(property.id, { isFeatured: updated.isFeatured });
    showToast(`Property featured status updated.`);
  };

  // Action: Delete Property (also instantly removes notification alert)
  const handleConfirmDelete = async (id: string) => {
    onDeleteProperty(id);
    await deletePropertyFromFirestore(id);
    await deleteAdminNotificationByPropertyId(id);
    setNotifications((prev) => prev.filter((n) => n.propertyId !== id && n.id !== id && !n.id.includes(id)));
    setDeleteConfirmId(null);
    showToast('Property permanently deleted & email alert removed.');
  };

  // Action: Save Edits
  const handleSaveEditForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    onUpdateProperty(editingProperty);
    await updatePropertyInFirestore(editingProperty.id, editingProperty);
    setEditingProperty(null);
    showToast('Property details updated and saved successfully!');
  };

  // Helper: Open mailto notification to Admin
  const openMailtoAlert = (notif: AdminEmailNotification) => {
    const subject = encodeURIComponent(`[VillaSell Approval Request] New Listing: ${notif.propertyTitle}`);
    const body = encodeURIComponent(
      `Hello Admin (${BRAND_CONFIG.name}),\n\nA new property submission requires your approval.\n\n` +
      `Property Title: ${notif.propertyTitle}\n` +
      `Location: ${notif.propertyLocality}, ${notif.propertyCity}\n` +
      `Price: ${notif.propertyPrice}\n` +
      `Submitted By: ${notif.submittedBy.name} (${notif.submittedBy.role})\n` +
      `Contact Phone: ${notif.submittedBy.phone}\n` +
      `Submission Time: ${new Date(notif.timestamp).toLocaleString()}\n\n` +
      `Please log into the VillaSell Admin Panel to review photos, videos, and approve or reject this listing.\n\n` +
      `Regards,\nVillaSell Automated Moderation System`
    );
    window.open(`mailto:${BRAND_CONFIG.email}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 pb-24">
      {/* 1. TOP ADMIN CONTROL HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Brand & Admin Shield */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-900/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                    Villa<span className="text-amber-400">Sell</span> Admin Portal
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
                    Super Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Logged in as <span className="text-amber-300 font-semibold">{user.email || BRAND_CONFIG.email}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            <button
              onClick={onNavigateToPostProperty}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-950/40 cursor-pointer transition-all active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post as Admin</span>
            </button>

            <button
              onClick={onBackToWebsite}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Website</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
              title="Logout from Admin Panel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. ADMIN STATS COUNTER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Pending Approvals (Pulse Highlight) */}
          <div 
            onClick={() => setActiveTab('pending')}
            className={`p-4 sm:p-5 rounded-3xl border cursor-pointer transition-all ${
              activeTab === 'pending'
                ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/20 shadow-lg shadow-amber-950/40'
                : 'bg-slate-800/80 border-slate-700/80 hover:border-amber-400/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Pending Review</span>
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-300">{pendingProperties.length}</span>
              {pendingProperties.length > 0 && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Requires admin approval to go live</p>
          </div>

          {/* Card 2: Live on Website */}
          <div 
            onClick={() => { setActiveTab('all'); setStatusFilter('approved'); }}
            className={`p-4 sm:p-5 rounded-3xl border cursor-pointer transition-all ${
              activeTab === 'all' && statusFilter === 'approved'
                ? 'bg-emerald-500/15 border-emerald-400 ring-2 ring-emerald-400/20 shadow-lg shadow-emerald-950/40'
                : 'bg-slate-800/80 border-slate-700/80 hover:border-emerald-400/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Live Listings</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-300">{approvedProperties.length}</span>
            <p className="text-[11px] text-slate-400 mt-1">Visible to public buyers & tenants</p>
          </div>

          {/* Card 3: Rejected / Inactive */}
          <div 
            onClick={() => { setActiveTab('all'); setStatusFilter('rejected'); }}
            className={`p-4 sm:p-5 rounded-3xl border cursor-pointer transition-all ${
              activeTab === 'all' && statusFilter === 'rejected'
                ? 'bg-rose-500/15 border-rose-400 ring-2 ring-rose-400/20 shadow-lg shadow-rose-950/40'
                : 'bg-slate-800/80 border-slate-700/80 hover:border-rose-400/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Rejected</span>
              <div className="w-8 h-8 rounded-xl bg-rose-400/20 text-rose-400 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-rose-300">{rejectedProperties.length}</span>
            <p className="text-[11px] text-slate-400 mt-1">Hidden from public search</p>
          </div>

          {/* Card 4: Email Alerts & Notifications */}
          <div 
            onClick={() => setActiveTab('notifications')}
            className={`p-4 sm:p-5 rounded-3xl border cursor-pointer transition-all ${
              activeTab === 'notifications'
                ? 'bg-sky-500/15 border-sky-400 ring-2 ring-sky-400/20 shadow-lg shadow-sky-950/40'
                : 'bg-slate-800/80 border-slate-700/80 hover:border-sky-400/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Email Alerts</span>
              <div className="w-8 h-8 rounded-xl bg-sky-400/20 text-sky-400 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-sky-300">
              {displayNotifications.length}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Sent to {BRAND_CONFIG.email}</p>
          </div>
        </div>

        {/* 3. NAVIGATION TABS */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Moderation Queue</span>
            {pendingProperties.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-950 text-amber-300">
                {pendingProperties.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('all'); setStatusFilter('all'); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-950/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>All Properties ({properties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-sky-600 text-white font-black shadow-lg shadow-sky-950/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Admin Email Alerts</span>
            {displayNotifications.filter(n => n.status === 'pending').length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                {displayNotifications.filter(n => n.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {/* 4. MAIN CONTENT PANELS */}
        <div className="mt-6">
          {/* TAB 1: PENDING APPROVALS QUEUE */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>Pending Moderation Queue</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      {pendingProperties.length} Properties Waiting
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Newly posted properties do NOT appear on the public website until you click "Approve & Publish".
                  </p>
                </div>
              </div>

              {pendingProperties.length === 0 ? (
                <div className="text-center py-16 px-4 bg-slate-800/40 rounded-3xl border border-slate-800">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">All Caught Up! No Pending Approvals</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                    Every property listing has been reviewed. When a user submits a new listing, it will appear here immediately for your approval.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {pendingProperties.map((prop) => (
                    <div 
                      key={prop.id}
                      className="bg-slate-800/90 border-2 border-amber-500/40 hover:border-amber-400 rounded-3xl p-5 sm:p-6 shadow-xl transition-all"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        {/* Media Preview (4 cols) */}
                        <div className="lg:col-span-4 space-y-3">
                          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 group">
                            {prop.videos && prop.videos.length > 0 ? (
                              <div className="relative w-full h-full">
                                <video 
                                  src={prop.videos[0]} 
                                  controls 
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                                  <Video className="w-3 h-3" /> Walkthrough Video
                                </span>
                              </div>
                            ) : (
                              <img 
                                src={prop.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'} 
                                alt={prop.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            )}
                            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                              {prop.images.length} Photos
                            </span>
                          </div>

                          {/* Thumbnails row */}
                          {prop.images.length > 1 && (
                            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                              {prop.images.slice(0, 5).map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt="Thumb"
                                  className="w-12 h-10 object-cover rounded-lg border border-slate-700 shrink-0"
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Property Details (5 cols) */}
                        <div className="lg:col-span-5 space-y-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-amber-400 text-slate-950">
                              PENDING APPROVAL
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-blue-900/60 text-blue-300 border border-blue-700/50">
                              {prop.propertyType}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-700 text-slate-300">
                              {prop.category.toUpperCase()}
                            </span>
                          </div>

                          <h3 className="text-lg font-black text-white leading-snug">
                            {prop.title}
                          </h3>

                          <div className="text-xl font-black text-emerald-400">
                            {prop.priceDisplay}
                            <span className="text-xs font-normal text-slate-400 ml-2">
                              ({prop.carpetAreaSqFt} sq.ft carpet • ₹{prop.pricePerSqFt}/sq.ft)
                            </span>
                          </div>

                          <div className="flex items-start gap-1.5 text-xs text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{prop.address || `${prop.locality}, ${prop.city}`}</span>
                          </div>

                          {/* Posted By Contact Details */}
                          <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-700/80 text-xs space-y-1.5">
                            <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                              Submitted By:
                            </div>
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="font-extrabold text-white text-sm">
                                {prop.postedBy?.name || 'Owner'} ({prop.postedBy?.type || 'Owner'})
                              </span>
                              <a
                                href={`tel:${prop.postedBy?.phone || BRAND_CONFIG.phone}`}
                                className="inline-flex items-center gap-1 text-emerald-400 font-bold hover:underline"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{prop.postedBy?.phone || BRAND_CONFIG.phone}</span>
                              </a>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              <span>Submitted on: {prop.createdAt}</span>
                            </div>
                          </div>
                        </div>

                        {/* Admin Action Buttons (3 cols) */}
                        <div className="lg:col-span-3 flex flex-col gap-2 pt-2 lg:pt-0">
                          {/* 1. APPROVE BUTTON */}
                          <button
                            onClick={() => handleApprove(prop)}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer transition-all active:scale-95"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve & Publish Live</span>
                          </button>

                          {/* 2. EDIT BUTTON */}
                          <button
                            onClick={() => setEditingProperty(prop)}
                            className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold text-xs flex items-center justify-center gap-2 border border-slate-600 cursor-pointer transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Edit Property Details</span>
                          </button>

                          {/* 3. REJECT BUTTON */}
                          <button
                            onClick={() => handleReject(prop)}
                            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-rose-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/50 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Reject Submission</span>
                          </button>

                          {/* 4. PREVIEW MODAL / PUBLIC PAGE */}
                          <button
                            onClick={() => onSelectProperty(prop)}
                            className="w-full py-2 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview Full Page</span>
                          </button>

                          {/* 5. DELETE BUTTON */}
                          <button
                            onClick={() => setDeleteConfirmId(prop.id)}
                            className="w-full py-2 px-4 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete Permanently</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ALL PROPERTIES CATALOG */}
          {activeTab === 'all' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by title, locality, city, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="w-full md:w-48">
                  <CustomDropdown
                    value={selectedCity}
                    onChange={(val) => setSelectedCity(val)}
                    options={CITIES}
                    theme="dark"
                    size="sm"
                  />
                </div>

                <div className="w-full md:w-44">
                  <CustomDropdown
                    value={statusFilter}
                    onChange={(val) => setStatusFilter(val as any)}
                    options={[
                      { value: 'all', label: 'All Statuses' },
                      { value: 'approved', label: 'Live / Approved' },
                      { value: 'pending', label: 'Pending Review' },
                      { value: 'rejected', label: 'Rejected' },
                    ]}
                    theme="dark"
                    size="sm"
                  />
                </div>
              </div>

              {/* Table / List View */}
              <div className="bg-slate-800/70 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-extrabold border-b border-slate-700">
                      <tr>
                        <th className="p-3.5 sm:p-4">Property</th>
                        <th className="p-3.5 sm:p-4">City / Locality</th>
                        <th className="p-3.5 sm:p-4">Price</th>
                        <th className="p-3.5 sm:p-4">Status</th>
                        <th className="p-3.5 sm:p-4">Featured</th>
                        <th className="p-3.5 sm:p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {filteredListings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-slate-400">
                            No properties found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredListings.map((prop) => (
                          <tr key={prop.id} className="hover:bg-slate-750 transition-colors">
                            <td className="p-3.5 sm:p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prop.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                                  alt="Thumb"
                                  className="w-12 h-10 object-cover rounded-lg border border-slate-700 shrink-0"
                                />
                                <div>
                                  <div className="font-extrabold text-white text-xs line-clamp-1">
                                    {prop.title}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    {prop.propertyType} • {prop.bedrooms > 0 ? `${prop.bedrooms} BHK` : ''}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="p-3.5 sm:p-4 text-slate-300">
                              <span className="font-semibold block">{prop.city}</span>
                              <span className="text-[11px] text-slate-500">{prop.locality}</span>
                            </td>

                            <td className="p-3.5 sm:p-4 font-black text-emerald-400">
                              {prop.priceDisplay}
                            </td>

                            <td className="p-3.5 sm:p-4">
                              {(!prop.approvalStatus || prop.approvalStatus === 'approved') && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-800">
                                  <Check className="w-3 h-3" /> Live
                                </span>
                              )}
                              {prop.approvalStatus === 'pending' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-950 text-amber-300 border border-amber-800">
                                  <Clock className="w-3 h-3" /> Pending
                                </span>
                              )}
                              {prop.approvalStatus === 'rejected' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-950 text-rose-300 border border-rose-800">
                                  <X className="w-3 h-3" /> Rejected
                                </span>
                              )}
                            </td>

                            <td className="p-3.5 sm:p-4">
                              <button
                                onClick={() => handleToggleFeatured(prop)}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  prop.isFeatured
                                    ? 'bg-amber-400/20 text-amber-400 border-amber-400/40'
                                    : 'bg-slate-700/50 text-slate-500 border-slate-600 hover:text-white'
                                }`}
                                title="Toggle Featured"
                              >
                                <Star className={`w-3.5 h-3.5 ${prop.isFeatured ? 'fill-amber-400' : ''}`} />
                              </button>
                            </td>

                            <td className="p-3.5 sm:p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {prop.approvalStatus === 'pending' && (
                                  <button
                                    onClick={() => handleApprove(prop)}
                                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                                    title="Approve Listing"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <button
                                  onClick={() => setEditingProperty(prop)}
                                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-blue-600 text-slate-200 hover:text-white transition-colors cursor-pointer"
                                  title="Edit Property"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => onSelectProperty(prop)}
                                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                                  title="View Public Page"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => setDeleteConfirmId(prop.id)}
                                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                  title="Delete Property"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADMIN EMAIL NOTIFICATIONS & LOGS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-sky-400" />
                    <span>Post Property Email Notification Records</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Target Admin Email: <span className="text-sky-300 font-bold">{BRAND_CONFIG.email}</span>
                  </p>
                </div>

                <button
                  onClick={handleRefreshAlerts}
                  disabled={isRefreshingAlerts}
                  className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-all disabled:opacity-50"
                  title="Refresh and sync admin email alerts"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingAlerts ? 'animate-spin text-amber-400' : ''}`} />
                  <span>{isRefreshingAlerts ? 'Refreshing Alerts...' : 'Refresh Alerts'}</span>
                </button>
              </div>

              {displayNotifications.length === 0 ? (
                <div className="text-center py-16 px-4 bg-slate-800/40 rounded-3xl border border-slate-800">
                  <Mail className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-white">No Email Notifications Logged Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    When someone submits a property through the Post Property form, an instant alert will be dispatched to {BRAND_CONFIG.email} and recorded here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {displayNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-sm text-white">{notif.propertyTitle}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              notif.status === 'approved'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                : notif.status === 'rejected'
                                ? 'bg-rose-950 text-rose-300 border border-rose-700'
                                : 'bg-amber-950 text-amber-300 border border-amber-700'
                            }`}>
                              {notif.status.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 mt-1">
                            {notif.propertyLocality}, {notif.propertyCity} • <span className="text-emerald-400 font-bold">{notif.propertyPrice}</span>
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 flex-wrap">
                            <span>From: <strong className="text-slate-200">{notif.submittedBy.name}</strong> ({notif.submittedBy.phone})</span>
                            <span>•</span>
                            <span>{new Date(notif.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap">
                        {notif.status === 'pending' && (
                          <button
                            onClick={() => {
                              const targetProp = properties.find(p => p.id === notif.propertyId);
                              if (targetProp) {
                                handleApprove(targetProp);
                              } else {
                                updateNotificationStatus(notif.propertyId, 'approved');
                                refreshNotifications();
                                showToast('Marked notification as approved.');
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        <button
                          onClick={() => openMailtoAlert(notif)}
                          className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-600 cursor-pointer"
                          title="Open in your default Email Client"
                        >
                          <Send className="w-3 h-3 text-sky-400" />
                          <span>Open in Mail</span>
                        </button>

                        <button
                          onClick={async () => {
                            await deleteAdminNotificationById(notif.id);
                            if (notif.propertyId) {
                              await deleteAdminNotificationByPropertyId(notif.propertyId);
                            }
                            setNotifications((prev) => prev.filter((n) => n.id !== notif.id && n.propertyId !== notif.propertyId));
                            showToast(`Alert for "${notif.propertyTitle.slice(0, 22)}..." removed.`);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 font-bold text-xs flex items-center gap-1 border border-slate-700 hover:border-rose-700/60 transition-colors cursor-pointer"
                          title="Delete this alert"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete Alert</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 5. EDIT PROPERTY MODAL */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-400" />
                <span>Edit Property Details</span>
              </h3>
              <button
                onClick={() => setEditingProperty(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Property Title</label>
                <input
                  type="text"
                  value={editingProperty.title}
                  onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">City</label>
                  <CustomDropdown
                    value={editingProperty.city}
                    onChange={(val) => setEditingProperty({ ...editingProperty, city: val })}
                    options={CITIES.filter(c => c !== 'All Cities')}
                    theme="dark"
                    size="sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Locality</label>
                  <input
                    type="text"
                    value={editingProperty.locality}
                    onChange={(e) => setEditingProperty({ ...editingProperty, locality: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Exact Address</label>
                <input
                  type="text"
                  value={editingProperty.address}
                  onChange={(e) => setEditingProperty({ ...editingProperty, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    value={editingProperty.price}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      const display = num >= 10000000 ? `₹ ${(num / 10000000).toFixed(2)} Cr` : `₹ ${(num / 100000).toFixed(2)} Lakhs`;
                      setEditingProperty({ ...editingProperty, price: num, priceDisplay: display });
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Carpet Area (sq.ft)</label>
                  <input
                    type="number"
                    value={editingProperty.carpetAreaSqFt}
                    onChange={(e) => setEditingProperty({ ...editingProperty, carpetAreaSqFt: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Approval Status</label>
                  <CustomDropdown
                    value={editingProperty.approvalStatus || 'approved'}
                    onChange={(val) => setEditingProperty({ ...editingProperty, approvalStatus: val as any })}
                    options={[
                      { value: 'approved', label: 'Approved (Live)' },
                      { value: 'pending', label: 'Pending Review' },
                      { value: 'rejected', label: 'Rejected' },
                    ]}
                    theme="dark"
                    size="sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProperty.description}
                  onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer shadow-lg shadow-blue-950/50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/50 rounded-3xl max-w-sm w-full p-6 text-center text-white shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-white">Delete This Property Listing?</h4>
            <p className="text-xs text-slate-400 mt-1">
              This action cannot be undone. The property will be permanently removed from Firestore and search catalog.
            </p>
            <div className="flex gap-2.5 justify-center mt-5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 cursor-pointer shadow-md shadow-rose-950/50"
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
