import React, { useState, useEffect, useRef } from 'react';
import { ImageOff, Building2 } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatioClass?: string;
  fallbackIcon?: React.ReactNode;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatioClass = 'aspect-[16/10]',
  fallbackIcon,
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Reset states if src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-slate-100 ${aspectRatioClass} ${className}`}
    >
      {/* Shimmering Skeleton Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse flex items-center justify-center">
          <div className="text-slate-300 flex flex-col items-center gap-1">
            {fallbackIcon || <Building2 className="w-8 h-8 opacity-40 animate-bounce" />}
            <span className="text-[10px] font-semibold text-slate-400">Loading...</span>
          </div>
        </div>
      )}

      {/* Fallback if image fails to load */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
          <ImageOff className="w-8 h-8 mb-1.5 opacity-60" />
          <span className="text-xs font-semibold">Image unavailable</span>
        </div>
      )}

      {/* Actual Image when within viewport */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-sm'
          }`}
        />
      )}
    </div>
  );
};
