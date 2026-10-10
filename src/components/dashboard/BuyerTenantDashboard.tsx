import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  Bell, 
  FileText, 
  MapPin, 
  Phone, 
  Clock, 
  Trash2, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { 
  Property, 
  UserProfile, 
  SiteVisit, 
  SearchAlert, 
  BuyerRequirement,
  PropertyInquiry 
} from '../../types/property';
import { sanitizeUserPhone, resolveUserDisplayName } from '../../utils/phoneSanitizer';

interface BuyerTenantDashboardProps {
  user: UserProfile;
  shortlistedProperties: Property[];
  onRemoveFromShortlist: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  siteVisits: SiteVisit[];
  onAddSiteVisit: (visit: SiteVisit) => void;
  onCancelSiteVisit: (id: string) => void;
  searchAlerts: SearchAlert[];
  onAddSearchAlert: (alert: SearchAlert) => void;
  onDeleteSearchAlert: (id: string) => void;
  buyerRequirements: BuyerRequirement[];
  onAddBuyerRequirement: (req: BuyerRequirement) => void;
  inquiries: PropertyInquiry[];
  showToast: (msg: string) => void;
  onNavigateToHome: () => void;
}

export const BuyerTenantDashboard: React.FC<BuyerTenantDashboardProps> = ({
  user,
  shortlistedProperties,
  onRemoveFromShortlist,
  onSelectProperty,
  siteVisits,
  onAddSiteVisit,
  onCancelSiteVisit,
  searchAlerts,
  onAddSearchAlert,
  onDeleteSearchAlert,
  buyerRequirements,
  onAddBuyerRequirement,
  inquiries,
  showToast,
  onNavigateToHome,
}) => {
  const [activeTab, setActiveTab] = useState<'shortlist' | 'site-visits' | 'alerts' | 'requirement'>('shortlist');

  // Requirement Form State
  const [reqCity, setReqCity] = useState('Bangalore');
  const [reqLocality, setReqLocality] = useState('');
  const [reqType, setReqType] = useState('Villa / Gated Villa');
  const [reqBhk, setReqBhk] = useState('3 BHK');
  const [reqBudget, setReqBudget] = useState('₹ 2 Cr - ₹ 3 Cr');
  const [reqTimeline, setReqTimeline] = useState('Within 1 Month');
  const [reqNotes, setReqNotes] = useState('');

  // New Alert State
  const [newAlertCity, setNewAlertCity] = useState('Bangalore');
  const [newAlertBhk, setNewAlertBhk] = useState('3 BHK');
  const [newAlertBudget, setNewAlertBudget] = useState('₹ 2.5 Cr');

  // New Site Visit Booking Modal
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [visitDate, setVisitDate] = useState('2026-10-05');
  const [visitTimeSlot, setVisitTimeSlot] = useState('11:00 AM - 12:30 PM');
  const [visitNotes, setVisitNotes] = useState('');

  const handlePostRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqLocality.trim()) {
      showToast('Please specify preferred locality.');
      return;
    }

    const newReq: BuyerRequirement = {
      id: `req-${Date.now()}`,
      userId: user.email,
      userName: user.name || resolveUserDisplayName(null, user.email),
      userPhone: sanitizeUserPhone(user.phone),
      userEmail: user.email,
      city: reqCity,
      locality: reqLocality.trim(),
      propertyType: reqType,
      bhk: reqBhk,
      budgetRange: reqBudget,
      timeline: reqTimeline,
      notes: reqNotes.trim() || 'Looking for ready to move property with good ventilation.',
      postedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    onAddBuyerRequirement(newReq);
    showToast('Your requirement posted! Verified sellers will contact you.');
    setReqLocality('');
    setReqNotes('');
  };

  const handleCreateSearchAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const alert: SearchAlert = {
      id: `alert-${Date.now()}`,
      city: newAlertCity,
      bhk: newAlertBhk,
      maxBudget: newAlertBudget,
      propertyType: 'All Types',
      createdDate: new Date().toISOString().split('T')[0],
      matchCount: 12
    };
    onAddSearchAlert(alert);
    showToast('Search alert created! You will be notified of matching properties.');
  };

  const handleConfirmSiteVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingProperty) return;

    const newVisit: SiteVisit = {
      id: `visit-${Date.now()}`,
      propertyId: bookingProperty.id,
      propertyTitle: bookingProperty.title,
      propertyLocation: `${bookingProperty.locality}, ${bookingProperty.city}`,
      propertyImage: bookingProperty.images[0],
      visitDate,
      timeSlot: visitTimeSlot,
      agentName: bookingProperty.postedBy?.name || 'Verified Advisor',
      agentPhone: bookingProperty.postedBy?.phone || '+91 83838 26205',
      status: 'Scheduled',
      notes: visitNotes || 'Client requested architect guidance and layout tour.'
    };

    onAddSiteVisit(newVisit);
    setBookingProperty(null);
    showToast('Site visit scheduled! The agent has been notified.');
    setActiveTab('site-visits');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Shortlisted Homes</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">{shortlistedProperties.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Saved for comparison</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Scheduled Site Visits</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">{siteVisits.length}</div>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">Upcoming appointments</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">My Inquiries</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">{inquiries.length}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Direct owner messages</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Search Alerts</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">{searchAlerts.length}</div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">Instant price drop alerts</p>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex flex-wrap gap-1.5 shadow-xs">
        <button
          onClick={() => setActiveTab('shortlist')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'shortlist'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Shortlist ({shortlistedProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('site-visits')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'site-visits'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Site Visits ({siteVisits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Search Alerts ({searchAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requirement')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'requirement'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Post My Requirement</span>
        </button>
      </div>

      {/* 3. TAB 1: SHORTLISTED PROPERTIES */}
      {activeTab === 'shortlist' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Saved Properties</h2>
              <p className="text-xs text-slate-500">
                Compare floor plans, review pricing, or schedule direct site visits with verified owners.
              </p>
            </div>
            <button
              onClick={onNavigateToHome}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore More Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {shortlistedProperties.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Your shortlist is currently empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click the heart icon on any property in the marketplace to save it here for fast comparison.
              </p>
              <button
                onClick={onNavigateToHome}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Browse Verified Homes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {shortlistedProperties.map((prop) => (
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
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-black uppercase backdrop-blur-xs">
                        {prop.category}
                      </div>
                      <button
                        onClick={() => onRemoveFromShortlist(prop.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-rose-50 text-rose-600 shadow-xs cursor-pointer transition-colors"
                        title="Remove from shortlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-blue-600 text-white text-xs font-black shadow-xs">
                        {prop.priceDisplay}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{prop.title}</h4>
                      <p className="text-xs text-slate-500">{prop.locality}, {prop.city}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-600">
                        <span className="font-bold">{prop.bedrooms} BHK</span>
                        <span>•</span>
                        <span>{prop.carpetAreaSqFt} sq.ft</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold">{prop.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 space-y-2">
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setBookingProperty(prop)}
                        className="py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Visit</span>
                      </button>

                      <button
                        onClick={() => onSelectProperty(prop)}
                        className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 2: SCHEDULED SITE VISITS */}
      {activeTab === 'site-visits' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Scheduled Site Visits</h2>
              <p className="text-xs text-slate-500">
                Your booked on-site property walkthroughs with dedicated agents and property owners.
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {siteVisits.map((visit) => (
              <div
                key={visit.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {visit.propertyImage && (
                    <img src={visit.propertyImage} alt="" className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        visit.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {visit.status}
                      </span>
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" /> {visit.visitDate} ({visit.timeSlot})
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900">{visit.propertyTitle}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {visit.propertyLocation}
                    </p>

                    <div className="text-xs font-medium text-slate-600 pt-1 flex items-center gap-3">
                      <span>Assigned: <strong>{visit.agentName}</strong></span>
                      <span>Contact: <a href={`tel:${visit.agentPhone}`} className="text-blue-600 underline font-semibold">{visit.agentPhone}</a></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://wa.me/${visit.agentPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(visit.agentName)},%20I%20have%20a%20site%20visit%20scheduled%20for%20${encodeURIComponent(visit.propertyTitle)}%20on%20${visit.visitDate}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    WhatsApp Agent
                  </a>
                  {visit.status === 'Scheduled' && (
                    <button
                      onClick={() => onCancelSiteVisit(visit.id)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 text-xs font-bold"
                    >
                      Cancel Visit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB 3: SEARCH ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Search Alerts & Price Drops</h2>
              <p className="text-xs text-slate-500">
                Receive instant notifications when new properties match your specific budget and criteria.
              </p>
            </div>
          </div>

          {/* Quick Create Alert Form */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-3xl p-5">
            <h3 className="font-extrabold text-xs text-blue-900 uppercase tracking-wider mb-3">
              Create New Property Alert
            </h3>
            <form onSubmit={handleCreateSearchAlert} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">City</label>
                <select
                  value={newAlertCity}
                  onChange={(e) => setNewAlertCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs font-semibold"
                >
                  {['Mumbai', 'Lucknow', 'Varanasi', 'Prayagraj', 'Mirzapur', 'Bhadohi', 'Jaunpur', 'Bangalore', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">BHK Requirement</label>
                <select
                  value={newAlertBhk}
                  onChange={(e) => setNewAlertBhk(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs font-semibold"
                >
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4+ BHK">4+ BHK</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Max Budget</label>
                <input
                  type="text"
                  value={newAlertBudget}
                  onChange={(e) => setNewAlertBudget(e.target.value)}
                  placeholder="e.g. ₹ 2 Cr"
                  className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs font-semibold"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Set Alert</span>
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {searchAlerts.map((al) => (
              <div key={al.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                    <button
                      onClick={() => onDeleteSearchAlert(al.id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 mt-2">{al.city} • {al.bhk}</h4>
                  <p className="text-xs text-slate-500">Max Budget: <strong>{al.maxBudget}</strong></p>
                  <div className="text-[11px] text-blue-600 font-bold mt-2">
                    {al.matchCount} properties matching currently
                  </div>
                </div>

                <button
                  onClick={onNavigateToHome}
                  className="w-full mt-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors"
                >
                  View Matches
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB 4: POST BUYER REQUIREMENT */}
      {activeTab === 'requirement' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Buyer Concierge Service</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Post Your Property Requirement
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Can't find the exact home you want? Post your requirement for verified property owners and RERA agents to review.
              </p>
            </div>

            <form onSubmit={handlePostRequirement} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target City *</label>
                  <select
                    value={reqCity}
                    onChange={(e) => setReqCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                  >
                    {['Mumbai', 'Lucknow', 'Varanasi', 'Prayagraj', 'Mirzapur', 'Bhadohi', 'Jaunpur', 'Bangalore', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Localities *</label>
                  <input
                    type="text"
                    required
                    value={reqLocality}
                    onChange={(e) => setReqLocality(e.target.value)}
                    placeholder="e.g. Indiranagar, Koramangala or HSR"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Property Type</label>
                  <select
                    value={reqType}
                    onChange={(e) => setReqType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                  >
                    <option value="Villa / Gated Villa">Villa / Gated Villa</option>
                    <option value="Luxury Apartment">Luxury Apartment</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Residential Plot">Residential Plot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bedrooms</label>
                  <select
                    value={reqBhk}
                    onChange={(e) => setReqBhk(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                  >
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4+ BHK">4+ BHK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Budget Range</label>
                  <input
                    type="text"
                    required
                    value={reqBudget}
                    onChange={(e) => setReqBudget(e.target.value)}
                    placeholder="e.g. ₹ 2.5 Cr - ₹ 3.5 Cr"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Specific Requirements & Amenities</label>
                <textarea
                  rows={3}
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  placeholder="e.g. East facing, high floor, 2 car parking spaces, ready to move within 30 days."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Buyer Requirement</span>
              </button>
            </form>
          </div>

          {/* User's Posted Requirements List */}
          {buyerRequirements.length > 0 && (
            <div className="max-w-3xl mx-auto space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">Your Active Requirements ({buyerRequirements.length})</h3>
              {buyerRequirements.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {r.status}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{r.bhk} {r.propertyType}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{r.locality}, {r.city} • Budget: <strong>{r.budgetRange}</strong></p>
                    {r.notes && <p className="text-[11px] text-slate-500 italic mt-0.5">"{r.notes}"</p>}
                  </div>
                  <span className="text-[11px] text-slate-400">{r.postedDate}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SITE VISIT BOOKING MODAL */}
      {bookingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Schedule Site Visit</h3>
              <button onClick={() => setBookingProperty(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <img src={bookingProperty.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover" />
              <div>
                <div className="font-extrabold text-xs text-slate-900 line-clamp-1">{bookingProperty.title}</div>
                <div className="text-[11px] text-slate-500">{bookingProperty.locality}, {bookingProperty.city}</div>
                <div className="text-xs font-black text-blue-700">{bookingProperty.priceDisplay}</div>
              </div>
            </div>

            <form onSubmit={handleConfirmSiteVisit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Time Slot</label>
                <select
                  value={visitTimeSlot}
                  onChange={(e) => setVisitTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  <option value="10:00 AM - 11:30 AM">Morning (10:00 AM - 11:30 AM)</option>
                  <option value="11:30 AM - 01:00 PM">Noon (11:30 AM - 01:00 PM)</option>
                  <option value="03:00 PM - 04:30 PM">Afternoon (03:00 PM - 04:30 PM)</option>
                  <option value="05:00 PM - 06:30 PM">Evening (05:00 PM - 06:30 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes for Agent / Owner</label>
                <input
                  type="text"
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  placeholder="e.g. Will bring family, need floor plan copy"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingProperty(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  Confirm Site Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
