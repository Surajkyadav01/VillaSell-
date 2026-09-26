import React from 'react';

export const PropertyCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[16/10] bg-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Body Skeleton */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="h-6 w-28 bg-slate-200 rounded-md" />
            <div className="h-4 w-16 bg-slate-100 rounded" />
          </div>

          {/* Title */}
          <div className="h-4 w-3/4 bg-slate-200 rounded mb-2" />
          <div className="h-3 w-1/2 bg-slate-100 rounded mb-4" />

          {/* Specs */}
          <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-4 bg-slate-200 rounded" />
          </div>
        </div>

        {/* Buttons Skeleton */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="h-8 w-24 bg-slate-200 rounded-lg" />
          <div className="h-8 w-24 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
