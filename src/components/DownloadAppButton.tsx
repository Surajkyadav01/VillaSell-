import React, { useState } from 'react';
import { Smartphone, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { DownloadAppModal } from './DownloadAppModal';

interface DownloadAppButtonProps {
  variant?: 'navbar' | 'footer' | 'drawer' | 'pill';
  className?: string;
}

export const DownloadAppButton: React.FC<DownloadAppButtonProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If already running inside installed standalone PWA, don't show the download button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome === 'manual' || outcome === 'dismissed') {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {variant === 'navbar' && (
        <button
          onClick={handleClick}
          type="button"
          className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 shadow-xs backdrop-blur-md transition-all cursor-pointer active:scale-95 group shrink-0 ${className}`}
          title="Install VillaSell App on your device"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
          <span className="tracking-tight whitespace-nowrap">Download App</span>
        </button>
      )}

      {variant === 'footer' && (
        <button
          onClick={handleClick}
          type="button"
          className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-400/20 transition-all cursor-pointer active:scale-95 group shrink-0 ${className}`}
        >
          <Smartphone className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform shrink-0" />
          <span className="whitespace-nowrap">Download VillaSell App</span>
        </button>
      )}

      {variant === 'drawer' && (
        <button
          onClick={handleClick}
          type="button"
          className={`w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-200 hover:border-blue-300 transition-all text-left cursor-pointer group ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span>Download VillaSell App</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-tight bg-amber-400 text-slate-950">Free</span>
              </p>
              <p className="text-[11px] text-slate-500">Install directly on your phone home screen</p>
            </div>
          </div>
          <Download className="w-4 h-4 text-blue-600 group-hover:translate-y-0.5 transition-transform" />
        </button>
      )}

      {variant === 'pill' && (
        <button
          onClick={handleClick}
          type="button"
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-600" />
          <span>Download App</span>
        </button>
      )}

      {/* Guided Modal */}
      <DownloadAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
