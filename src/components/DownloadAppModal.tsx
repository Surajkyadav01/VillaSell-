import React, { useState } from 'react';
import { X, Smartphone, Download, Share2, PlusSquare, CheckCircle2, Sparkles, ShieldCheck, RefreshCw, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { getAssetUrl } from '../utils/assetHelper';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isIOS, isInstalled, install } = usePWAInstall();
  const [selectedOS, setSelectedOS] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');
  const [copied, setCopied] = useState(false);
  const [showOtherDevicesGuide, setShowOtherDevicesGuide] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome === 'accepted') {
        onClose();
      }
    }
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'VillaSell - Official Real Estate App',
      text: 'Explore verified luxury villas, penthouses and commercial properties on the official VillaSell App!',
      url: 'https://www.villasell.com/',
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText('https://www.villasell.com/');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // fallback
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
        {/* Compact Brand Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 px-4 py-3 sm:px-5 sm:py-3.5 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 p-1 flex items-center justify-center shadow-xs shrink-0">
              <img 
                src={getAssetUrl('favicon-48x48.png')} 
                alt="VillaSell App" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-black tracking-tight leading-tight">
                  {isInstalled ? 'VillaSell Official App' : 'Download VillaSell App'}
                </h3>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  isInstalled ? 'bg-emerald-400 text-slate-950' : 'bg-amber-400 text-slate-950'
                }`}>
                  {isInstalled ? 'Active' : 'Free'}
                </span>
              </div>
              <p className="text-[11px] text-blue-100">
                {isInstalled ? 'Running on this device' : '1-Tap Property Search on your phone'}
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

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
          {/* STATE 1: Already Installed Mode */}
          {isInstalled ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-center space-y-1.5">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
                  VillaSell App आपके फ़ोन में सफलतापूर्वक इंस्टॉल है!
                </h4>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  आप अभी VillaSell का आधिकारिक ऐप इस्तेमाल कर रहे हैं। बिना किसी रुकावट के तेज़ स्पीड में विला और प्रॉपर्टी देखें।
                </p>
              </div>

              {/* Installed App Features */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>0 MB Storage Used</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% RERA Verified</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleShareApp}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Link Copied! Share on WhatsApp</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-amber-300" />
                      <span>Share VillaSell App Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  <span>Check for Latest Updates</span>
                </button>
              </div>

              {/* Toggle to see instructions for other devices */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setShowOtherDevicesGuide(!showOtherDevicesGuide)}
                  className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  {showOtherDevicesGuide ? 'छिपाएं' : 'दूसरे फ़ोन में इंस्टॉल करने के स्टेप्स देखें →'}
                </button>
              </div>

              {showOtherDevicesGuide && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
                    <button
                      onClick={() => setSelectedOS('android')}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedOS === 'android' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Android</span>
                    </button>
                    <button
                      onClick={() => setSelectedOS('ios')}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedOS === 'ios' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>iPhone / Safari</span>
                    </button>
                  </div>

                  {selectedOS === 'android' ? (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                      <p>1. Chrome में ऊपर <strong>3 डॉट्स (⋮)</strong> टैप करें</p>
                      <p>2. <strong>"Install app"</strong> या <strong>"Add to Home screen"</strong> चुनें</p>
                      <p>3. <strong>"Install"</strong> पर क्लिक करें</p>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                      <p>1. Safari में नीचे <strong>Share</strong> बटन टैप करें</p>
                      <p>2. <strong>"Add to Home Screen"</strong> चुनें</p>
                      <p>3. ऊपर <strong>"Add"</strong> पर क्लिक करें</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* STATE 2: Browser Installation Mode */
            <div className="space-y-3.5">
              {/* 1-Tap Browser Direct Install Button (When available) */}
              {isInstallable && (
                <div className="space-y-1.5">
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    <Download className="w-4 h-4 text-amber-300" />
                    <span>Tap to Install App Directly</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-400">
                    सीधे फ़ोन के होम स्क्रीन पर इंस्टॉल होगा • भारी APK की ज़रूरत नहीं
                  </p>
                </div>
              )}

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

              {/* Step by Step Guide (Compact, clean, responsive) */}
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
                      <strong className="text-slate-900">"Install"</strong> पर टैप करें — ऐप सीधे आपके फ़ोन में जुड़ जाएगा!
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

              {/* Share / Copy App Link button */}
              <button
                onClick={handleShareApp}
                className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Link Copied! Send via WhatsApp</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Share or Send App Link</span>
                  </>
                )}
              </button>

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
            </div>
          )}

          {/* Dismiss button */}
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-center"
          >
            {isInstalled ? 'Done' : 'Continue browsing on web'}
          </button>
        </div>
      </div>
    </div>
  );
};
