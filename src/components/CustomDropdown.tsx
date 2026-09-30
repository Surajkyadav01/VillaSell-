import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface OptionItem {
  value: string | number;
  label: string;
  badge?: string;
  sublabel?: string;
}

interface CustomDropdownProps {
  value: string | number;
  onChange: (value: any) => void;
  options: readonly (OptionItem | string)[] | (OptionItem | string)[];
  placeholder?: string;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  theme?: 'light' | 'blue' | 'subtle' | 'housing' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'right';
  disabled?: boolean;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option',
  icon,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  theme = 'light',
  size = 'md',
  align = 'left',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options to OptionItem objects
  const normalizedOptions: OptionItem[] = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault();
      const currentIndex = normalizedOptions.findIndex((opt) => String(opt.value) === String(value));
      const nextIndex = (currentIndex + 1) % normalizedOptions.length;
      onChange(normalizedOptions[nextIndex].value);
    } else if (e.key === 'ArrowUp' && isOpen) {
      e.preventDefault();
      const currentIndex = normalizedOptions.findIndex((opt) => String(opt.value) === String(value));
      const prevIndex = (currentIndex - 1 + normalizedOptions.length) % normalizedOptions.length;
      onChange(normalizedOptions[prevIndex].value);
    }
  };

  const handleSelect = (val: string | number) => {
    onChange(val);
    setIsOpen(false);
  };

  // Base styling depending on theme
  let baseButtonStyles = '';
  let menuStyles = '';

  if (theme === 'housing') {
    // Housing.com style: pure text with chevron, no border/pill
    baseButtonStyles = `bg-transparent hover:bg-white/10 text-white font-medium focus:outline-none rounded-lg transition-colors`;
    menuStyles = `bg-[#132c4d] border border-blue-500/40 shadow-2xl text-white divide-y divide-blue-800/40`;
  } else if (theme === 'blue') {
    // For Topbar or Blue backgrounds
    baseButtonStyles = `bg-slate-900/70 hover:bg-blue-900/90 text-white border border-blue-800/60 focus:border-blue-400`;
    menuStyles = `bg-[#132c4d] border border-blue-500/40 shadow-2xl text-white divide-y divide-blue-800/40`;
  } else if (theme === 'dark') {
    // For Admin Panel or Dark backgrounds
    baseButtonStyles = `bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 focus:border-blue-500`;
    menuStyles = `bg-slate-900 border border-slate-700 shadow-2xl text-white divide-y divide-slate-800`;
  } else if (theme === 'subtle') {
    // For light gray compact inputs
    baseButtonStyles = `bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600`;
    menuStyles = `bg-white border border-slate-200 shadow-xl text-slate-900 divide-y divide-slate-100`;
  } else {
    // Default Light theme for Search Bar & Forms
    baseButtonStyles = `bg-transparent hover:bg-slate-100/60 text-slate-900 font-bold focus:outline-none`;
    menuStyles = `bg-white border border-slate-200 shadow-2xl text-slate-900 divide-y divide-slate-100`;
  }

  // Size styling
  const sizeStyles = {
    sm: 'text-xs py-1 px-2.5 rounded-lg',
    md: 'text-sm py-1.5 px-3 rounded-xl',
    lg: 'text-base py-2.5 px-4 rounded-xl',
  }[size];

  return (
    <div className={`relative inline-block ${theme === 'housing' ? 'w-auto' : 'w-full'} text-left select-none ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`${theme === 'housing' ? 'w-auto' : 'w-full'} flex items-center justify-between gap-1.5 transition-all cursor-pointer ${baseButtonStyles} ${sizeStyles} ${buttonClassName} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5 truncate">
          {icon && <span className="shrink-0">{icon}</span>}
          <span className={`truncate ${theme === 'housing' ? 'font-medium text-sm text-white' : 'font-bold'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="text-[10px] bg-blue-100 text-blue-600 font-black px-1.5 py-0.2 rounded">
              {selectedOption.badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
            theme === 'housing'
              ? (isOpen ? 'rotate-180 text-white' : 'text-white/80')
              : (isOpen ? 'rotate-180 text-blue-600' : 'opacity-70')
          }`}
        />
      </button>

      {/* Dropdown Menu Popup - Crisp, Instant, Zero Black Flash */}
      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } z-50 mt-1 min-w-full max-h-64 overflow-y-auto rounded-xl p-1.5 focus:outline-none animate-in fade-in duration-100 ${menuStyles} ${menuClassName}`}
          role="listbox"
          style={{
            minWidth: theme === 'housing' ? '180px' : '100%',
            filter: 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.15))'
          }}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = String(opt.value) === String(value);

            let itemClass = '';
            if (theme === 'blue') {
              itemClass = isSelected
                ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                : 'text-blue-100 hover:bg-blue-800/80 hover:text-white font-medium';
            } else {
              itemClass = isSelected
                ? 'bg-blue-50 text-blue-600 font-extrabold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-semibold';
            }

            return (
              <div
                key={String(opt.value)}
                onClick={() => handleSelect(opt.value)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm cursor-pointer transition-colors ${itemClass}`}
                role="option"
                aria-selected={isSelected}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="truncate">{opt.label}</span>
                  {opt.sublabel && (
                    <span className="text-[11px] opacity-70 font-normal">({opt.sublabel})</span>
                  )}
                  {opt.badge && (
                    <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                      {opt.badge}
                    </span>
                  )}
                </div>

                {isSelected && (
                  <Check
                    className={`w-4 h-4 shrink-0 ${
                      theme === 'blue' ? 'text-amber-300' : 'text-blue-600'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
