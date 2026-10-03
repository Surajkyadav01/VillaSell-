import React, { useState } from 'react';
import { Smartphone, Download, CheckCircle2 } from 'lucide-react';
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

  // In navbar or pill, if already installed, hide to save header space
  if (isInstalled && (variant === 'navbar' || variant === 'pill')) {
    return null;
  }

  const handleClick = async () => {
    if (isInstalled) {
      // In installed app, open the App Info & Sharing modal
      setIsModalOpen(true);
      return;
    }

    if (isInstallable) {
      try {
        const outcome = await install();
        if (outcome === 'manual' || outcome === 'dismissed') {
          setIsModalOpen(true);
        }
      } catch {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* 1. NAVBAR VARIANT (Desktop only, hidden on mobile phone screens) */}
      {variant === 'navbar' && (
        <button
          onClick={handleClick}
          type="button"
          className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 shadow-xs backdrop-blur-md transition-all cursor-pointer active:scale-95 group shrink-0 ${className}`}
          title="Install VillaSell App on your device"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
          <span className="tracking-tight whitespace-nowrap">Download App</span>
        </button>
      )}

      {/* 2. FOOTER VARIANT (Unified, Clickable, Compact & Balanced) */}
      {variant === 'footer' && (
        <button
          onClick={handleClick}
          type="button"
          className={`w-full max-w-sm sm:max-w-md mx-auto flex items-center justify-between gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-slate-900/95 via-blue-950/70 to-slate-900/95 border border-slate-800 hover:border-blue-400/50 hover:bg-slate-800/80 transition-all shadow-md group cursor-pointer active:scale-[0.98] ${className}`}
          title={isInstalled ? 'VillaSell App is Installed • Tap to view App Info' : 'Download and Install VillaSell App'}
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-700 to-slate-900 border border-blue-400/30 p-1 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <img src="/favicon-48x48.png" alt="VillaSell App" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-xs sm:text-sm tracking-tight">
                  {isInstalled ? 'VillaSell App Installed' : 'Download VillaSell App'}
                </span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  isInstalled ? 'bg-emerald-400 text-slate-950' : 'bg-amber-400 text-slate-950'
                }`}>
                  {isInstalled ? 'Active' : 'Free'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isInstalled ? 'Running on this device • Tap for info' : '1-Tap property search on your phone'}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {isInstalled ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold group-hover:bg-emerald-500/25 transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Installed</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-sm shadow-amber-400/20 group-hover:bg-amber-300 transition-colors">
                <Download className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                <span>Install</span>
              </span>
            )}
          </div>
        </button>
      )}

      {/* 3. DRAWER MENU VARIANT */}
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
                <span>{isInstalled ? 'VillaSell App (Installed)' : 'Download VillaSell App'}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-tight ${
                  isInstalled ? 'bg-emerald-400 text-slate-950' : 'bg-amber-400 text-slate-950'
                }`}>
                  {isInstalled ? 'Active' : 'Free'}
                </span>
              </p>
              <p className="text-[11px] text-slate-500">
                {isInstalled ? 'Tap to view app info & share' : 'Install directly on your phone home screen'}
              </p>
            </div>
          </div>
          {isInstalled ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <Download className="w-4 h-4 text-blue-600 group-hover:translate-y-0.5 transition-transform" />
          )}
        </button>
      )}

      {/* 4. PILL VARIANT */}
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
