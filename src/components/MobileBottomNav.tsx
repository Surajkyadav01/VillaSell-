import React from 'react';
import { Home, Search, PlusCircle, Heart, Wrench } from 'lucide-react';
import { ActiveView } from '../types/property';

interface MobileBottomNavProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  shortlistCount: number;
  onPostPropertyClick: () => void;
  onSearchClick: () => void;
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  setActiveView,
  shortlistCount,
  onPostPropertyClick,
  onSearchClick,
  onOpenMenu,
}) => {
  // Hide bottom nav when on property-detail view to let the contact bar shine
  if (activeView === 'property-detail') return null;

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 transition-all select-none pb-[calc(env(safe-area-inset-bottom,0px)+6px)]"
    >
      <div className="grid grid-cols-5 items-center text-center">
        
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer active:scale-90 ${
            activeView === 'home' ? 'text-blue-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${activeView === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Home</span>
        </button>

        {/* 2. Quick Search */}
        <button
          type="button"
          onClick={() => {
            if (activeView !== 'home') setActiveView('home');
            onSearchClick();
          }}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 hover:text-blue-600 transition-all cursor-pointer active:scale-90"
        >
          <Search className="w-5 h-5 stroke-2" />
          <span className="text-[10px] tracking-tight mt-0.5">Search</span>
        </button>

        {/* 3. Post Property FREE (Prominent Center Button) */}
        <button
          type="button"
          onClick={onPostPropertyClick}
          className="flex flex-col items-center justify-center -mt-3.5 group cursor-pointer active:scale-90 transition-transform"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-800 text-white flex items-center justify-center shadow-lg shadow-blue-900/40 border-2 border-white group-hover:scale-105 transition-transform">
            <PlusCircle className="w-6 h-6 stroke-2" />
          </div>
          <span className="text-[9px] font-black uppercase text-blue-800 tracking-tight mt-0.5">Post Free</span>
        </button>

        {/* 4. Saved Shortlist with Badge */}
        <button
          type="button"
          onClick={() => {
            setActiveView('shortlist');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer active:scale-90 ${
            activeView === 'shortlist' ? 'text-blue-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${activeView === 'shortlist' ? 'fill-rose-500 text-rose-500 stroke-[2.5]' : 'stroke-2'}`} />
            {shortlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {shortlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Shortlist</span>
        </button>

        {/* 5. Services & Tools */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 hover:text-blue-600 transition-all cursor-pointer active:scale-90"
        >
          <Wrench className="w-5 h-5 text-blue-600 stroke-2" />
          <span className="text-[10px] tracking-tight mt-0.5">Services</span>
        </button>

      </div>
    </nav>
  );
};
