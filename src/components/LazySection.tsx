import React from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  threshold?: number;
  rootMargin?: string;
  delayMs?: number;
}

/**
 * High-performance section wrapper that avoids Cumulative Layout Shift (CLS)
 * by keeping section dimensions stable and never collapsing into empty placeholders.
 */
export const LazySection: React.FC<LazySectionProps> = ({
  children,
  className = '',
  id,
}) => {
  return (
    <div id={id} className={`w-full max-w-full ${className}`}>
      {children}
    </div>
  );
};
