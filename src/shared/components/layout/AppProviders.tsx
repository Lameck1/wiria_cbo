import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ScrollToTop } from './ScrollToTop';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { BackendStatusProvider } from '@/shared/services/backendStatus';

/**
 * AppProviders provides the global context shells for the entire application.
 * It does NOT include any UI layout wrappers like Header or Footer.
 */
export function AppProviders() {
    return (
        <BackendStatusProvider>
            <AuthProvider>
                <ScrollToTop />
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                    <Outlet />
                </Suspense>
                <ToastContainer />
            </AuthProvider>
        </BackendStatusProvider>
    );
}
