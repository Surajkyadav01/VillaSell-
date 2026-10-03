import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ActiveView } from '../types/property';

interface ServicesDropdownProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

export const ServicesDropdown: React.FC<ServicesDropdownProps> = ({
  activeView,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (view: ActiveView) => {
    onNavigate(view);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const isServicesActive = 
    activeView === 'home-loan' ||
    activeView === 'housing-premium' ||
    activeView === 'emi-calculator' ||
    activeView === 'property-valuation' ||
    activeView === 'rent-receipt-generator';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button: 'Services ∨' exactly like Housing.com */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1 px-3 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer select-none ${
          isOpen || isServicesActive
            ? 'text-white bg-blue-500/80 shadow-inner border border-blue-300/40'
            : 'text-sky-100 hover:text-white hover:bg-white/10'
        }`}
        title="Housing Services & Tools"
        aria-expanded={isOpen}
      >
        <span>Services</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-sky-200 transition-transform duration-200" />
        ) : (
          <ChevronDown className="w-4 h-4 text-sky-200 transition-transform duration-200" />
        )}
      </button>

      {/* Dropdown Menu Popup (Exactly matching the user's Housing.com screenshot) */}
      {isOpen && (
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2.5 w-[390px] sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-6 z-[100] animate-in fade-in zoom-in-95 duration-150"
          style={{
            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.18))'
          }}
        >
          {/* Top Triangle Speech Bubble Caret */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-slate-200 rotate-45 z-20" />

          {/* 2-Column Layout */}
          <div className="relative z-10 grid grid-cols-2 gap-8 text-left">
            {/* Column 1: Housing Edge */}
            <div>
              <span className="block text-xs font-bold text-slate-400 mb-4 tracking-wide">
                Housing Edge
              </span>

              <div className="space-y-3.5">
                <button
                  type="button"
                  onClick={() => handleSelect('home-loan')}
                  className={`block w-full text-left text-sm font-semibold transition-colors cursor-pointer ${
                    activeView === 'home-loan'
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-800 hover:text-blue-600'
                  }`}
                >
                  Home Loan
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect('housing-premium')}
                  className={`block w-full text-left text-sm font-semibold transition-colors cursor-pointer ${
                    activeView === 'housing-premium'
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-800 hover:text-blue-600'
                  }`}
                >
                  Housing Premium
                </button>
              </div>
            </div>

            {/* Column 2: Tools */}
            <div>
              <span className="block text-xs font-bold text-slate-400 mb-4 tracking-wide">
                Tools
              </span>

              <div className="space-y-3.5">
                <button
                  type="button"
                  onClick={() => handleSelect('emi-calculator')}
                  className={`block w-full text-left text-sm font-semibold transition-colors cursor-pointer ${
                    activeView === 'emi-calculator'
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-800 hover:text-blue-600'
                  }`}
                >
                  EMI calculator
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect('property-valuation')}
                  className={`block w-full text-left text-sm font-semibold transition-colors cursor-pointer ${
                    activeView === 'property-valuation'
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-800 hover:text-blue-600'
                  }`}
                >
                  Property value calculator
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect('rent-receipt-generator')}
                  className={`block w-full text-left text-sm font-semibold transition-colors cursor-pointer ${
                    activeView === 'rent-receipt-generator'
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-800 hover:text-blue-600'
                  }`}
                >
                  Rent receipt generator
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
