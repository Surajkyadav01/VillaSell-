import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  UserCheck, 
  Building, 
  Briefcase, 
  ShoppingBag, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  Layers,
  Settings,
  RefreshCw
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
import { OwnerAdminDashboard } from './OwnerAdminDashboard';
import { AgentDashboard } from './AgentDashboard';
import { BuyerTenantDashboard } from './BuyerTenantDashboard';

interface DashboardViewProps {
  user: UserProfile;
  onUpdateUserRole: (newRole: UserRole) => void;
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
  inquiries,
  onUpdateInquiryStatus,
  siteVisits,
  onAddSiteVisit,
  onCancelSiteVisit,
  searchAlerts,
  onAddSearchAlert,
  onDeleteSearchAlert,
  buyerRequirements,
  onAddBuyerRequirement,
  onLogout,
  onNavigateToPostProperty,
  showToast,
}) => {
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  // Shortlisted property items
  const shortlistedProps = properties.filter(p => shortlist.includes(p.id));

  // Determine active normalized role
  const isOwnerOrAdmin = user.role === 'Owner' || user.role === 'Admin';
  const isAgent = user.role === 'Agent';
  const isBuyer = user.role === 'Buyer' || (!isOwnerOrAdmin && !isAgent);

  return (
    <div className="min-h-screen bg-slate-50/80 pb-16">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Left: Back button + Role Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMarketplace}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </button>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            {/* Portal Role Badge */}
            <div className="flex items-center gap-2">
              {isOwnerOrAdmin && (
                <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Owner / Admin Portal</span>
                </span>
              )}

              {isAgent && (
                <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <Briefcase className="w-3.5 h-3.5 text-sky-200" />
                  <span>Agent / Broker Dashboard</span>
                </span>
              )}

              {isBuyer && (
                <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Buyer / Tenant Space</span>
                </span>
              )}
            </div>
          </div>

          {/* Right: User Profile Chip + Live Role Switcher (Allows testing all 3 roles!) */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer border border-slate-200"
                title="Switch active role"
              >
                <RefreshCw className="w-3 h-3 text-slate-500" />
                <span>Switch Role: <strong>{user.role}</strong></span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <div className="p-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    Switch Active Persona:
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onUpdateUserRole('Owner');
                      setRoleSwitcherOpen(false);
                      showToast('Switched to Property Owner / Admin Portal');
                    }}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isOwnerOrAdmin ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">Property Owner / Admin</div>
                      <div className="text-[10px] text-slate-500">Moderation, global directory & approval</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onUpdateUserRole('Agent');
                      setRoleSwitcherOpen(false);
                      showToast('Switched to Agent / Broker Dashboard');
                    }}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isAgent ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">Agent / Broker</div>
                      <div className="text-[10px] text-slate-500">My listings, leads & Cloudinary upload</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onUpdateUserRole('Buyer');
                      setRoleSwitcherOpen(false);
                      showToast('Switched to Buyer / Tenant Space');
                    }}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isBuyer ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">Buyer / Tenant</div>
                      <div className="text-[10px] text-slate-500">Saved homes, site visits & alerts</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* User Avatar & Logout */}
            <div className="flex items-center gap-2">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt=""
                className="w-8 h-8 rounded-xl object-cover border border-slate-200"
              />
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Render Customized Dashboard Based on Role */}
        {isOwnerOrAdmin && (
          <OwnerAdminDashboard
            user={user}
            properties={properties}
            onUpdateProperty={onUpdateProperty}
            onDeleteProperty={onDeleteProperty}
            onSelectProperty={onSelectProperty}
            inquiries={inquiries}
            onNavigateToPostProperty={onNavigateToPostProperty}
            showToast={showToast}
          />
        )}

        {isAgent && (
          <AgentDashboard
            user={user}
            properties={properties}
            onAddProperty={onAddProperty}
            onUpdateProperty={onUpdateProperty}
            onDeleteProperty={onDeleteProperty}
            onSelectProperty={onSelectProperty}
            inquiries={inquiries}
            onUpdateInquiryStatus={onUpdateInquiryStatus}
            showToast={showToast}
          />
        )}

        {isBuyer && (
          <BuyerTenantDashboard
            user={user}
            shortlistedProperties={shortlistedProps}
            onRemoveFromShortlist={onToggleShortlist}
            onSelectProperty={onSelectProperty}
            siteVisits={siteVisits}
            onAddSiteVisit={onAddSiteVisit}
            onCancelSiteVisit={onCancelSiteVisit}
            searchAlerts={searchAlerts}
            onAddSearchAlert={onAddSearchAlert}
            onDeleteSearchAlert={onDeleteSearchAlert}
            buyerRequirements={buyerRequirements}
            onAddBuyerRequirement={onAddBuyerRequirement}
            inquiries={inquiries}
            showToast={showToast}
            onNavigateToHome={onBackToMarketplace}
          />
        )}
      </div>
    </div>
  );
};
