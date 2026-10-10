import React from 'react';

/**
 * Resilient lazy loader that retries dynamic imports if network or Vite dev module fetching hiccups.
 * Also handles automatic chunk cache invalidation on new deployments.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T } | { [key: string]: any }>,
  retries = 2,
  interval = 800
): React.LazyExoticComponent<T> {
  return React.lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const attempt = (remainingAttempts: number) => {
        componentImport()
          .then((module: any) => {
            if (module && module.default) {
              resolve(module);
            } else if (module) {
              const keys = Object.keys(module);
              const component = module[keys[0]];
              resolve({ default: component });
            } else {
              reject(new Error('Module export not found'));
            }
          })
          .catch((error) => {
            if (remainingAttempts <= 1) {
              // Check if it's a chunk load error or dynamic import failure
              const isChunkError = 
                error?.name === 'ChunkLoadError' || 
                error?.message?.includes('Failed to fetch dynamically imported module') ||
                error?.message?.includes('error loading dynamically imported module');
                
              if (isChunkError && typeof window !== 'undefined') {
                const storageKey = 'villasell_chunk_retry_' + window.location.pathname;
                const hasRetried = sessionStorage.getItem(storageKey);
                if (!hasRetried) {
                  sessionStorage.setItem(storageKey, 'true');
                  window.location.reload();
                  return;
                }
              }
              reject(error);
              return;
            }
            setTimeout(() => {
              attempt(remainingAttempts - 1);
            }, interval);
          });
      };
      attempt(retries);
    });
  });
}
