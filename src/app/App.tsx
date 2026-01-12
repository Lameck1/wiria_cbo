import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './config/queryClient';
import { router } from './router';

/**
 * Main Application Component
 * Sets up global providers and the router.
 */
function App() {
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
