import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  User, 
  MapPin, 
  CreditCard,
  Sparkles
} from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';

interface RentReceiptViewProps {
  onBack: () => void;
}

export const RentReceiptView: React.FC<RentReceiptViewProps> = ({ onBack }) => {
  const [tenantName, setTenantName] = useState('Suraj Yadav');
  const [landlordName, setLandlordName] = useState('Rameshwar K. Sharma');
  const [landlordPan, setLandlordPan] = useState('ABCDE1234F');
  const [propertyAddress, setPropertyAddress] = useState('Flat 402, Tower B, Green Crest Enclave, Sarjapur, Bangalore - 560035');
  const [monthlyRent, setMonthlyRent] = useState<number>(28000);
  const [paymentMode, setPaymentMode] = useState('Online Transfer / UPI');
  const [selectedMonth, setSelectedMonth] = useState('March 2026');
  const [financialYear, setFinancialYear] = useState('FY 2025-2026');

  const months = [
    'April 2025', 'May 2025', 'June 2025', 'July 2025',
    'August 2025', 'September 2025', 'October 2025', 'November 2025',
    'December 2025', 'January 2026', 'February 2026', 'March 2026'
  ];

  const inWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const numToWordsLessThanThousand = (n: number): string => {
      let str = '';
      if (n >= 100) {
        str += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n >= 20) {
        str += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      }
      if (n > 0) {
        str += ones[n] + ' ';
      }
      return str.trim();
    };

    if (num === 0) return 'Zero Rupees Only';

    let result = '';
    const crore = Math.floor(num / 10000000);
    num %= 10000000;
    const lakh = Math.floor(num / 100000);
    num %= 100000;
    const thousand = Math.floor(num / 1000);
    num %= 1000;
    const remainder = num;

    if (crore > 0) result += numToWordsLessThanThousand(crore) + ' Crore ';
    if (lakh > 0) result += numToWordsLessThanThousand(lakh) + ' Lakh ';
    if (thousand > 0) result += numToWordsLessThanThousand(thousand) + ' Thousand ';
    if (remainder > 0) result += numToWordsLessThanThousand(remainder) + ' ';

    return (result.trim() + ' Rupees Only');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 antialiased">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-30 shadow-xs print:hidden">
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
              <span className="text-purple-700 font-bold">Rent Receipt Generator</span>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-3xl mx-auto mb-8 print:hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-extrabold uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Income Tax & HRA Exemption Tool</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Free <span className="text-purple-700">Rent Receipt Generator</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Generate and download valid, Income Tax compliant rent receipts with revenue stamp formatting to claim House Rent Allowance (HRA) tax deductions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Details (5 cols, hidden when printing) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4 print:hidden">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-purple-700" />
              <span>Tenant & Landlord Details</span>
            </h3>

            {/* Tenant Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tenant Full Name</label>
              <input
                type="text"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
              />
            </div>

            {/* Landlord Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Landlord Full Name</label>
              <input
                type="text"
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                placeholder="Property owner's name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
              />
            </div>

            {/* Landlord PAN */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">Landlord PAN</label>
                <span className="text-[10px] text-slate-400">Mandatory if rent &gt; ₹1 Lakh/yr</span>
              </div>
              <input
                type="text"
                maxLength={10}
                value={landlordPan}
                onChange={(e) => setLandlordPan(e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 uppercase focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
              />
            </div>

            {/* Monthly Rent */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Rent Amount (₹)</label>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                min={1000}
                step={500}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rented House Address</label>
              <textarea
                rows={2}
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                placeholder="Full address of the rented flat/villa"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
              />
            </div>

            {/* Month & Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Receipt Month</label>
                <CustomDropdown
                  value={selectedMonth}
                  onChange={(val) => setSelectedMonth(val)}
                  options={months}
                  theme="subtle"
                  size="sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode</label>
                <CustomDropdown
                  value={paymentMode}
                  onChange={(val) => setPaymentMode(val)}
                  options={[
                    'Online Transfer / UPI',
                    'Bank Cheque',
                    'Cash Payment'
                  ]}
                  theme="subtle"
                  size="sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print or Save this Receipt as PDF</span>
              </button>
            </div>
          </div>

          {/* Right Column: Official Rent Receipt Card (7 cols, main print target) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-300 shadow-md print:border-none print:shadow-none print:p-0">
            {/* Inner Bordered Formal Receipt */}
            <div className="border-2 border-slate-800 p-6 sm:p-8 rounded-2xl relative bg-white">
              {/* Receipt Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-wider uppercase font-serif">
                    RENT RECEIPT
                  </h2>
                  <span className="text-[11px] font-bold text-slate-600">
                    (Under Section 10(13A) of Income Tax Act, 1961)
                  </span>
                </div>
                <div className="text-right text-xs">
                  <span className="font-extrabold text-slate-900 block">RECEIPT NO: VR-{Math.floor(100000 + Math.random() * 900000)}</span>
                  <span className="text-slate-600 font-medium">Date: 01 {selectedMonth}</span>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif">
                <p>
                  Received with thanks from Mr./Ms.{' '}
                  <strong className="underline underline-offset-4 decoration-slate-400 font-bold text-slate-950 font-sans">
                    {tenantName || 'Tenant Name'}
                  </strong>{' '}
                  a sum of{' '}
                  <strong className="underline underline-offset-4 decoration-slate-400 font-bold text-slate-950 font-sans">
                    ₹{monthlyRent.toLocaleString('en-IN')}/-
                  </strong>{' '}
                  (
                  <span className="italic font-medium">
                    {inWords(monthlyRent)}
                  </span>
                  ) towards the house rent for the month of{' '}
                  <strong className="underline underline-offset-4 decoration-slate-400 font-bold text-slate-950 font-sans">
                    {selectedMonth}
                  </strong>{' '}
                  for residential property situated at:
                </p>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs font-semibold text-slate-900">
                  📍 {propertyAddress || 'Enter Property Address'}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 font-sans text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">Mode of Payment:</span>
                    <span className="font-bold text-slate-900">{paymentMode}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Financial Year:</span>
                    <span className="font-bold text-slate-900">{financialYear}</span>
                  </div>
                </div>
              </div>

              {/* Footer Stamp & Signatures */}
              <div className="mt-8 pt-6 border-t-2 border-slate-800 flex items-end justify-between">
                {/* Revenue Stamp simulation */}
                <div className="border border-dashed border-slate-400 w-24 h-24 rounded-lg flex flex-col items-center justify-center p-2 text-center bg-slate-50 text-[10px] text-slate-500">
                  <span className="font-extrabold text-slate-700">₹1 REVENUE STAMP</span>
                  <span className="text-[8px] text-slate-400 mt-1">(Affix if rent &gt; ₹5,000 in cash)</span>
                </div>

                {/* Landlord Details & Signature */}
                <div className="text-right text-xs space-y-1">
                  <div className="h-10 border-b border-slate-400 w-44 ml-auto mb-1 flex items-end justify-center">
                    <span className="text-[10px] italic text-slate-400">Signature of Landlord</span>
                  </div>
                  <span className="font-black text-slate-900 block font-sans text-sm">
                    {landlordName || 'Landlord Name'}
                  </span>
                  {landlordPan && (
                    <span className="text-[11px] text-slate-600 block font-sans font-bold">
                      PAN: {landlordPan}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 block">Property Owner</span>
                </div>
              </div>
            </div>

            {/* Income Tax Advice */}
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 print:hidden">
              <span className="font-extrabold block mb-0.5">💡 Income Tax Rule for HRA Exemption:</span>
              As per CBDT regulations, if the annual rent paid by an employee exceeds ₹1,00,000, quoting the Landlord's PAN is mandatory to claim HRA tax exemption from employers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
