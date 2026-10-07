import React from 'react';
import { 
  Heart, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2, 
  CheckCircle2, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  ArrowRight,
  Sparkles,
  Building,
  Video
} from 'lucide-react';
import { Property } from '../types/property';
import { BRAND_CONFIG } from '../data/brandConfig';
import { LazyImage } from './LazyImage';

interface PropertyCardProps {
  property: Property;
  isShortlisted: boolean;
  onToggleShortlist: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isShortlisted,
  onToggleShortlist,
  onSelectProperty,
}) => {
  const whatsappMessage = encodeURIComponent(
    `Hello VillaSell, I am interested in: "${property.title}" (Price: ${property.priceDisplay}, Location: ${property.locality}, ${property.city}). Please connect me with the seller.`
  );

  const directWhatsAppLink = `https://wa.me/918383826205?text=${whatsappMessage}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:border-blue-300">
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelectProperty(property)}>
        <LazyImage
          src={property.images[0]}
          alt={property.title}
          aspectRatioClass="aspect-[16/10]"
          className="group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          {property.isVerified && (
            <span className="flex items-center gap-1 bg-emerald-600/95 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          )}

          {property.isZeroBrokerage && (
            <span className="bg-blue-600/95 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              Zero Brokerage
            </span>
          )}

          {property.videos && property.videos.length > 0 && (
            <span className="flex items-center gap-1 bg-amber-500/95 backdrop-blur-md text-slate-950 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              <Video className="w-3 h-3 text-slate-950" />
              Video Tour
            </span>
          )}

          {property.reraId && (
            <span className="hidden sm:inline-block bg-slate-900/80 backdrop-blur-md text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-md">
              RERA
            </span>
          )}
        </div>

        {/* Shortlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleShortlist(property.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 flex items-center justify-center transition-all shadow-md cursor-pointer hover:scale-110 active:scale-90"
          title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
          aria-label="Toggle shortlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isShortlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
            }`}
          />
        </button>

        {/* Bottom Banner inside Image: Property Type & Status */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded-md font-semibold text-[11px] flex items-center gap-1">
            <Building className="w-3 h-3 text-sky-300" />
            {property.propertyType}
          </span>
          <span className="bg-emerald-500/90 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider">
            {property.status}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Price Per Sq.Ft */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {property.priceDisplay}
              </span>
              {property.pricePerSqFt > 0 && (
                <span className="text-xs text-slate-500 font-medium ml-2">
                  (₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft)
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {property.furnishing}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProperty(property)}
            className="font-bold text-slate-900 text-base line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer mb-1.5"
            title={property.title}
          >
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="line-clamp-1 font-medium">
              {property.locality}, {property.city}
            </span>
          </div>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-4">
            {property.bedrooms > 0 ? (
              <div className="flex items-center gap-1.5 text-slate-700">
                <BedDouble className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-bold">{property.bedrooms} BHK</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-bold">{property.propertyType}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-slate-700">
              <Bath className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="font-bold">{property.bathrooms} Baths</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-700">
              <Maximize2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="font-bold">{property.areaSqFt} sq.ft</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: View Details & Direct WhatsApp */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          {/* WhatsApp Owner */}
          <a
            href={directWhatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors"
            title="Chat directly on WhatsApp (+91 8383826205)"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          {/* Quick Call */}
          <a
            href={`tel:${BRAND_CONFIG.phoneClean}`}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            title={`Call +91 8383826205`}
          >
            <Phone className="w-3.5 h-3.5 text-slate-700" />
          </a>

          {/* Full Dedicated Page View Details */}
          <button
            onClick={() => onSelectProperty(property)}
            className="flex-[1.3] flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer transform active:scale-95"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
