import React from 'react';
import { ArrowLeft, Heart, Trash2, Home, ArrowRight } from 'lucide-react';
import { Property } from '../types/property';
import { PropertyCard } from './PropertyCard';

interface ShortlistViewProps {
  shortlistedProperties: Property[];
  onBack: () => void;
  onToggleShortlist: (id: string) => void;
  onClearAll: () => void;
  onSelectProperty: (property: Property) => void;
}

export const ShortlistView: React.FC<ShortlistViewProps> = ({
  shortlistedProperties,
  onBack,
  onToggleShortlist,
  onClearAll,
  onSelectProperty,
}) => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20 animate-in fade-in duration-300">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Listings</span>
            </button>
            <div className="text-xs text-slate-500 font-medium">
              <span>Home</span> / <span className="font-bold text-slate-800">Saved Properties</span>
            </div>
          </div>

          {shortlistedProperties.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Shortlist</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Your Saved Properties</h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Keep track of verified homes, compare pricing, and contact owners when ready.
            </p>
          </div>

          <span className="text-xs font-bold text-slate-600 bg-slate-200/80 px-3 py-1.5 rounded-full">
            {shortlistedProperties.length} Properties Saved
          </span>
        </div>

        {shortlistedProperties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Saved Properties Yet</h3>
            <p className="text-sm text-slate-500 mb-6">
              Click the heart icon on any property card to save your favourite villas and apartments here.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 mx-auto"
            >
              <Home className="w-4 h-4" />
              <span>Explore Featured Properties</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortlistedProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                isShortlisted={true}
                onToggleShortlist={onToggleShortlist}
                onSelectProperty={onSelectProperty}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
