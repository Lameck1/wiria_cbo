/**
 * Portal Layout Component
 * Shared layout for all member portal pages
 */

import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { PortalNavigation } from './PortalNavigation';

interface PortalLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
    showNavigation?: boolean;
}

export function PortalLayout({ children, title, subtitle, showNavigation = true }: PortalLayoutProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/member-login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Portal Header */}
            <header className="bg-white shadow-md sticky top-0 z-50">
                <nav className="container mx-auto px-4 lg:px-6 py-4 flex justify-between items-center">
                    <Link to="/member-portal" className="flex items-center gap-2">
                        <img
                            src="/images/Wiria_CBO_Logo_NEW_IV.png"
                            alt="WIRIA CBO"
                            className="h-10"
                        />
                        <span className="text-xl font-bold text-wiria-blue-dark hidden sm:block">WIRIA CBO</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className="text-sm font-semibold text-wiria-blue-dark hover:text-wiria-yellow transition-colors"
                        >
                            🏠 Home
                        </Link>
                        {user && (
                            <span className="text-sm font-semibold text-gray-700 hidden md:block">
                                {user.firstName} {user.lastName}
                            </span>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </nav>
            </header>

            <main className="py-8">
                <div className="container mx-auto px-4">
                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-wiria-blue-dark mb-1">{title}</h1>
                        {subtitle && <p className="text-gray-600">{subtitle}</p>}
                    </div>

                    {/* Portal Navigation */}
                    {showNavigation && <PortalNavigation />}

                    {/* Page Content */}
                    {children}
                </div>
            </main>

            {/* Portal Footer */}
            <footer className="bg-wiria-blue-dark text-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2025 WIRIA Community Based Organization. Confidential Member Portal.</p>
                </div>
            </footer>
        </div>
    );
}
