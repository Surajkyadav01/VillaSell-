import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  Percent, 
  ShieldCheck, 
  CheckCircle2, 
  Phone, 
  FileText, 
  Clock, 
  ArrowRight, 
  Calculator, 
  Sparkles,
  Zap,
  Check
} from 'lucide-react';
import { BRAND_CONFIG, CITIES } from '../data/mockProperties';
import { CustomDropdown } from './CustomDropdown';

interface HomeLoanViewProps {
  onBack: () => void;
  onNavigateToEmi: () => void;
}

export const HomeLoanView: React.FC<HomeLoanViewProps> = ({
  onBack,
  onNavigateToEmi,
}) => {
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantCity, setApplicantCity] = useState('Bangalore');
  const [loanAmount, setLoanAmount] = useState('7500000');
  const [employmentType, setEmploymentType] = useState('Salaried');
  const [monthlyIncome, setMonthlyIncome] = useState(120000);
  const [existingEmi, setExistingEmi] = useState(15000);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bank partners
  const banks = [
    {
      name: 'State Bank of India (SBI)',
      logoText: 'SBI',
      color: 'bg-blue-600',
      rate: '8.35% - 8.85%',
      tenure: 'Up to 30 Years',
      processingFee: 'Zero / Nil Offer',
      features: ['No prepayment penalty', 'Government bank trust', 'Lowest interest margin'],
    },
    {
      name: 'HDFC Bank',
      logoText: 'HDFC',
      color: 'bg-red-700',
      rate: '8.45% - 9.10%',
      tenure: 'Up to 30 Years',
      processingFee: '₹2,999 (Special)',
      features: ['Instant digital sanction in 48 hrs', 'High loan amount up to 90%', 'Custom repayment options'],
    },
    {
      name: 'ICICI Bank',
      logoText: 'ICICI',
      color: 'bg-amber-600',
      rate: '8.50% - 9.20%',
      tenure: 'Up to 30 Years',
      processingFee: '0.25% or min ₹3,000',
      features: ['Pre-approved limits for professionals', 'Doorstep document pickup', 'Flexible floating/fixed rates'],
    },
    {
      name: 'Axis Bank',
      logoText: 'AXIS',
      color: 'bg-rose-800',
      rate: '8.55% - 9.25%',
      tenure: 'Up to 30 Years',
      processingFee: '₹5,000 Flat',
      features: ['Fast-track approvals', 'Special rates for women applicants', '100% paperless onboarding'],
    },
  ];

  // Eligibility Calculation (FOIR rule ~55% of net income available for EMIs)
  const maxAvailableEmi = Math.max(0, monthlyIncome * 0.55 - existingEmi);
  // Loan amount from EMI: P = EMI * ((1+r)^n - 1) / (r*(1+r)^n) @ 8.5% for 20 yrs
  const estimatedMaxLoan = Math.round(maxAvailableEmi * 115);

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 antialiased">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Home</span>
              <span>/</span>
              <span>Services</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">Housing Edge</span>
              <span>/</span>
              <span className="text-purple-700 font-bold">Home Loan</span>
            </div>
          </div>

          <button
            onClick={onNavigateToEmi}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs transition-colors cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5 text-purple-700" />
            <span>Open EMI Calculator</span>
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#2c0e52] via-[#3a136b] to-[#45187e] text-white py-12 px-4 sm:px-6 lg:px-8 shadow-inner relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Housing Edge Financial Services</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Best Home Loans at <span className="text-amber-400">8.35%* p.a.</span>
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm mt-3 max-w-2xl leading-relaxed">
              Compare offers across 15+ premier Indian banks. Enjoy zero brokerage, pre-approved digital sanctions within 48 hours, and doorstep legal verification support.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 text-xs text-purple-200">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Zero Broker Commission</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Instant Pre-Approval</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Doorstep Document Assistance</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              Special Festive Offer
            </span>
            <div className="text-3xl font-black text-white mt-1 mb-2">0% Processing Fee*</div>
            <p className="text-xs text-purple-200 leading-relaxed mb-4">
              Save up to ₹25,000 on processing fees with our partner banks this month.
            </p>
            <a
              href={`tel:${BRAND_CONFIG.phoneClean}`}
              className="w-full py-2.5 rounded-xl bg-white text-purple-950 font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-md"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Call Helpline: {BRAND_CONFIG.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Bank Comparison & Instant Application */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Bank Comparison & Eligibility (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick Eligibility Meter */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Quick Loan Eligibility Calculator
                  </h3>
                  <p className="text-xs text-slate-500">
                    Check how much home loan you can easily borrow
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                  <Calculator className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-slate-700">Monthly In-Hand Salary</span>
                    <span className="font-extrabold text-purple-700">₹{monthlyIncome.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={25000}
                    max={500000}
                    step={5000}
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full accent-purple-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-slate-700">Existing Monthly EMIs</span>
                    <span className="font-extrabold text-slate-900">₹{existingEmi.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={150000}
                    step={2000}
                    value={existingEmi}
                    onChange={(e) => setExistingEmi(Number(e.target.value))}
                    className="w-full accent-purple-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Estimated Maximum Loan Eligibility:
                  </span>
                  <div className="text-2xl font-black text-purple-900 mt-0.5">
                    ₹ {(estimatedMaxLoan / 100000).toFixed(1)} Lakhs
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Max Monthly EMI:</span>
                  <span className="text-sm font-extrabold text-emerald-700">
                    ₹ {Math.round(maxAvailableEmi).toLocaleString('en-IN')}/mo
                  </span>
                </div>
              </div>
            </div>

            {/* Bank Comparison Cards */}
            <div className="space-y-3">
              <h3 className="font-black text-lg text-slate-900">
                Partner Bank Interest Rates & Offers
              </h3>

              {banks.map((bank, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-purple-200 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-12 h-12 rounded-xl ${bank.color} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                      {bank.logoText}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{bank.name}</h4>
                      <div className="flex items-center gap-3 text-xs mt-1">
                        <span className="text-emerald-700 font-extrabold text-sm">{bank.rate}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600">{bank.tenure}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {bank.features.map((f, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      document.getElementById('loan-apply-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer text-center"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Instant Application Form (5 cols) */}
          <div id="loan-apply-form" className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
            {!isSubmitted ? (
              <>
                <div className="mb-5 pb-3 border-b border-slate-100">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                    Free Bank Consultation
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    Apply for Instant Home Loan
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Our loan executive will connect and fetch pre-approved quotes for you.
                  </p>
                </div>

                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Suraj Yadav"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-600 text-xs font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Property City</label>
                      <CustomDropdown
                        value={applicantCity}
                        onChange={(val) => setApplicantCity(val)}
                        options={CITIES.filter((c) => c !== 'All Cities')}
                        theme="subtle"
                        size="sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Employment</label>
                      <CustomDropdown
                        value={employmentType}
                        onChange={(val) => setEmploymentType(val)}
                        options={[
                          { value: 'Salaried', label: 'Salaried (MNC / Govt)' },
                          { value: 'Self-Employed', label: 'Self-Employed / Business' },
                          { value: 'Professional', label: 'Doctor / CA / Lawyer' }
                        ]}
                        theme="subtle"
                        size="sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Required Loan Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="e.g. 5000000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                  >
                    <span>{isSubmitting ? 'Submitting Application...' : 'Get Instant Pre-Approval Quotes'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Your financial data is encrypted with 256-bit bank grade security.</span>
                </div>
              </>
            ) : (
              <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Loan Application Received!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{applicantName || 'Applicant'}</strong>. Our senior loan relationship manager from <strong>{applicantCity}</strong> will contact you on <strong>+91 {applicantPhone}</strong> within 2 business hours with pre-approved rates from SBI, HDFC & ICICI.
                </p>
                <div className="p-3 bg-purple-50 rounded-xl text-purple-900 text-xs font-bold border border-purple-200">
                  Application ID: VL-{Math.floor(100000 + Math.random() * 900000)}
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-purple-700 text-white text-xs font-bold shadow-md cursor-pointer hover:bg-purple-800"
                >
                  Submit Another Inquiry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
