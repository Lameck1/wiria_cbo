import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 *
 * Handles scroll behavior on route changes:
 * 1. Scrolls to top when navigating to a new page without a hash.
 * 2. Scrolls to the specific element when a hash is present.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there is a hash, scroll to the element (e.g. #partners)
    if (hash) {
      // Small timeout to ensure DOM is ready, especially for lazy loaded components
      setTimeout(() => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    // Otherwise scroll to top of page
    else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
