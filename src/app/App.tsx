import { useEffect } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { measureWebVitals } from '@/shared/utils/performance';

import { queryClient } from './config/queryClient';
import { router } from './router';

/**
 * Main Application Component
 * Sets up global providers and the router.
 */
function App() {
  useEffect(() => {
    // Initialize Web Vitals monitoring
    measureWebVitals();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: true,
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
