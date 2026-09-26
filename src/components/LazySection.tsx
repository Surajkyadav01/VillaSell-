import React, { useEffect, useRef, useState } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  threshold?: number;
  rootMargin?: string;
  delayMs?: number;
}

export const LazySection: React.FC<LazySectionProps> = ({
  children,
  className = '',
  id,
  threshold = 0.1,
  rootMargin = '100px 0px',
  delayMs = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    // If IntersectionObserver is not supported, reveal immediately
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (delayMs > 0) {
            setTimeout(() => setIsVisible(true), delayMs);
          } else {
            setIsVisible(true);
          }
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, delayMs]);

  return (
    <div
      ref={sectionRef}
      id={id}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 filter-none'
          : 'opacity-0 translate-y-8 pointer-events-none'
      } ${className}`}
    >
      {/* Only render content once triggered or keep rendered */}
      {isVisible ? children : <div className="min-h-[120px] w-full" />}
    </div>
  );
};
