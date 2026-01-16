import { Suspense } from 'react';

import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { AuthProvider } from '@/features/auth/context/AuthContext';
import { BackendStatusProvider } from '@/shared/services/backendStatus';

import { ScrollToTop } from './ScrollToTop';

export function AppProviders() {
  return (
    <BackendStatusProvider>
      <AuthProvider>
        <ScrollToTop />
        <Suspense fallback={<PageLoadingSkeleton />}>
          <Outlet />
        </Suspense>
        <ToastContainer />
      </AuthProvider>
    </BackendStatusProvider>
  );
}

function PageLoadingSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-wiria-blue-dark" />
    </div>
  );
}
