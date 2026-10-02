import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Star, 
  Users, 
  ShieldCheck, 
  Eye, 
  MessageSquare, 
  Search, 
  Filter, 
  AlertTriangle, 
  Edit3, 
  Check, 
  Clock, 
  ExternalLink,
  PlusCircle,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  X
} from 'lucide-react';
import { Property, UserProfile, PropertyInquiry } from '../../types/property';
import { MOCK_USER_METRICS } from '../../data/mockDashboardData';

interface OwnerAdminDashboardProps {
  user: UserProfile;
  properties: Property[];
  onUpdateProperty: (updated: Property) => void;
  onDeleteProperty: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  inquiries: PropertyInquiry[];
  onNavigateToPostProperty: () => void;
  showToast: (msg: string) => void;
}

export const OwnerAdminDashboard: React.FC<OwnerAdminDashboardProps> = ({
  user,
  properties,
  onUpdateProperty,
  onDeleteProperty,
  onSelectProperty,
  inquiries,
  onNavigateToPostProperty,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'moderation' | 'all-properties' | 'users' | 'inquiries'>('moderation');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Derive Moderation & Overview Stats
  const totalProperties = properties.length;
  const pendingApprovals = properties.filter(p => p.approvalStatus === 'pending');
  const approvedProperties = properties.filter(p => p.approvalStatus !== 'pending' && p.approvalStatus !== 'rejected');
  const featuredProperties = properties.filter(p => p.isFeatured);
  const totalViews = properties.reduce((acc, p) => acc + (p.viewsCount || 140), 0);
  const totalInquiries = inquiries.length;

  // Filtered properties for global management
  const displayedProperties = properties.filter((prop) => {
    const matchesSearch = 
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = filterCity === 'All' || prop.city.toLowerCase() === filterCity.toLowerCase();
    
    const status = prop.approvalStatus || 'approved';
    const matchesStatus = filterStatus === 'all' || status === filterStatus;

    return matchesSearch && matchesCity && matchesStatus;
  });

  const handleApprove = (prop: Property) => {
    const updated: Property = {
      ...prop,
      approvalStatus: 'approved',
      isVerified: true
    };
    onUpdateProperty(updated);
    showToast(`Property "${prop.title.slice(0, 24)}..." approved & live.`);
  };

  const handleReject = (prop: Property) => {
    const updated: Property = {
      ...prop,
      approvalStatus: 'rejected'
    };
    onUpdateProperty(updated);
    showToast(`Property "${prop.title.slice(0, 24)}..." marked as rejected.`);
  };

  const handleToggleFeatured = (prop: Property) => {
    const updated: Property = {
      ...prop,
      isFeatured: !prop.isFeatured
    };
    onUpdateProperty(updated);
    showToast(`Property featured status updated.`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;
    onUpdateProperty(editingProperty);
    setEditingProperty(null);
    showToast('Property details saved successfully!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP OVERVIEW STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Properties */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Listings</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalProperties}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +12% this week
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across all verified cities</p>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Approvals</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{pendingApprovals.length}</span>
            <span className="text-xs font-bold text-amber-700">Requires review</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Direct owner & agent submissions</p>
        </div>

        {/* Total Views / Reach */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Views / Traffic</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalViews.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +18.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">High buyer engagement rate</p>
        </div>

        {/* Active Inquiries & Leads */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inquiries & Leads</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalInquiries}</span>
            <span className="text-xs font-bold text-emerald-600">Active leads</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Zero brokerage connections</p>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex flex-wrap gap-1.5 shadow-xs">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'moderation'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Moderation Queue</span>
          {pendingApprovals.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
              {pendingApprovals.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('all-properties')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'all-properties'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Global Property Directory ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & Agent Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'inquiries'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Platform Inquiries ({inquiries.length})</span>
        </button>
      </div>

      {/* 3. TAB 1: MODERATION QUEUE */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Listing Moderation Queue</h2>
              <p className="text-xs text-slate-500">
                Review submitted properties to ensure accurate pricing, authentic photos, and RERA compliance.
              </p>
            </div>
            <button
              onClick={onNavigateToPostProperty}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Admin Listing</span>
            </button>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">All Submitted Listings Are Up to Date!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                There are currently no listings pending review. You can manage or edit live listings from the Global Directory tab.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pendingApprovals.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white rounded-3xl border border-amber-200 p-5 shadow-xs space-y-4 hover:border-amber-300 transition-colors"
                >
                  <div className="flex gap-4 items-start">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-24 h-24 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800">
                          Pending Approval
                        </span>
                        <span className="text-xs font-extrabold text-blue-700">{prop.priceDisplay}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 truncate mt-1">{prop.title}</h4>
                      <p className="text-xs text-slate-500 truncate">{prop.locality}, {prop.city}</p>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Posted by: <strong className="text-slate-800">{prop.postedBy?.name || 'Owner'}</strong> ({prop.postedBy?.type})
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    <div>Area: <strong>{prop.carpetAreaSqFt} sq.ft</strong></div>
                    <div>Bedrooms: <strong>{prop.bedrooms} BHK</strong></div>
                    <div>Category: <strong className="capitalize">{prop.category}</strong></div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleApprove(prop)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                    <button
                      onClick={() => handleReject(prop)}
                      className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => onSelectProperty(prop)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
                      title="Preview Property"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 2: GLOBAL PROPERTY DIRECTORY */}
      {activeTab === 'all-properties' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Global Property Directory</h2>
              <p className="text-xs text-slate-500">
                Full administrative control to edit, feature, verify or remove any listing on VillaSell.
              </p>
            </div>
            <button
              onClick={onNavigateToPostProperty}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Listing</span>
            </button>
          </div>

          {/* Search and Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, locality or ID..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
              />
            </div>

            <div>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
              >
                <option value="All">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Lucknow">Lucknow</option>
                <option value="Varanasi">Varanasi</option>
                <option value="Prayagraj">Prayagraj</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
              </select>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
              >
                <option value="all">All Moderation Statuses</option>
                <option value="approved">Approved & Live</option>
                <option value="pending">Pending Review</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Properties Table / Cards */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Posted By</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedProperties.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                        No properties found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    displayedProperties.map((prop) => (
                      <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prop.images[0]}
                              alt={prop.title}
                              className="w-12 h-12 rounded-xl object-cover shrink-0"
                            />
                            <div>
                              <div className="font-extrabold text-slate-900 max-w-[200px] truncate">
                                {prop.title}
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium">
                                {prop.propertyType} • {prop.bedrooms} BHK
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800">{prop.city}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{prop.locality}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-extrabold text-blue-700">{prop.priceDisplay}</div>
                          <div className="text-[10px] text-slate-500">₹{prop.pricePerSqFt?.toLocaleString()}/sq.ft</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800">{prop.postedBy?.name || 'Owner'}</div>
                          <div className="text-[10px] text-slate-500 uppercase">{prop.postedBy?.type}</div>
                        </td>

                        <td className="py-3 px-4">
                          {prop.approvalStatus === 'pending' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800">
                              Pending
                            </span>
                          ) : prop.approvalStatus === 'rejected' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800">
                              Rejected
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                              <Check className="w-2.5 h-2.5" /> Live
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(prop)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              prop.isFeatured
                                ? 'bg-amber-50 border-amber-300 text-amber-600 shadow-2xs'
                                : 'border-slate-200 text-slate-400 hover:text-amber-500'
                            }`}
                            title="Toggle Featured"
                          >
                            <Star className={`w-3.5 h-3.5 ${prop.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingProperty(prop)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-700 cursor-pointer"
                              title="Edit Property"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onSelectProperty(prop)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
                              title="View Property Page"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${prop.title}"?`)) {
                                  onDeleteProperty(prop.id);
                                  showToast('Property deleted permanently.');
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
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

      {/* 5. TAB 3: USER & AGENT DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">User & Agent Directory</h2>
            <p className="text-xs text-slate-500">
              Overview of registered platform participants, RERA-verified agents, and verified property owners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Registered Buyers</span>
              <div className="text-2xl font-black text-slate-900 mt-2">{MOCK_USER_METRICS.totalBuyers.toLocaleString()}</div>
              <p className="text-[11px] text-emerald-600 mt-1">Verified mobile & email accounts</p>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Verified Agents</span>
              <div className="text-2xl font-black text-slate-900 mt-2">{MOCK_USER_METRICS.verifiedAgents.toLocaleString()}</div>
              <p className="text-[11px] text-blue-600 mt-1">Active RERA certified brokers</p>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Direct Property Owners</span>
              <div className="text-2xl font-black text-slate-900 mt-2">{MOCK_USER_METRICS.propertyOwners.toLocaleString()}</div>
              <p className="text-[11px] text-amber-600 mt-1">0% Brokerage sellers</p>
            </div>
          </div>

          {/* Sample Active Agents */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">Top Verified Agents & Partners</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: 'Rajesh Verma', agency: 'Prime Acre Realty', city: 'Bangalore', rera: 'PRM/KA/RERA/1251/310/AG/210214', activeListings: 18 },
                { name: 'Priya Nambiar', agency: 'South Coast Estates', city: 'Mumbai', rera: 'MAHARERA/A51900021489', activeListings: 14 },
                { name: 'Sanjay Malhotra', agency: 'Capital Horizon Advisors', city: 'Delhi NCR', rera: 'HRERA-PKL-REA-687-2022', activeListings: 22 },
                { name: 'Amitabh Sen', agency: 'Bengal Metro Properties', city: 'Kolkata', rera: 'WBRERA/A/KOL/2023/000142', activeListings: 9 },
              ].map((ag, i) => (
                <div key={i} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{ag.name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="text-[11px] text-slate-500">{ag.agency} • {ag.city}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">RERA: {ag.rera}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-blue-700">{ag.activeListings}</span>
                    <div className="text-[10px] text-slate-500">Listings</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 4: PLATFORM INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">Platform Inquiries & Buyer Leads</h2>
            <p className="text-xs text-slate-500">
              Direct connection messages sent from property cards across the portal.
            </p>
          </div>

          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div key={inq.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {inq.propertyImage && (
                    <img src={inq.propertyImage} alt="" className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                        {inq.type}
                      </span>
                      <span className="text-xs text-slate-400">{inq.date}</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-1">{inq.propertyTitle}</h4>
                    <p className="text-xs text-slate-600 mt-1 italic">"{inq.message}"</p>
                    <div className="text-xs font-semibold text-slate-700 mt-2 flex items-center gap-3">
                      <span>Buyer: <strong>{inq.userName}</strong></span>
                      <span>Phone: <a href={`tel:${inq.userPhone}`} className="text-blue-600 underline">{inq.userPhone}</a></span>
                      <span>Email: <a href={`mailto:${inq.userEmail}`} className="text-blue-600 underline">{inq.userEmail}</a></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    inq.status === 'New' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {inq.status}
                  </span>
                  <a
                    href={`https://wa.me/${inq.userPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(inq.userName)},%20regarding%20your%20inquiry%20on%20VillaSell...`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
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
              <h3 className="font-extrabold text-base text-slate-900">Edit Property Details</h3>
              <button
                onClick={() => setEditingProperty(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Carpet Area (sq.ft)</label>
                  <input
                    type="number"
                    value={editingProperty.carpetAreaSqFt}
                    onChange={(e) => setEditingProperty({ ...editingProperty, carpetAreaSqFt: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editingProperty.city}
                    onChange={(e) => setEditingProperty({ ...editingProperty, city: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Locality</label>
                  <input
                    type="text"
                    value={editingProperty.locality}
                    onChange={(e) => setEditingProperty({ ...editingProperty, locality: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Moderation Status</label>
                <select
                  value={editingProperty.approvalStatus || 'approved'}
                  onChange={(e) => setEditingProperty({ ...editingProperty, approvalStatus: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                >
                  <option value="approved">Approved & Live</option>
                  <option value="pending">Pending Approval</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProperty.isFeatured}
                    onChange={(e) => setEditingProperty({ ...editingProperty, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Feature on Homepage Spotlight</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
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
