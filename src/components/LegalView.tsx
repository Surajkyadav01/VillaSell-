import React from 'react';
import { ArrowLeft, Shield, FileText, Scale, Cookie, Phone, Mail } from 'lucide-react';
import { ActiveView } from '../types/property';
import { BRAND_CONFIG } from '../data/mockProperties';

interface LegalViewProps {
  viewType: 'privacy-policy' | 'terms' | 'rera-disclaimer' | 'cookie-policy';
  onBack: () => void;
  onSelectView: (view: ActiveView) => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ viewType, onBack, onSelectView }) => {
  const getMetadata = () => {
    switch (viewType) {
      case 'privacy-policy':
        return {
          title: 'Privacy Policy',
          icon: <Shield className="w-5 h-5 text-purple-600" />,
          subtitle: 'Last updated: March 2026'
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: <FileText className="w-5 h-5 text-purple-600" />,
          subtitle: 'Effective from January 2026'
        };
      case 'rera-disclaimer':
        return {
          title: 'RERA Compliance & Disclaimer',
          icon: <Scale className="w-5 h-5 text-purple-600" />,
          subtitle: 'Real Estate (Regulation and Development) Act compliance'
        };
      case 'cookie-policy':
        return {
          title: 'Cookie & Tracking Policy',
          icon: <Cookie className="w-5 h-5 text-purple-600" />,
          subtitle: 'Transparency regarding user preferences & local storage'
        };
    }
  };

  const meta = getMetadata();

  return (
    <div className="bg-slate-50 min-h-screen pb-20 animate-in fade-in duration-300">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <div className="text-xs text-slate-500 font-medium">
              <span>Legal</span> / <span className="font-bold text-slate-800">{meta.title}</span>
            </div>
          </div>

          {/* Quick tab switcher */}
          <div className="hidden sm:flex items-center gap-1 text-xs">
            <button
              onClick={() => onSelectView('privacy-policy')}
              className={`px-2.5 py-1 rounded-md font-semibold ${
                viewType === 'privacy-policy' ? 'bg-purple-100 text-purple-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Privacy
            </button>
            <button
              onClick={() => onSelectView('terms')}
              className={`px-2.5 py-1 rounded-md font-semibold ${
                viewType === 'terms' ? 'bg-purple-100 text-purple-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Terms
            </button>
            <button
              onClick={() => onSelectView('rera-disclaimer')}
              className={`px-2.5 py-1 rounded-md font-semibold ${
                viewType === 'rera-disclaimer' ? 'bg-purple-100 text-purple-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              RERA
            </button>
            <button
              onClick={() => onSelectView('cookie-policy')}
              className={`px-2.5 py-1 rounded-md font-semibold ${
                viewType === 'cookie-policy' ? 'bg-purple-100 text-purple-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cookies
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-100 pb-6 mb-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
              {meta.icon}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{meta.title}</h1>
              <p className="text-xs text-slate-500 mt-1">{meta.subtitle}</p>
            </div>
          </div>

          {/* Privacy Policy Content */}
          {viewType === 'privacy-policy' && (
            <div className="prose prose-slate max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed space-y-6">
              <section>
                <h3 className="text-base font-bold text-slate-900 mb-2">1. Information We Collect</h3>
                <p>
                  VillaSell ("we", "our", or "us") respects your privacy. When you browse our real estate aggregator platform, search properties, request owner contact details, or submit property listings, we may collect your name, phone number, email address, property preferences, and approximate location.
                </p>
              </section>

              <section>
                <h3 className="text-base font-bold text-slate-900 mb-2">2. How We Use Your Data</h3>
                <p>
                  We use the information gathered solely to facilitate direct communication between buyers, tenants, and property owners. We do NOT sell or lease personal data to unrelated third-party telemarketers. When you initiate a WhatsApp inquiry or phone call (+91 8383826205), your contact details are shared exclusively with the verified listing coordinator.
                </p>
              </section>

              <section>
                <h3 className="text-base font-bold text-slate-900 mb-2">3. Zero-Spam Guarantee</h3>
                <p>
                  VillaSell strictly adheres to anti-spam protocols. You will not receive unsolicited automated calls. You can opt out of property update alerts at any time by sending a message to <span className="font-semibold">{BRAND_CONFIG.email}</span>.
                </p>
              </section>

              <section>
                <h3 className="text-base font-bold text-slate-900 mb-2">4. Data Security</h3>
                <p>
                  We implement industry-standard encryption protocols (SSL/TLS) to secure user interactions. Sensitive property documents submitted for RERA verification are maintained on encrypted servers.
                </p>
              </section>
            </div>
          )}

          {/* Terms of Service Content */}
          {viewType === 'terms' && (
            <div className="prose prose-slate max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed space-y-6">
              <section>
                <h3 className="text-base font-bold text-slate-900 mb-2">1. Acceptance of Terms</h3>
                <p>
                  By accessing or utilizing the VillaSell web application, you acknowledge and agree to be bound by these Terms of Service. If you disagree with any part of these terms, please discontinue using the service.
                </p>
              </section>

              <section>
                <h3 className="text-base font-bold text-slate-900 mb-2">2. Property Listings & Accuracy</h3>
                <p>
                  VillaSell aggregates property information provided by owners, builders, and verified channel partners. While we perform stringent RERA verification and title checks, prospective buyers and tenants are advised to exercise independent due diligence, inspect original registry deeds, and verify municipal permissions before executing monetary transactions.
                </p>
              </section>

              <section>
                <h3 className="text-base font-bold text-slate-900 mb-2">3. Free Listing Facility</h3>
                <p>
                  Property owners are entitled to free basic property postings on VillaSell. Fraudulent, duplicate, or misrepresentative listings will be immediately suspended without prior notice.
                </p>
              </section>

              <section>
                <h3 className="text-base font-bold text-slate-900 mb-2">4. Limitation of Liability</h3>
                <p>
                  VillaSell acts as an information facilitator and aggregator. We are not a party to the actual sale, lease, or mortgage contracts executed between users, and we shall not be held liable for any disputes arising from contractual breaches between buyers and sellers.
                </p>
              </section>
            </div>
          )}

          {/* RERA Disclaimer Content */}
          {viewType === 'rera-disclaimer' && (
            <div className="prose prose-slate max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed space-y-6">
              <section>
                <h3 className="text-base font-bold text-slate-900 mb-2">1. RERA Compliance Statement</h3>
                <p>
                  VillaSell supports full transparency in the Indian real estate market in accordance with the Real Estate (Regulation and Development) Act, 2016 (RERA) and respective state authorities (MahaRERA, Karnataka RERA, UP RERA, Haryana HRERA).
                </p>
              </section>

              <section>
                <h3 className="text-base font-bold text-slate-900 mb-2">2. Project Verification & Registration Numbers</h3>
                <p>
                  All new commercial and residential developments advertised on VillaSell display their respective official RERA Registration Numbers wherever applicable. Users are encouraged to verify project status directly on the official state RERA websites before entering into sale agreements.
                </p>
              </section>

              <section>
                <h3 className="text-base font-bold text-slate-900 mb-2">3. Disclaimer on Architectural Renderings</h3>
                <p>
                  Photographs, 3D renderings, and floor plans displayed on VillaSell are artistic impressions intended for visual guidance. Actual finishes, dimensions, and fittings may vary in accordance with sanctioned builder plans.
                </p>
              </section>
            </div>
          )}

          {/* Cookie Policy Content */}
          {viewType === 'cookie-policy' && (
            <div className="prose prose-slate max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed space-y-6">
              <section>
                <h3 className="text-base font-bold text-slate-900 mb-2">1. What Are Cookies?</h3>
                <p>
                  Cookies and local browser storage are small files saved on your device to remember user preferences, such as your selected city, shortlist of favorite villas, and recent search filters.
                </p>
              </section>

              <section>
                <h3 className="text-base font-bold text-slate-900 mb-2">2. How VillaSell Uses Local Storage</h3>
                <p>
                  We use client-side storage to preserve your shortlisted properties without requiring mandatory sign-in or passwords. This provides a lightning-fast browsing experience while keeping your data private on your own device.
                </p>
              </section>
            </div>
          )}

          {/* Footer Contact Strip */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <span>Questions regarding our policies? Contact Legal Advisory:</span>
              <p className="font-bold text-slate-800">{BRAND_CONFIG.email}</p>
            </div>

            <a
              href={`tel:${BRAND_CONFIG.phoneClean}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-800 font-bold hover:bg-purple-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Helpline {BRAND_CONFIG.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
