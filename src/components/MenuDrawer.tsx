import React from 'react';
import { 
  X, 
  Home, 
  Building2, 
  Store, 
  Trees, 
  PlusCircle, 
  Heart, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  User, 
  LogOut, 
  LogIn, 
  MapPin, 
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ActiveView, PropertyCategory, UserProfile } from '../types/property';
import { BRAND_CONFIG, CITIES } from '../data/mockProperties';
import { sanitizeUserPhone, resolveUserDisplayName } from '../utils/phoneSanitizer';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onOpenLoginWithMode?: (mode: 'login' | 'signup' | 'admin') => void;
  onLogout: () => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedCategory: PropertyCategory | 'all';
  onSelectCategory: (cat: PropertyCategory | 'all') => void;
  shortlistCount: number;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenLogin,
  onOpenLoginWithMode,
  onLogout,
  activeView,
  setActiveView,
  selectedCategory,
  onSelectCategory,
  shortlistCount,
  selectedCity,
  onSelectCity,
}) => {
  if (!isOpen) return null;

  const navigateTo = (view: ActiveView) => {
    if (view === 'post-property' && !currentUser) {
      onClose();
      if (onOpenLoginWithMode) {
        onOpenLoginWithMode('signup');
      } else {
        onOpenLogin();
      }
      return;
    }
    setActiveView(view);
    onClose();
  };

  const handleCategory = (cat: PropertyCategory | 'all') => {
    onSelectCategory(cat);
    setActiveView('home');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Slide-in Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1b4a80] via-[#255e9c] to-[#2b568d] p-5 text-white flex items-center justify-between border-b border-sky-300/35 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900/60 border border-blue-300/30 flex items-center justify-center">
                <Home className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white">
                  Villa<span className="text-amber-400">Sell</span>
                </span>
                <span className="block text-[10px] text-blue-200 font-semibold">
                  Main Navigation & Services
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-5 flex-1 space-y-6">
            {/* User Profile / Login Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-slate-50 border border-blue-100 shadow-xs">
              {currentUser ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                        alt={currentUser.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-300 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                            {currentUser.name || resolveUserDisplayName(null, currentUser.email)}
                          </h4>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800">
                            {currentUser.role}
                          </span>
                        </div>
                        <span className="text-xs text-slate-600 font-medium block truncate max-w-[160px] break-all">
                          {currentUser.email}
                        </span>
                        {sanitizeUserPhone(currentUser.phone) && (
                          <span className="text-[10px] text-slate-400 block">
                            {sanitizeUserPhone(currentUser.phone)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-100 transition-colors cursor-pointer"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Dedicated Full Dashboard Action Button */}
                  <div className="mt-3 pt-3 border-t border-blue-100/80">
                    {currentUser.role === 'Admin' ? (
                      <button
                        onClick={() => {
                          onClose();
                          navigateTo('admin-panel');
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-xs shadow-md flex items-center justify-between transition-all cursor-pointer hover:shadow-lg"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-slate-950" />
                          <span>Admin Control Panel</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-slate-950 text-amber-300">
                          Super Admin
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onClose();
                          navigateTo('dashboard');
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white font-black text-xs shadow-md flex items-center justify-between transition-all cursor-pointer hover:shadow-lg"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Go to Dedicated Dashboard</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-400 text-slate-950">
                          {currentUser.role === 'Owner' ? 'Owner Portal' : currentUser.role === 'Agent' ? 'Agent Hub' : 'Buyer Space'}
                        </span>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Welcome to VillaSell</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Sign in to view saved properties & post listings
                      </p>
                    </div>
                  </div>
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenLogin();
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In / Register</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Primary Actions: Post Property & Shortlist */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => navigateTo('post-property')}
                className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:from-blue-800 hover:to-indigo-800 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Property FREE</span>
              </button>

              <button
                onClick={() => navigateTo('shortlist')}
                className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${shortlistCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-500'}`} />
                <span>Shortlist ({shortlistCount})</span>
              </button>
            </div>

            {/* Property Categories */}
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 px-1">
                Explore Categories
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategory('buy')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === 'buy' && activeView === 'home'
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-blue-600" />
                    <span>Buy Residential Villas & Apartments</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => handleCategory('rent')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === 'rent' && activeView === 'home'
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Rent Verified Homes</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => handleCategory('commercial')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === 'commercial' && activeView === 'home'
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Store className="w-4 h-4 text-blue-600" />
                    <span>Commercial Offices & Retail</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => handleCategory('plots')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === 'plots' && activeView === 'home'
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Trees className="w-4 h-4 text-blue-600" />
                    <span>Sanctioned Residential Plots</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Housing Edge & Tools Section */}
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 px-1">
                Housing Edge & Tools
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => navigateTo('home-loan')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeView === 'home-loan'
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    <span>Home Loan (8.35%*)</span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">Housing Edge</span>
                </button>

                <button
                  onClick={() => navigateTo('housing-premium')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeView === 'housing-premium'
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    <span>Housing Premium (VIP Club)</span>
                  </div>
                  <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">Housing Edge</span>
                </button>

                <button
                  onClick={() => navigateTo('emi-calculator')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeView === 'emi-calculator'
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                    <span>EMI Calculator</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">Tool</span>
                </button>

                <button
                  onClick={() => navigateTo('property-valuation')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeView === 'property-valuation'
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                    <span>Property Value Calculator</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">Tool</span>
                </button>

                <button
                  onClick={() => navigateTo('rent-receipt-generator')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeView === 'rent-receipt-generator'
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
                    <span>Rent Receipt Generator</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">Tool</span>
                </button>
              </div>
            </div>

            {/* Popular Cities Quick Select */}
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 px-1">
                Top Metros (Active: {selectedCity})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['All Cities', 'Mumbai', 'Lucknow', 'Varanasi', 'Prayagraj', 'Bangalore', 'Pune', 'Delhi NCR', 'Chennai', 'Hyderabad'].map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onSelectCity(city);
                      if (activeView !== 'home') setActiveView('home');
                      onClose();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedCity === city
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Helpline & Support */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Official Support Desk
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect directly with our team for site visits, legal checks, and home loans.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${BRAND_CONFIG.phoneClean}`}
                  className="py-2 px-3 rounded-xl bg-white text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call Us</span>
                </a>
                <a
                  href={BRAND_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Legal & Policies Links */}
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 px-1">
                Company & Legal
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => navigateTo('contact')}
                  className="text-left py-1 text-slate-600 hover:text-blue-600 font-medium cursor-pointer"
                >
                  Contact & Office
                </button>
                <button
                  onClick={() => navigateTo('rera-disclaimer')}
                  className="text-left py-1 text-slate-600 hover:text-blue-600 font-medium cursor-pointer"
                >
                  RERA Compliance
                </button>
                <button
                  onClick={() => navigateTo('privacy-policy')}
                  className="text-left py-1 text-slate-600 hover:text-blue-600 font-medium cursor-pointer"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => navigateTo('terms')}
                  className="text-left py-1 text-slate-600 hover:text-blue-600 font-medium cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center shrink-0">
            <p className="text-[11px] text-slate-500 font-medium">
              VillaSell India © 2026 • Verified Direct Real Estate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
