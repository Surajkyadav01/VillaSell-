import React, { useState, useEffect, useRef } from 'react';
import { ImageOff, Building2 } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatioClass?: string;
  fallbackIcon?: React.ReactNode;
}

const getResponsiveImageData = (url: string) => {
  if (!url || !url.includes('images.unsplash.com')) {
    return { src: url, srcSet: undefined, sizes: undefined };
  }
  const cleanUrl = url.split('?')[0];
  const srcSet = `${cleanUrl}?auto=format&fit=crop&w=400&q=75 400w, ${cleanUrl}?auto=format&fit=crop&w=720&q=75 720w, ${cleanUrl}?auto=format&fit=crop&w=1080&q=75 1080w`;
  const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  const defaultSrc = `${cleanUrl}?auto=format&fit=crop&w=640&q=75`;
  return { src: defaultSrc, srcSet, sizes };
};

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
  const imageData = React.useMemo(() => getResponsiveImageData(src), [src]);

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
          src={imageData.src}
          srcSet={imageData.srcSet}
          sizes={imageData.sizes}
          alt={alt}
          width="640"
          height="400"
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
