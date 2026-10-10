import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Mail, 
  MapPin, 
  ExternalLink,
  MessageCircle,
  Building,
  Maximize2
} from 'lucide-react';
import { Property } from '../types/property';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  property,
}) => {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !property) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const shareUrl = `${origin}${pathname}?property=${encodeURIComponent(property.id)}`;

  const shareText = `🏡 Check out this verified property on VillaSell: ${property.title} in ${property.locality}, ${property.city} for ${property.priceDisplay}!`;

  const areaText = property.plotAreaValue && property.plotAreaUnit 
    ? `${property.plotAreaValue} ${property.plotAreaUnit}` 
    : `${property.areaSqFt} sq.ft`;
  
  const whatsappMessage = `🏡 *${property.title}*\n📍 Location: ${property.locality}, ${property.city}\n💰 Price: *${property.priceDisplay}*\n📐 Area: ${areaText}\n🏷 Type: ${property.propertyType}\n\n👉 *View complete property details, photos & verified documents here:*\n${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for iframe environments
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Copy link fallback:', err);
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or sheet closed
      }
    } else {
      handleCopyLink();
    }
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const emailSubject = `Verified Property on VillaSell: ${property.title}`;
  const emailBody = `Hi,\n\nI found this property on VillaSell and thought you might be interested:\n\n${property.title}\nLocation: ${property.locality}, ${property.city}\nPrice: ${property.priceDisplay}\nArea: ${areaText}\n\nView listing details, photos and contact info:\n${shareUrl}\n`;
  const emailShareUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-blue-50/30 to-indigo-50/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base leading-tight">Share Property</h3>
              <p className="text-xs text-slate-500">Share verified listing with family, friends & clients</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close share dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Property Mini Preview Card */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs">
            <img
              src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'}
              alt={property.title}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-slate-200 shadow-2xs"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100/60">
                  {property.propertyType}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/60">
                  {property.status}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate mt-1">
                {property.title}
              </h4>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{property.locality}, {property.city}</span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-xs sm:text-sm font-black text-blue-900">
                  {property.priceDisplay}
                </span>
                <span className="text-[11px] text-slate-600 font-medium">
                  {areaText}
                </span>
              </div>
            </div>
          </div>

          {/* Featured Primary WhatsApp Share Button */}
          <div>
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer transform active:scale-[0.99]"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Share Directly on WhatsApp</span>
              <span className="text-[10px] uppercase tracking-wider bg-white/20 text-white font-black px-2 py-0.5 rounded-full ml-1">
                Fastest
              </span>
            </a>
          </div>

          {/* Social Channels Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Or Share Via Social Media:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {/* Facebook */}
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-2xs hover:shadow-md transform active:scale-95"
                title="Share on Facebook"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-current mb-1">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-[11px] font-bold truncate">Facebook</span>
              </a>

              {/* X (Twitter) */}
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-slate-900 hover:bg-black text-white transition-all shadow-2xs hover:shadow-md transform active:scale-95"
                title="Share on X (Twitter)"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-current mb-1">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-[11px] font-bold truncate">X (Twitter)</span>
              </a>

              {/* Telegram */}
              <a
                href={telegramShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white transition-all shadow-2xs hover:shadow-md transform active:scale-95"
                title="Share on Telegram"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-current mb-1">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
                <span className="text-[11px] font-bold truncate">Telegram</span>
              </a>

              {/* LinkedIn */}
              <a
                href={linkedinShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white transition-all shadow-2xs hover:shadow-md transform active:scale-95"
                title="Share on LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-current mb-1">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                <span className="text-[11px] font-bold truncate">LinkedIn</span>
              </a>

              {/* Email */}
              <a
                href={emailShareUrl}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-2xs hover:shadow-md transform active:scale-95"
                title="Share via Email"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                <span className="text-[11px] font-bold truncate">Email</span>
              </a>
            </div>
          </div>

          {/* Direct Copy Link Input Bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                Copy Listing Link:
              </label>
              {copied && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" /> Copied to clipboard!
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <input
                ref={inputRef}
                type="text"
                readOnly
                value={shareUrl}
                onClick={handleCopyLink}
                className="flex-1 px-3 py-2 text-xs font-medium text-slate-700 bg-transparent outline-none truncate select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Native System Share Button (if supported on mobile/tablet) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>More Sharing Options (Instagram, SMS, Bluetooth, etc.)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
