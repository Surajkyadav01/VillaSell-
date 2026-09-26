import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Calculator, 
  IndianRupee, 
  Percent, 
  Calendar, 
  CheckCircle2, 
  Phone, 
  ShieldCheck, 
  Printer, 
  Share2, 
  Check, 
  ArrowRight,
  TrendingDown,
  Building2,
  Copy,
  Download,
  Mail,
  MessageCircle,
  X,
  FileText,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { BRAND_CONFIG } from '../data/mockProperties';

interface EmiCalculatorViewProps {
  onBack: () => void;
  onNavigateToHomeLoan: () => void;
}

export const EmiCalculatorView: React.FC<EmiCalculatorViewProps> = ({
  onBack,
  onNavigateToHomeLoan,
}) => {
  const [loanAmount, setLoanAmount] = useState<number>(6500000); // 65 Lakhs default
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5% default
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years default
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printSuccessAlert, setPrintSuccessAlert] = useState(false);

  // EMI Calculation Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const calculation = useMemo(() => {
    const p = Math.max(0, loanAmount);
    const r = interestRate / 12 / 100;
    const n = Math.max(1, tenureYears * 12);

    if (p <= 0 || r <= 0 || n <= 0) {
      return {
        monthlyEmi: 0,
        totalInterest: 0,
        totalPayment: 0,
        principalPercent: 100,
        interestPercent: 0,
        schedule: [],
      };
    }

    const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPayment = Math.round(emi * n);
    const totalInterest = Math.round(totalPayment - p);

    const principalPercent = Math.round((p / totalPayment) * 100);
    const interestPercent = 100 - principalPercent;

    // Generate year-wise amortization schedule (up to tenureYears)
    let balance = p;
    const schedule: Array<{
      year: number;
      openingBalance: number;
      principalPaid: number;
      interestPaid: number;
      totalPaidYear: number;
      closingBalance: number;
    }> = [];

    for (let y = 1; y <= tenureYears; y++) {
      let yearPrincipal = 0;
      let yearInterest = 0;
      const startBalance = balance;

      for (let m = 1; m <= 12; m++) {
        if (balance <= 0) break;
        const interestMonth = balance * r;
        const principalMonth = Math.min(balance, emi - interestMonth);
        yearPrincipal += principalMonth;
        yearInterest += interestMonth;
        balance -= principalMonth;
      }

      schedule.push({
        year: y,
        openingBalance: Math.round(startBalance),
        principalPaid: Math.round(yearPrincipal),
        interestPaid: Math.round(yearInterest),
        totalPaidYear: Math.round(yearPrincipal + yearInterest),
        closingBalance: Math.max(0, Math.round(balance)),
      });

      if (balance <= 0) break;
    }

    return {
      monthlyEmi: emi,
      totalInterest,
      totalPayment,
      principalPercent,
      interestPercent,
      schedule,
    };
  }, [loanAmount, interestRate, tenureYears]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatLakhs = (val: number) => {
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹ ${(val / 100000).toFixed(2)} Lakh`;
  };

  const shareTextSummary = useMemo(() => {
    return `🏡 *VillaSell Home Loan EMI Calculation*\n\n` +
      `• Loan Amount (Principal): ${formatLakhs(loanAmount)} (${formatCurrency(loanAmount)})\n` +
      `• Interest Rate: ${interestRate}% p.a.\n` +
      `• Tenure: ${tenureYears} Years (${tenureYears * 12} Months)\n` +
      `--------------------------------------\n` +
      `• *Monthly EMI: ${formatCurrency(calculation.monthlyEmi)}*\n` +
      `• Total Interest Payable: ${formatCurrency(calculation.totalInterest)}\n` +
      `• Total Amount Payable: ${formatCurrency(calculation.totalPayment)}\n\n` +
      `Calculated via VillaSell Housing Edge Tools. Check verified villas & loans at: ${window.location.origin}`;
  }, [loanAmount, interestRate, tenureYears, calculation]);

  const handleCopyClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareTextSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTextSummary)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`VillaSell Home Loan EMI Calculation: ${formatCurrency(calculation.monthlyEmi)}/mo`);
    const body = encodeURIComponent(shareTextSummary);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VillaSell Home Loan EMI Calculation',
          text: shareTextSummary,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        handleCopyClipboard();
      }
    } else {
      handleCopyClipboard();
    }
  };

  // Robust Iframe-safe print execution
  const executePrint = () => {
    try {
      const printableElement = document.getElementById('emi-official-print-template');
      if (printableElement) {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);
        
        const doc = iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>VillaSell_Home_Loan_EMI_Statement</title>
                <style>
                  @page { margin: 12mm; size: A4 portrait; }
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
                    color: #0f172a; 
                    margin: 0; 
                    padding: 24px; 
                    font-size: 13px;
                    line-height: 1.5;
                  }
                  .print-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    border-bottom: 2px solid #7e22ce; 
                    padding-bottom: 14px; 
                    margin-bottom: 20px; 
                  }
                  .brand-title { font-size: 24px; font-weight: 900; color: #7e22ce; margin: 0; }
                  .brand-sub { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-top: 2px; }
                  .ref-tag { font-size: 11px; color: #475569; text-align: right; }
                  .hero-box { 
                    background: #faf5ff; 
                    border: 1px solid #d8b4fe; 
                    border-radius: 12px; 
                    padding: 18px 22px; 
                    margin-bottom: 24px; 
                    text-align: center;
                  }
                  .emi-label { font-size: 12px; font-weight: bold; color: #6b21a8; text-transform: uppercase; letter-spacing: 0.5px; }
                  .emi-amt { font-size: 32px; font-weight: 900; color: #4c1d95; margin: 4px 0; }
                  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; }
                  .metric-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; }
                  .metric-title { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; }
                  .metric-val { font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px; }
                  table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
                  th, td { padding: 9px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
                  th { background: #f1f5f9; font-weight: 800; color: #334155; }
                  .footer-note { 
                    margin-top: 30px; 
                    padding-top: 15px; 
                    border-top: 1px solid #e2e8f0; 
                    font-size: 10px; 
                    color: #64748b; 
                    text-align: center; 
                  }
                </style>
              </head>
              <body>
                ${printableElement.innerHTML}
              </body>
            </html>
          `);
          doc.close();
          setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            setPrintSuccessAlert(true);
            setTimeout(() => setPrintSuccessAlert(false), 4000);
            setTimeout(() => {
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
              }
            }, 1000);
          }, 350);
          return;
        }
      }
      // Direct window.print() fallback
      window.print();
      setPrintSuccessAlert(true);
      setTimeout(() => setPrintSuccessAlert(false), 4000);
    } catch (e) {
      window.print();
    }
  };

  const handleDownloadTextReport = () => {
    const blob = new Blob([shareTextSummary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VillaSell_Home_Loan_EMI_${tenureYears}Yr_${formatLakhs(loanAmount).replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 antialiased">
      {/* Top Breadcrumb & Header */}
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
              <span className="text-slate-900 font-bold">Housing Tools</span>
              <span>/</span>
              <span className="text-purple-700 font-bold">EMI Calculator</span>
            </div>
          </div>

          {/* Action Buttons: Visible on all screens */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs transition-all shadow-xs cursor-pointer"
              title="Share EMI Calculation"
            >
              <Share2 className="w-3.5 h-3.5 text-purple-700" />
              <span>Share EMI</span>
            </button>
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs transition-all shadow-xs cursor-pointer"
              title="Print or Save PDF Statement"
            >
              <Printer className="w-3.5 h-3.5 text-slate-700" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Print Success Toast */}
      {printSuccessAlert && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Printing document sent! You can also save as PDF from print dialog.</span>
        </div>
      )}

      {/* Main Content Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Real Estate Financial Tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Home Loan <span className="text-purple-700">EMI Calculator</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Calculate your exact monthly installments, total interest, and complete year-wise amortization breakdown for your dream villa or apartment.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sliders & Inputs (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-7">
            {/* Input 1: Loan Amount */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-extrabold text-slate-800">
                  Loan Amount (Principal)
                </label>
                <div className="flex items-center bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                  <span className="text-xs font-bold text-purple-700 mr-1">₹</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    min={100000}
                    max={100000000}
                    step={50000}
                    className="w-28 text-right font-black text-slate-900 text-sm bg-transparent focus:outline-none"
                  />
                </div>
              </div>
              <input
                type="range"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                min={500000}
                max={50000000}
                step={100000}
                className="w-full accent-purple-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mt-1">
                <span>₹5 Lakhs</span>
                <span className="font-extrabold text-purple-700">{formatLakhs(loanAmount)}</span>
                <span>₹5 Crores</span>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {[2500000, 5000000, 7500000, 15000000, 30000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setLoanAmount(amt)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      loanAmount === amt
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {formatLakhs(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Interest Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-extrabold text-slate-800">
                  Annual Interest Rate (% p.a.)
                </label>
                <div className="flex items-center bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    min={5}
                    max={18}
                    step={0.05}
                    className="w-16 text-right font-black text-slate-900 text-sm bg-transparent focus:outline-none"
                  />
                  <span className="text-xs font-bold text-purple-700 ml-1">%</span>
                </div>
              </div>
              <input
                type="range"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                min={6.5}
                max={14}
                step={0.1}
                className="w-full accent-purple-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mt-1">
                <span>6.5%</span>
                <span className="font-extrabold text-purple-700">{interestRate}% p.a.</span>
                <span>14%</span>
              </div>

              {/* Rate presets */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {[8.35, 8.5, 8.75, 9.0, 9.25].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setInterestRate(rate)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      interestRate === rate
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* Input 3: Loan Tenure */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-extrabold text-slate-800">
                  Loan Tenure (Years)
                </label>
                <div className="flex items-center bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                  <input
                    type="number"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    min={1}
                    max={30}
                    className="w-14 text-right font-black text-slate-900 text-sm bg-transparent focus:outline-none"
                  />
                  <span className="text-xs font-bold text-purple-700 ml-1">Years</span>
                </div>
              </div>
              <input
                type="range"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                min={1}
                max={30}
                step={1}
                className="w-full accent-purple-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mt-1">
                <span>1 Year</span>
                <span className="font-extrabold text-purple-700">{tenureYears} Years ({tenureYears * 12} Months)</span>
                <span>30 Years</span>
              </div>

              {/* Tenure presets */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {[10, 15, 20, 25, 30].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenureYears(t)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      tenureYears === t
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t} Yrs
                  </button>
                ))}
              </div>
            </div>

            {/* Bank Rates Comparison Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
                Top Partner Bank Interest Rates Today
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="font-bold block text-slate-800">State Bank of India</span>
                  <span className="text-emerald-600 font-extrabold text-sm">8.35%*</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="font-bold block text-slate-800">HDFC Bank</span>
                  <span className="text-emerald-600 font-extrabold text-sm">8.45%*</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="font-bold block text-slate-800">ICICI Bank</span>
                  <span className="text-emerald-600 font-extrabold text-sm">8.50%*</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="font-bold block text-slate-800">Axis Bank</span>
                  <span className="text-emerald-600 font-extrabold text-sm">8.55%*</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Results & Chart (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                Monthly Repayment Breakdown
              </span>

              {/* Big Monthly EMI Display */}
              <div className="mt-4 mb-6">
                <span className="text-xs text-slate-300 font-medium block">Your Monthly EMI:</span>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight mt-1">
                  {formatCurrency(calculation.monthlyEmi)}
                  <span className="text-xs font-semibold text-slate-300 ml-1.5">/ month</span>
                </div>
              </div>

              {/* Progress Visual Bar */}
              <div className="space-y-2 mb-6">
                <div className="h-3 w-full bg-purple-950 rounded-full overflow-hidden flex border border-white/10">
                  <div
                    style={{ width: `${calculation.principalPercent}%` }}
                    className="bg-emerald-400 h-full transition-all duration-500"
                    title={`Principal: ${calculation.principalPercent}%`}
                  />
                  <div
                    style={{ width: `${calculation.interestPercent}%` }}
                    className="bg-amber-400 h-full transition-all duration-500"
                    title={`Interest: ${calculation.interestPercent}%`}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                    Principal ({calculation.principalPercent}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    Interest ({calculation.interestPercent}%)
                  </span>
                </div>
              </div>

              {/* Summary Stats Grid */}
              <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Principal Amount:</span>
                  <span className="font-extrabold text-white text-sm">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Total Interest Payable:</span>
                  <span className="font-extrabold text-amber-300 text-sm">{formatCurrency(calculation.totalInterest)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-slate-200 font-bold">Total Payment (P + I):</span>
                  <span className="font-black text-emerald-400 text-base">{formatCurrency(calculation.totalPayment)}</span>
                </div>
              </div>

              {/* Next Step CTA */}
              <button
                onClick={onNavigateToHomeLoan}
                className="w-full mt-6 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Apply for Home Loan at this EMI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Instant Consultation Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900">Need Personalized Guidance?</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Talk with our bank relationship manager
                </p>
              </div>
              <a
                href={`tel:${BRAND_CONFIG.phoneClean}`}
                className="px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-purple-700" />
                <span>Call Expert</span>
              </a>
            </div>
          </div>
        </div>

        {/* Year-Wise Amortization Table */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Yearly Amortization Schedule
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Principal and interest breakdown across {tenureYears} years of loan repayment
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg">
              {tenureYears * 12} Installments Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-3 rounded-l-lg">Year</th>
                  <th className="py-3 px-3">Opening Balance</th>
                  <th className="py-3 px-3">EMI Paid / Yr</th>
                  <th className="py-3 px-3 text-emerald-700">Principal Paid</th>
                  <th className="py-3 px-3 text-amber-700">Interest Paid</th>
                  <th className="py-3 px-3 rounded-r-lg text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculation.schedule.map((row) => (
                  <tr key={row.year} className="hover:bg-purple-50/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Year {row.year}</td>
                    <td className="py-2.5 px-3 text-slate-600">{formatCurrency(row.openingBalance)}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{formatCurrency(row.totalPaidYear)}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">{formatCurrency(row.principalPaid)}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-700">{formatCurrency(row.interestPaid)}</td>
                    <td className="py-2.5 px-3 font-black text-slate-900 text-right">{formatCurrency(row.closingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SHARE EMI MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base leading-tight">Share EMI Calculation</h3>
                  <p className="text-[11px] text-slate-500">Send estimate directly via WhatsApp or copy summary</p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Snapshot Preview Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/50 border border-purple-100 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Loan Amount:</span>
                <span className="font-extrabold text-slate-900">{formatCurrency(loanAmount)} ({formatLakhs(loanAmount)})</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Interest & Tenure:</span>
                <span className="font-extrabold text-slate-900">{interestRate}% p.a. • {tenureYears} Years</span>
              </div>
              <div className="pt-2 border-t border-purple-200/60 flex justify-between items-center">
                <span className="text-xs font-bold text-purple-900">Monthly EMI:</span>
                <span className="text-lg font-black text-purple-700">{formatCurrency(calculation.monthlyEmi)}<span className="text-[11px] font-medium text-slate-500">/mo</span></span>
              </div>
            </div>

            {/* Sharing Channels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleWhatsAppShare}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Share</span>
              </button>

              <button
                onClick={handleNativeShare}
                className="w-full py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Quick Share</span>
              </button>

              <button
                onClick={handleCopyClipboard}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary Text'}</span>
              </button>

              <button
                onClick={handleEmailShare}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-slate-600" />
                <span>Share via Email</span>
              </button>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Includes full year-wise amortization & interest schedule details</span>
            </div>
          </div>
        </div>
      )}

      {/* PRINT / PDF PREVIEW MODAL */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base leading-tight">Official Home Loan EMI Statement</h3>
                  <p className="text-[11px] text-slate-500">Print or save as PDF for your bank home loan application</p>
                </div>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Statement Preview (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-900 bg-white">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-purple-700 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-purple-700" />
                    <span className="text-xl font-black text-slate-900 tracking-tight">Villa<span className="text-purple-700">Sell</span></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Housing Edge</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">India's Verified Luxury Villa & Residential Loan Advisory</p>
                </div>
                <div className="text-left sm:text-right text-[11px] text-slate-500">
                  <p className="font-bold text-slate-800">Statement ID: VS-EMI-{Math.floor(100000 + (loanAmount % 900000))}</p>
                  <p>Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Big Highlight Box */}
              <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 text-center">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700">
                  Calculated Monthly Repayment (EMI)
                </span>
                <div className="text-3xl sm:text-4xl font-black text-purple-900 mt-1">
                  {formatCurrency(calculation.monthlyEmi)}
                  <span className="text-xs font-bold text-slate-600 ml-1">/ month</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Applicable for {tenureYears} years ({tenureYears * 12} monthly installments) at {interestRate}% p.a.
                </p>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Principal Loan</span>
                  <span className="text-base font-black text-slate-900 mt-0.5 block">{formatCurrency(loanAmount)}</span>
                  <span className="text-[11px] font-semibold text-purple-700">{formatLakhs(loanAmount)}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Total Interest Payable</span>
                  <span className="text-base font-black text-amber-700 mt-0.5 block">{formatCurrency(calculation.totalInterest)}</span>
                  <span className="text-[11px] font-semibold text-slate-600">{calculation.interestPercent}% of total</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Total Repayment (P + I)</span>
                  <span className="text-base font-black text-emerald-700 mt-0.5 block">{formatCurrency(calculation.totalPayment)}</span>
                  <span className="text-[11px] font-semibold text-slate-600">Principal + Total Interest</span>
                </div>
              </div>

              {/* Summary Schedule Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                    First 5 Years Amortization Breakdown
                  </span>
                  <span className="text-[11px] text-slate-500">Yearly summary</span>
                </div>
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-2">Year</th>
                      <th className="p-2">Opening Bal</th>
                      <th className="p-2">Annual EMI</th>
                      <th className="p-2 text-emerald-700">Principal</th>
                      <th className="p-2 text-amber-700">Interest</th>
                      <th className="p-2 text-right">Closing Bal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {calculation.schedule.slice(0, 5).map((row) => (
                      <tr key={row.year}>
                        <td className="p-2 font-bold">Year {row.year}</td>
                        <td className="p-2 text-slate-600">{formatCurrency(row.openingBalance)}</td>
                        <td className="p-2 font-medium">{formatCurrency(row.totalPaidYear)}</td>
                        <td className="p-2 font-bold text-emerald-700">{formatCurrency(row.principalPaid)}</td>
                        <td className="p-2 font-bold text-amber-700">{formatCurrency(row.interestPaid)}</td>
                        <td className="p-2 font-black text-right">{formatCurrency(row.closingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Official Disclaimer Footer */}
              <div className="p-3 bg-slate-50 rounded-xl text-[10px] text-slate-500 space-y-1 border border-slate-200 leading-relaxed">
                <p className="font-bold text-slate-700">Disclaimer & Verification Notice:</p>
                <p>
                  This calculation is generated for informational planning purposes based on standard reducing balance method. Exact EMI, processing fees, and interest rates are subject to individual bank eligibility, credit score, and final loan sanctions from partner banks (SBI, HDFC, ICICI, Axis).
                </p>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                onClick={handleDownloadTextReport}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Download .TXT File</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={executePrint}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN PRINTABLE TEMPLATE (Targeted by iframe printer for clean output) */}
      <div id="emi-official-print-template" style={{ display: 'none' }}>
        <div className="print-header">
          <div>
            <h1 className="brand-title">VillaSell Housing Edge</h1>
            <div className="brand-sub">Official Home Loan EMI Estimate & Amortization Statement</div>
          </div>
          <div className="ref-tag">
            <strong>Statement Ref:</strong> VS-EMI-{Math.floor(100000 + (loanAmount % 900000))}<br />
            <strong>Date:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>

        <div className="hero-box">
          <div className="emi-label">Calculated Monthly Installment (EMI)</div>
          <div className="emi-amt">{formatCurrency(calculation.monthlyEmi)} / month</div>
          <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
            Tenure: {tenureYears} Years ({tenureYears * 12} Months) | Interest Rate: {interestRate}% p.a.
          </div>
        </div>

        <div className="grid-3">
          <div className="metric-card">
            <div className="metric-title">Principal Loan Amount</div>
            <div className="metric-val">{formatCurrency(loanAmount)}</div>
            <div style={{ fontSize: '10px', color: '#7e22ce', fontWeight: 'bold' }}>{formatLakhs(loanAmount)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Total Interest Payable</div>
            <div className="metric-val" style={{ color: '#b45309' }}>{formatCurrency(calculation.totalInterest)}</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>{calculation.interestPercent}% of repayment</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Total Repayment (P + I)</div>
            <div className="metric-val" style={{ color: '#047857' }}>{formatCurrency(calculation.totalPayment)}</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Principal + Total Interest</div>
          </div>
        </div>

        <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '20px 0 8px 0', textTransform: 'uppercase' }}>
          Yearly Amortization Schedule (Summary)
        </h3>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Opening Balance</th>
              <th>Total Paid / Yr</th>
              <th>Principal Paid</th>
              <th>Interest Paid</th>
              <th style={{ textAlign: 'right' }}>Closing Balance</th>
            </tr>
          </thead>
          <tbody>
            {calculation.schedule.map((row) => (
              <tr key={row.year}>
                <td><strong>Year {row.year}</strong></td>
                <td>{formatCurrency(row.openingBalance)}</td>
                <td>{formatCurrency(row.totalPaidYear)}</td>
                <td style={{ color: '#047857', fontWeight: 'bold' }}>{formatCurrency(row.principalPaid)}</td>
                <td style={{ color: '#b45309', fontWeight: 'bold' }}>{formatCurrency(row.interestPaid)}</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(row.closingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="footer-note">
          VillaSell Real Estate Network • Helpline: {BRAND_CONFIG.phone} • Email: {BRAND_CONFIG.email}<br />
          Note: Indicative EMI calculation based on standard reducing balance method. Terms and sanction subject to partner bank credit criteria.
        </div>
      </div>
    </div>
  );
};
