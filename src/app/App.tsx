import { QueryClientProvider } from '@tanstack/react-query';
import { HashRouter } from 'react-router-dom';
import { Suspense } from 'react';
import { queryClient } from './config/queryClient';
import AppRouter from './router';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { BackendStatusProvider } from '@/shared/services/backendStatus';
import { ToastContainer } from '@/shared/components/feedback/Toast';
import { ScrollToTop } from '@/shared/components/layout/ScrollToTop';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BackendStatusProvider>
                {/* Using HashRouter for GitHub Pages compatibility */}
                <HashRouter
                    future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true,
                    }}
                >
                    <ScrollToTop />
                    <AuthProvider>
                        {/* Simple Suspense - keeps current page mounted while loading new one */}
                        <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                            <AppRouter />
                        </Suspense>
                        <ToastContainer />
                    </AuthProvider>
                </HashRouter>
            </BackendStatusProvider>
        </QueryClientProvider>
    );
}

export default App;
