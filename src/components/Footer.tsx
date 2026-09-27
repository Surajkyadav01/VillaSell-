import React from 'react';
import { 
  Home, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  ArrowUp,
  ExternalLink,
  Instagram,
  Facebook,
  Youtube
} from 'lucide-react';
import { BRAND_CONFIG, CITIES } from '../data/mockProperties';
import { ActiveView, PropertyCategory } from '../types/property';

interface FooterProps {
  onSelectView: (view: ActiveView) => void;
  onSelectCategory: (cat: PropertyCategory) => void;
  onSelectCity: (city: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectView,
  onSelectCategory,
  onSelectCity,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCityClick = (city: string) => {
    onSelectCity(city);
    onSelectView('home');
    scrollToTop();
  };

  const handleCategoryClick = (cat: PropertyCategory) => {
    onSelectCategory(cat);
    onSelectView('home');
    scrollToTop();
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Value Banner in Footer */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 text-blue-300 border border-blue-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-extrabold text-lg">Looking to Sell or Rent Your Property Fast?</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Join 15,000+ happy homeowners. List your property for free with zero brokerage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onSelectView('post-property');
                scrollToTop();
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Post Property FREE
            </button>

            <a
              href={`tel:${BRAND_CONFIG.phoneClean}`}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call {BRAND_CONFIG.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Bio (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-800 to-slate-900 border border-blue-300/35 flex items-center justify-center shadow-lg shadow-slate-900/60">
                <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16 4L4 14.5H8.5V26.5H23.5V14.5H28L16 4Z"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="rgba(255,255,255,0.08)"
                  />
                  <path d="M16 8.5L9.5 14.5H22.5L16 8.5Z" fill="#f59e0b" />
                  <path
                    d="M13.5 26.5V19.5C13.5 18.4 14.6 17.5 16 17.5C17.4 17.5 18.5 18.4 18.5 19.5V26.5"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-2xl font-black text-white tracking-tight font-sans">
                Villa<span className="text-amber-400">Sell</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              VillaSell is India's next-generation real estate listing and property aggregator platform. We deliver verified villas, penthouses, high-yield commercial hubs, and RERA-sanctioned plots with direct owner connectivity and transparent zero-brokerage deals.
            </p>

            {/* Direct Official Contact Cards */}
            <div className="space-y-2 pt-2 text-xs">
              <a
                href={`tel:${BRAND_CONFIG.phoneClean}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-emerald-500">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span>Helpline: <strong className="text-white underline">{BRAND_CONFIG.phone}</strong></span>
              </a>

              <a
                href={BRAND_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-emerald-500">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span>WhatsApp: <strong className="text-white">+91 8383826205</strong></span>
              </a>

              <a
                href={`mailto:${BRAND_CONFIG.email}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-blue-300 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-blue-500">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span>Email: <strong className="text-white">{BRAND_CONFIG.email}</strong></span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-3">
              <a
                href={BRAND_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-slate-400 flex items-center justify-center transition-colors"
                title="WhatsApp Support"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:bg-pink-600 hover:text-white hover:border-pink-600 text-slate-400 flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-400 flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:bg-red-600 hover:text-white hover:border-red-600 text-slate-400 flex items-center justify-center transition-colors"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleCategoryClick('buy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Buy Villas & Apartments
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('rent')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Rent Verified Homes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('commercial')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Commercial Spaces & Offices
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('plots')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Residential Plots & Land
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectView('post-property');
                    scrollToTop();
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer"
                >
                  Post Property (FREE)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectView('contact');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Real Estate Cities */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Popular Cities</h4>
            <ul className="space-y-2 text-xs">
              {CITIES.filter((c) => c !== 'All Cities').map((city) => (
                <li key={city}>
                  <button
                    onClick={() => handleCityClick(city)}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3 text-blue-400" />
                    <span>Properties in {city}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: VillaSell Edge & Tools */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">VillaSell Edge & Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onSelectView('home-loan');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Home Loan (8.35%*)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectView('housing-premium');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>Housing Premium VIP</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectView('emi-calculator');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>EMI Calculator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectView('property-valuation');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>Property Value Calculator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectView('rent-receipt-generator');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                  <span>Rent Receipt Generator</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Trust & Policies</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onSelectView('privacy-policy');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectView('terms');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectView('rera-disclaimer');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  RERA Compliance & Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectView('cookie-policy');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <span className="inline-block mt-2 px-2 py-1 rounded bg-slate-900 text-[10px] text-slate-400 border border-slate-800">
                  RERA Reg: UPRERA2026/VILLASELL
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar matching exact layout from screenshot */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          {/* Left: Copyright & RERA */}
          <div className="flex items-center flex-wrap gap-2 text-center md:text-left justify-center md:justify-start">
            <span>© 2026 VillaSell. All Rights Reserved.</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400">RERA Certified Real Estate Marketplace</span>
          </div>

          {/* Center: Built by Suraj Tech Hub Pill with clickable link */}
          <div className="flex items-center justify-center">
            <a
              href="https://surajkyadav01.github.io/Suraj-Tech-Hub/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800/90 hover:border-cyan-500/50 text-xs transition-all shadow-xs group"
              title="Visit Suraj Tech Hub"
            >
              <span className="text-slate-300">Built by</span>
              <span className="text-cyan-400 font-bold group-hover:underline">Suraj Tech Hub</span>
              <ExternalLink className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Right: Back to Top Button (Privacy Policy removed as requested) */}
          <div className="flex items-center justify-center md:justify-end">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 hover:text-white text-slate-300 text-xs transition-colors cursor-pointer"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
