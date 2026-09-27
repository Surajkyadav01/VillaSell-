import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Crown, 
  Check, 
  ShieldCheck, 
  UserCheck, 
  Phone, 
  MessageCircle, 
  HelpCircle, 
  CheckCircle2, 
  X,
  Zap,
  ArrowRight,
  Gem,
  Award,
  Star,
  Clock,
  Lock,
  Trash2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { BRAND_CONFIG, CITIES } from '../data/mockProperties';
import { CustomDropdown } from './CustomDropdown';

interface HousingPremiumViewProps {
  onBack: () => void;
  onPostProperty: () => void;
}

export type PlanTier = 'Silver' | 'Gold' | 'Platinum';

export interface PremiumSubscription {
  id: PlanTier;
  name: string;
  price: string;
  code: string;
  userName: string;
  userPhone: string;
  city: string;
  propertyType: string;
  activatedAt: string;
  validDays: number;
}

export const HousingPremiumView: React.FC<HousingPremiumViewProps> = ({
  onBack,
  onPostProperty,
}) => {
  // Selected Plan state (can be null if user deletes / clears selection)
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(() => {
    try {
      const saved = localStorage.getItem('villasell_selected_plan');
      if (saved === 'none') return null;
      if (saved === 'Silver' || saved === 'Gold' || saved === 'Platinum') return saved;
      return 'Gold';
    } catch {
      return 'Gold';
    }
  });

  // Active / Subscribed Plan (persisted in localStorage)
  const [activeSubscription, setActiveSubscription] = useState<PremiumSubscription | null>(() => {
    try {
      const saved = localStorage.getItem('villasell_premium_subscription');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Confirm delete active plan modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  // Form & Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCity, setFormCity] = useState<string>('Mumbai');
  const [formPropertyType, setFormPropertyType] = useState('3 BHK Luxury Villa');
  const [formError, setFormError] = useState('');

  // Persist selected plan
  useEffect(() => {
    try {
      if (selectedPlan) {
        localStorage.setItem('villasell_selected_plan', selectedPlan);
      } else {
        localStorage.setItem('villasell_selected_plan', 'none');
      }
    } catch (e) {
      console.error(e);
    }
  }, [selectedPlan]);

  // Persist active subscription
  useEffect(() => {
    try {
      if (activeSubscription) {
        localStorage.setItem('villasell_premium_subscription', JSON.stringify(activeSubscription));
      } else {
        localStorage.removeItem('villasell_premium_subscription');
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeSubscription]);

  const showAlert = (msg: string) => {
    setActionAlert(msg);
    setTimeout(() => setActionAlert(null), 3500);
  };

  const plans = [
    {
      id: 'Silver' as PlanTier,
      name: 'Silver Edge',
      badge: 'Essential Pack',
      price: '₹1,999',
      duration: 'Valid for 45 Days',
      validDays: 45,
      popular: false,
      tagline: 'Best for First-Time Villa & Home Buyers',
      icon: Award,
      features: [
        'Direct contact with 25 Verified Owners',
        'Instant WhatsApp alerts for new matching villas',
        'Basic Title Clearance & RERA verification check',
        'Zero broker commission guaranteed',
        'Standard Email & Chat Helpline',
        'Standard Property Alert Notifications',
      ],
    },
    {
      id: 'Gold' as PlanTier,
      name: 'Gold Premium',
      badge: 'Most Popular for Buyers',
      price: '₹4,499',
      duration: 'Valid for 90 Days',
      validDays: 90,
      popular: true,
      tagline: 'Complete Assisted Home Buying Experience',
      icon: Crown,
      features: [
        'Unlimited Direct Verified Owner Contacts',
        'Dedicated Senior Relationship Manager (RM)',
        'Assisted Site Visit Coordinator with direct scheduling',
        'Complete In-House Legal Audit & Encumbrance Check',
        'Home Loan rate match (Save up to 0.35% p.a.)',
        '100% Money-back guarantee if no deal in 45 days',
      ],
    },
    {
      id: 'Platinum' as PlanTier,
      name: 'Platinum VIP Club',
      badge: 'Luxury Villa Buyers',
      price: '₹9,999',
      duration: 'Valid for 180 Days',
      validDays: 180,
      popular: false,
      tagline: 'Exclusive Concierge for High-End Estates & Penthouses',
      icon: Gem,
      features: [
        'Everything included in Gold Premium',
        'Exclusive Off-Market Luxury Villa Previews before public launch',
        'Lawyer-Drafted Sale Agreement & Spot Registry Support',
        'Professional Price Negotiation by Real Estate Veteran',
        'VIP Direct Line to Relationship Director 24x7',
        'Free Property Valuation Certificate for Bank Loans',
      ],
    },
  ];

  const currentPlanData = selectedPlan ? plans.find((p) => p.id === selectedPlan) || plans[1] : null;

  // Handle plan selection
  const handleSelectPlan = (planId: PlanTier) => {
    setSelectedPlan(planId);
    showAlert(`Selected ${planId} Plan`);
  };

  // Handle delete / clear selection
  const handleDeleteSelection = () => {
    setSelectedPlan(null);
    showAlert('Active selection has been removed.');
  };

  // Handle delete / cancel active subscription
  const handleConfirmDeleteActivePlan = () => {
    setActiveSubscription(null);
    setShowDeleteConfirmModal(false);
    showAlert('Active Housing Premium membership has been deleted and canceled.');
  };

  const handleOpenCheckout = (planId?: PlanTier) => {
    if (planId) {
      setSelectedPlan(planId);
    }
    setFormError('');
    setIsCheckoutOpen(true);
  };

  const handleConfirmActivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    const cleanPhone = formPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }

    const tier = selectedPlan || 'Gold';
    const planConfig = plans.find((p) => p.id === tier) || plans[1];
    const regCode = `VIP-${tier.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newSub: PremiumSubscription = {
      id: tier,
      name: planConfig.name,
      price: planConfig.price,
      code: regCode,
      userName: formName.trim(),
      userPhone: formPhone.trim(),
      city: formCity,
      propertyType: formPropertyType,
      activatedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      validDays: planConfig.validDays,
    };

    setActiveSubscription(newSub);
    setIsCheckoutOpen(false);
    showAlert(`Congratulations! ${planConfig.name} activated successfully.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 antialiased">
      {/* Dynamic Action Toast Alert */}
      {actionAlert && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionAlert}</span>
        </div>
      )}

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
              <span className="text-blue-600 font-bold">Housing Premium</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeSubscription && (
              <button
                onClick={() => setShowDeleteConfirmModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
                title="Delete Active Membership"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Delete Active Plan</span>
                <span className="sm:hidden">Delete</span>
              </button>
            )}

            <a
              href={`tel:${BRAND_CONFIG.phoneClean}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>VIP Helpline</span>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 shadow-inner text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(245,158,11,0.18),transparent_70%)] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider mb-3 shadow-md">
            <Crown className="w-4 h-4" />
            <span>Housing Premium • VillaSell Edge</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Your Personal Concierge for <br className="hidden sm:inline" />
            <span className="text-amber-400">Direct & Verified Deals</span>
          </h1>

          <p className="text-blue-100 text-xs sm:text-sm mt-3 leading-relaxed max-w-2xl mx-auto">
            Skip brokers and save up to ₹5 to 15 Lakhs in commissions. Get direct contact with verified property owners, dedicated relationship manager, and full legal documentation audit.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-6 text-xs text-blue-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Owners</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Dedicated RM Assistance</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Zero Brokerage Forever</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* ACTIVE MEMBERSHIP STATUS CARD (When user has taken a plan) */}
        {activeSubscription && (
          <div className="mb-10 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/30 relative overflow-hidden animate-in fade-in">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping" />
                    Active VIP Membership
                  </span>
                  <span className="text-emerald-200 text-xs font-semibold">
                    Code: <strong className="text-white font-mono">{activeSubscription.code}</strong>
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {activeSubscription.name} <span className="text-amber-400">({activeSubscription.price})</span>
                </h3>

                <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                  Member: <strong className="text-white">{activeSubscription.userName}</strong> • Phone: <strong className="text-white">+91 {activeSubscription.userPhone}</strong> • Activated on {activeSubscription.activatedAt}
                </p>

                <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-emerald-200">
                  <span className="bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-400/20">
                    ✓ Verified Owner Numbers Unlocked
                  </span>
                  <span className="bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-400/20">
                    ✓ Dedicated RM Assigned
                  </span>
                  <span className="bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-400/20">
                    ✓ Legal Audit Guarantee
                  </span>
                </div>
              </div>

              {/* Action Buttons: Call RM & Delete Plan */}
              <div className="flex items-center gap-3 w-full md:w-auto shrink-0 flex-wrap">
                <a
                  href={`tel:${BRAND_CONFIG.phoneClean}`}
                  className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Call RM Desk</span>
                </a>

                {/* DELETE ACTIVE PLAN BUTTON */}
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirmModal(true)}
                  className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="Delete and Cancel Active Membership"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Active Plan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block mb-1">
            Choose Your Membership Tier
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Select Silver, Gold, or Platinum Plan
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Choose your preferred plan. You can select, switch, or remove your active selection anytime.
          </p>

          {/* Quick Plan Switcher Tabs with Deselect/Clear Button */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-5 p-1.5 bg-slate-200/80 rounded-2xl max-w-xl mx-auto">
            {plans.map((p) => {
              const isSelected = selectedPlan === p.id;
              const IconComp = p.icon;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPlan(p.id)}
                  className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]'
                      : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span>{p.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-blue-800 text-blue-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {p.price}
                  </span>
                </button>
              );
            })}

            {/* Clear/Delete Active Selection button */}
            {selectedPlan && (
              <button
                type="button"
                onClick={handleDeleteSelection}
                className="py-2.5 px-3 rounded-xl font-bold text-xs bg-rose-100 hover:bg-rose-200 text-rose-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Clear Active Plan Selection"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Plans 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const PlanIcon = plan.icon;

            return (
              <div
                key={plan.id}
                onClick={() => handleSelectPlan(plan.id)}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 relative cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-blue-50/70 via-white to-white border-2 border-blue-600 ring-4 ring-blue-600/20 shadow-xl scale-[1.02] z-20'
                    : 'bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md shadow-xs z-10'
                }`}
              >
                {/* Popular or Selected Ribbon */}
                {isSelected ? (
                  <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-[11px] uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Currently Selected Plan</span>
                  </div>
                ) : plan.popular ? (
                  <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-[11px] uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    <span>Most Popular Choice</span>
                  </div>
                ) : null}

                <div>
                  {/* Card Header with Radio Select Checkbox */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 text-amber-300' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <PlanIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                        {plan.badge}
                      </span>
                    </div>

                    {/* Radio Indicator */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                        : 'border-2 border-slate-300 hover:border-slate-400 bg-white'
                    }`}>
                      {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{plan.tagline}</p>

                  <div className="mt-4 mb-6 pb-5 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/ package</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{plan.duration}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                      What's included in {plan.name}:
                    </span>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom Buttons */}
                <div className="pt-2 space-y-2">
                  {isSelected ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCheckout(plan.id);
                        }}
                        className="w-full py-3.5 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-800 text-white transform hover:scale-[1.01] active:scale-[0.99]"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Proceed to Activate {plan.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      {/* Deselect / Delete button right on card */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSelection();
                        }}
                        className="w-full py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Deselect / Remove Selection</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPlan(plan.id);
                      }}
                      className="w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm border border-slate-300 hover:border-blue-600 bg-white hover:bg-blue-50/50 text-slate-800 hover:text-blue-600 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Choose {plan.name} ({plan.price})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ACTIVE SELECTION SUMMARY BANNER WITH DELETE BUTTON */}
        <div className="mt-12 bg-white rounded-3xl p-5 sm:p-7 border-2 border-blue-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
          {currentPlanData ? (
            <>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Crown className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                      Active Selection
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{currentPlanData.badge}</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                    {currentPlanData.name} — <span className="text-blue-600">{currentPlanData.price}</span>
                  </h4>
                  <p className="text-xs text-slate-600">
                    {currentPlanData.duration} • Money-back guarantee included
                  </p>
                </div>
              </div>

              {/* Action Buttons: Delete Selection & Activate */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* DELETE SELECTION BUTTON (User Request 3) */}
                <button
                  type="button"
                  onClick={handleDeleteSelection}
                  className="px-4 py-3.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Remove this active selection"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Delete Selection</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenCheckout()}
                  className="flex-1 md:flex-none px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-800 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                >
                  <span>Activate {currentPlanData.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">No Plan Currently Selected</h4>
                  <p className="text-xs text-slate-500">
                    Click any plan (Silver, Gold, or Platinum) above to select your preferred package.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectPlan('Gold')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-800 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Select Gold (Most Popular)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL 1: CONFIRM DELETE ACTIVE SUBSCRIPTION */}
        {showDeleteConfirmModal && activeSubscription && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-100">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7 text-rose-600" />
              </div>

              <h3 className="text-xl font-black text-slate-900">
                Delete Active Premium Plan?
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete and cancel your active <strong className="text-slate-900">{activeSubscription.name}</strong> ({activeSubscription.code}) membership? This will remove your VIP Relationship Manager benefits and verified owner contact unlocks.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                Membership Code: <span className="font-mono text-blue-600">{activeSubscription.code}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  No, Keep Plan
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDeleteActivePlan}
                  className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Delete Plan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: CHECKOUT / ACTIVATION (Fast, Crisp, Zero Black Flash) */}
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-100">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-slate-200 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base leading-tight">Activate Membership</h3>
                    <p className="text-[11px] text-slate-500">Connect with dedicated Senior Relationship Manager</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Plan Switcher inside Modal */}
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                  Selected Plan Tier:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {plans.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlan(p.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedPlan === p.id
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600/30 font-black'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold'
                      }`}
                    >
                      <div className="text-xs">{p.name}</div>
                      <div className="text-[11px] font-extrabold text-blue-600 mt-0.5">{p.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Plan Details Card */}
              {currentPlanData && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Selected Tier:</span>
                    <span className="font-extrabold text-blue-900">{currentPlanData.name} ({currentPlanData.badge})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Package Cost:</span>
                    <span className="font-black text-slate-900 text-sm">{currentPlanData.price} (Inclusive of GST)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Validity Period:</span>
                    <span className="font-bold text-emerald-700">{currentPlanData.duration}</span>
                  </div>
                  <div className="pt-2 border-t border-blue-200/60 text-[11px] text-slate-500 leading-relaxed">
                    ✓ Includes direct verified owner access & money-back guarantee if no site visits arranged.
                  </div>
                </div>
              )}

              {/* Activation Form with CustomDropdown (NO BLACK SELECT POPUPS) */}
              <form onSubmit={handleConfirmActivation} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">
                    Mobile Number (For WhatsApp RM Updates) *
                  </label>
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-600">
                    <span className="px-3 py-2.5 bg-slate-50 text-xs font-bold text-slate-600 border-r border-slate-200">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full px-3.5 py-2.5 text-xs focus:outline-none font-medium bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-extrabold text-slate-800 block mb-1">
                      Preferred City
                    </label>
                    <CustomDropdown
                      value={formCity}
                      onChange={(val) => setFormCity(val)}
                      options={CITIES.filter((c) => c !== 'All Cities')}
                      theme="subtle"
                      size="sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-800 block mb-1">
                      Property Category
                    </label>
                    <CustomDropdown
                      value={formPropertyType}
                      onChange={(val) => setFormPropertyType(val)}
                      options={[
                        '3 BHK Luxury Villa',
                        '4+ BHK Royal Villa',
                        'Penthouse / Duplex',
                        'Residential Plot / Land',
                        'Commercial Space'
                      ]}
                      theme="subtle"
                      size="sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-800 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 transform hover:scale-[1.01] active:scale-[0.99] mt-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Confirm & Activate {currentPlanData?.name || 'Gold'} ({currentPlanData?.price || '₹4,499'})</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Why Premium FAQs & Guarantee */}
        <div className="mt-16 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider">
              100% Risk-Free Guarantee
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-2 mb-3">
              Find Your Dream Property in 45 Days or Get a 100% Refund
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We stand firmly behind our promise. If our Relationship Manager is unable to schedule verified site visits matching your budget within 45 days, we refund 100% of your membership fee, no questions asked.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={`tel:${BRAND_CONFIG.phoneClean}`}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call {BRAND_CONFIG.phone}</span>
              </a>
              <button
                onClick={onPostProperty}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                List Property Instead
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-extrabold text-xs text-slate-900 mb-1">
                How does a Relationship Manager (RM) help me?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your dedicated RM personally speaks with verified villa and apartment owners, filters out unverified brokers, negotiates realistic rates on your behalf, and organizes convenient weekend tours.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-extrabold text-xs text-slate-900 mb-1">
                Is legal document verification really included?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes! Our in-house legal team verifies the parent deed, Encumbrance Certificate (EC), RERA registration, municipal layout sanction, and occupancy certificate before you pay any token advance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
