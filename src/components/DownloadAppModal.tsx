import React, { useState } from 'react';
import { X, Smartphone, Download, Share2, PlusSquare, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isIOS, isInstalled, install } = usePWAInstall();
  const [selectedOS, setSelectedOS] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome === 'accepted') {
        onClose();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm sm:max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col max-h-[88vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 px-4 py-3 sm:px-5 sm:py-3.5 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 p-1 flex items-center justify-center shadow-xs shrink-0">
              <img 
                src="/favicon-48x48.png" 
                alt="VillaSell App" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-black tracking-tight leading-tight">
                  Download VillaSell App
                </h3>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                  Free
                </span>
              </div>
              <p className="text-[11px] text-blue-100">
                1-Tap Property Search on your phone
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body with safe scrollable area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
          {/* If already installed */}
          {isInstalled ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>VillaSell is already installed on your device!</span>
            </div>
          ) : isInstallable ? (
            /* 1-Tap Browser Direct Install Button */
            <div className="space-y-1.5">
              <button
                onClick={handleInstallClick}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Tap to Install App Now</span>
              </button>
              <p className="text-[10px] text-center text-slate-400">
                Instantly installs on your home screen • No heavy APK required
              </p>
            </div>
          ) : null}

          {/* OS Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <button
              onClick={() => setSelectedOS('android')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedOS === 'android'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android / Chrome</span>
            </button>
            <button
              onClick={() => setSelectedOS('ios')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedOS === 'ios'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iPhone / Safari</span>
            </button>
          </div>

          {/* Step by Step Guide (Concise, clean, fits on any screen) */}
          {selectedOS === 'android' ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Chrome में 3 आसान स्टेप्स में इंस्टॉल करें:</span>
              </p>

              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span className="text-slate-700 leading-snug">
                  ऊपर दाईं तरफ <strong className="text-slate-900">3 डॉट्स (⋮)</strong> मेन्यू पर टैप करें।
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span className="text-slate-700 leading-snug">
                  <strong className="text-slate-900">"Install app"</strong> या <strong className="text-slate-900">"Add to Home screen"</strong> चुनें।
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span className="text-slate-700 leading-snug">
                  <strong className="text-slate-900">"Install"</strong> पर टैप करें — ऐप सीधे फ़ोन में इंस्टॉल हो जाएगा!
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Safari में 3 आसान स्टेप्स में इंस्टॉल करें:</span>
              </p>

              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span className="text-slate-700 leading-snug">
                  Safari में नीचे दिए गए <strong className="text-slate-900">Share</strong> <Share2 className="w-3 h-3 inline text-blue-600 mx-0.5" /> बटन पर टैप करें।
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span className="text-slate-700 leading-snug">
                  नीचे स्क्रॉल करके <strong className="text-slate-900">Add to Home Screen</strong> <PlusSquare className="w-3 h-3 inline text-blue-600 mx-0.5" /> चुनें।
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span className="text-slate-700 leading-snug">
                  ऊपर दाईं तरफ <strong className="text-slate-900">Add</strong> दबाएं — ऐप आपकी स्क्रीन पर दिखेगा!
                </span>
              </div>
            </div>
          )}

          {/* Micro Perks in 1 Clean Row */}
          <div className="flex items-center justify-between py-1 px-2 rounded-xl bg-blue-50/60 border border-blue-100 text-[10px] font-bold text-blue-900">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>0 MB Storage</span>
            </span>
            <span className="text-blue-300">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>100% Free</span>
            </span>
            <span className="text-blue-300">•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-blue-600" />
              <span>Instant Alerts</span>
            </span>
          </div>

          {/* Close / Continue button */}
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-center"
          >
            Continue browsing on web
          </button>
        </div>
      </div>
    </div>
  );
};
