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

export function PortalLayout({
  children,
  title,
  subtitle,
  showNavigation = true,
}: PortalLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/member-login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Portal Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-6">
          <Link to="/member-portal" className="flex items-center gap-2">
            <img
              src={`${import.meta.env.BASE_URL}images/Wiria_CBO_Logo_NEW_IV.png`}
              alt="WIRIA CBO"
              className="h-10"
            />
            <span className="hidden text-xl font-bold text-wiria-blue-dark sm:block">
              WIRIA CBO
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-sm font-semibold text-wiria-blue-dark transition-colors hover:text-wiria-yellow"
            >
              🏠 Home
            </Link>
            {user && (
              <span className="hidden text-sm font-semibold text-gray-700 md:block">
                {user.firstName} {user.lastName}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-gray-700 transition-all hover:bg-gray-300"
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
            <h1 className="mb-1 text-3xl font-bold text-wiria-blue-dark">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>

          {/* Portal Navigation */}
          {showNavigation && <PortalNavigation />}

          {/* Page Content */}
          {children}
        </div>
      </main>

      {/* Portal Footer */}
      <footer className="mt-12 bg-wiria-blue-dark py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 WIRIA Community Based Organization. Confidential Member Portal.</p>
        </div>
      </footer>
    </div>
  );
}
