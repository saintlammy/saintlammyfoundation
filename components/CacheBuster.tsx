import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * CacheBuster Component
 *
 * Clears browser cache on route changes to ensure users always see the latest content.
 * This helps during development and after deployments.
 */
const CacheBuster: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear cache on mount
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }

    // Clear cache on route change
    const handleRouteChange = () => {
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return null;
};

export default CacheBuster;
