import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle,
  Building
} from 'lucide-react';
import { BRAND_CONFIG, CITIES } from '../data/mockProperties';
import { CustomDropdown } from './CustomDropdown';

interface ContactViewProps {
  onBack: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [subject, setSubject] = useState('Buying Consultation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'How does VillaSell ensure Zero Brokerage?',
      a: 'We connect verified buyers directly with genuine owners and authorised developer partners. Our platform eliminates middleman fees, saving you up to 2-3% on every transaction.'
    },
    {
      q: 'Are all property listings verified?',
      a: 'Yes! Every property posted on VillaSell undergoes mandatory RERA document cross-referencing, title deed verification, and physical inspection checks.'
    },
    {
      q: 'Can I schedule a guided site visit?',
      a: 'Absolutely. Call our helpline at +91 8383826205 or message us on WhatsApp with the property ID to arrange a complimentary chauffeur or executive-assisted site tour.'
    },
    {
      q: 'Is posting a property completely free?',
      a: 'Yes, owners can list up to 2 properties completely free with high-resolution photos, instant WhatsApp leads, and lifetime verified badge support.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20 animate-in fade-in duration-300">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <div className="text-xs text-slate-500 font-medium">
              <span>Home</span> / <span className="font-bold text-slate-800">Contact Us</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Support: {BRAND_CONFIG.workingHours}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wider">
            24x7 Customer Advisory
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
            We’re Here to Help You Find Your Dream Property
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Reach out via phone, direct WhatsApp chat, or drop us an email for immediate assistance with property buying, renting, or legal verification.
          </p>
        </div>

        {/* Contact Method Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Phone */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Phone className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Helpline</span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">{BRAND_CONFIG.phone}</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">Toll-free across all Indian networks</p>
            <a
              href={`tel:${BRAND_CONFIG.phoneClean}`}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Call Now
            </a>
          </div>

          {/* WhatsApp */}
          <div className="bg-white rounded-3xl border-2 border-emerald-300/80 p-6 shadow-md hover:shadow-lg transition-all text-center flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
              Fastest Reply
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20">
              <MessageCircle className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">WhatsApp Support</span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">+91 8383826205</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">Typical response in under 5 minutes</p>
            <a
              href={BRAND_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md"
            >
              Chat on WhatsApp
            </a>
          </div>

          {/* Email */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Mail className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Email</span>
            <h3 className="text-base font-extrabold text-slate-900 mt-1 truncate max-w-full">
              {BRAND_CONFIG.email}
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">For partnership and property listings</p>
            <a
              href={`mailto:${BRAND_CONFIG.email}`}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
            >
              Send Email
            </a>
          </div>
        </div>

        {/* Contact Form & Office Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-2">Send Us a Direct Message</h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill out your details and our senior property advisor will reach out to guide your search.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-emerald-900">Message Received!</h4>
                <p className="text-xs text-emerald-700 mt-1 mb-4">
                  Thank you, <span className="font-semibold">{name}</span>. Our representative will contact you at{' '}
                  <span className="font-semibold">{phone}</span> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Mobile Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 8383826205"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Preferred City
                    </label>
                    <CustomDropdown
                      value={city}
                      onChange={(val) => setCity(val)}
                      options={CITIES.filter((c) => c !== 'All Cities')}
                      theme="subtle"
                      size="sm"
                      buttonClassName="p-2.5 rounded-xl border-slate-200 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    How Can We Assist You?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us what kind of villa, luxury apartment or commercial property you are looking for..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Consultation Request</span>
                </button>
              </form>
            )}
          </div>

          {/* Office Address & Regional Hubs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <span>Regional Advisory Hubs</span>
              </h3>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">Corporate Headquarters</h4>
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>DLF Cyber City, Sector 25A, Gurugram, Delhi NCR - 122002</span>
                  </p>
                </div>

                <div className="border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">Eastern UP & Heritage Hub</h4>
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Shivpur Ring Road Corridor, Varanasi, UP - 221003</span>
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1">South India Operations</h4>
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Indiranagar 100 Feet Road, Bangalore, Karnataka - 560038</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Connect Box */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md">
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block mb-1">
                Priority Owner Desk
              </span>
              <h4 className="text-lg font-bold mb-2">Are you a Property Owner?</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                List your residential villa or commercial premise directly with our verified network and get zero brokerage deals within 15 days.
              </p>
              <a
                href={`tel:${BRAND_CONFIG.phoneClean}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 font-black text-xs hover:bg-slate-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Call Kamlesh: {BRAND_CONFIG.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Frequently Asked Questions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-sm text-slate-900 mb-1.5">{faq.q}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
