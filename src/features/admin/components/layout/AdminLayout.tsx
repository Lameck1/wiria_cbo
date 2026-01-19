import { useState } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { GlobalSearch } from '@/features/admin/components/GlobalSearch';
import { NotificationBell } from '@/features/admin/components/NotificationBell';
import { useAuth } from '@/features/auth/context/useAuth';
import { ROUTES } from '@/shared/constants/routes';
import { UserRole } from '@/shared/types';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { label: 'Dashboard', path: ROUTES.ADMIN, icon: '📊' },
    { label: 'News & Updates', path: ROUTES.ADMIN_NEWS, icon: '📰' },
    { label: 'Tenders', path: ROUTES.ADMIN_TENDERS, icon: '📜' },
    { label: 'HR & Careers', path: ROUTES.ADMIN_HR, icon: '💼' },
    { label: 'Donations', path: ROUTES.ADMIN_DONATIONS, icon: '💰' },
    { label: 'Safeguarding', path: ROUTES.ADMIN_SAFEGUARDING, icon: '🛡️' },
    { label: 'Messages', path: ROUTES.ADMIN_CONTACTS, icon: '✉️' },
    { label: 'Meetings', path: ROUTES.ADMIN_MEETINGS, icon: '📅' },
    { label: 'Members', path: ROUTES.ADMIN_MEMBERS, icon: '👤' },
  ];

  const superAdminItems = [
    { label: 'Staff', path: ROUTES.ADMIN_USERS, icon: '👥' },
    { label: 'Resources', path: ROUTES.ADMIN_RESOURCES, icon: '📚' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex h-screen w-64 flex-shrink-0 transform flex-col bg-wiria-blue-dark text-white transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Admin Sidebar"
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 border-b border-white border-opacity-10 p-6">
          <Link to={ROUTES.ADMIN} className="mb-3 flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}images/Wiria_CBO_Logo_NEW_IV.png`}
              alt="WIRIA CBO Logo"
              className="h-10 w-10 rounded-lg bg-white p-1"
            />
            <span className="text-2xl font-bold">WIRIA CBO</span>
          </Link>
          <p className="mb-4 text-xs text-blue-200 opacity-70">Admin Panel</p>
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center rounded-lg bg-white bg-opacity-10 px-3 py-1.5 text-xs font-bold transition-all hover:bg-opacity-20"
          >
            <span className="mr-2">🌐</span> Visit Website
          </Link>
        </div>

        {/* Navigation - Scrollable with custom scrollbar */}
        <nav className="scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/40 flex-1 space-y-2 overflow-y-auto overflow-x-hidden p-4" aria-label="Admin Navigation">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex w-full items-center rounded-xl p-3 text-left font-semibold transition-all hover:bg-white hover:bg-opacity-10 ${isActive(item.path) && item.path !== ROUTES.ADMIN ? 'bg-white bg-opacity-10' : ''} ${item.path === ROUTES.ADMIN && location.pathname === ROUTES.ADMIN ? 'bg-white bg-opacity-10' : ''}`}
            >
              <span className="mr-3">{item.icon}</span> {item.label}
            </Link>
          ))}

          {(user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ADMIN) &&
            superAdminItems.length > 0 && (
              <div className="space-y-2 border-t border-white border-opacity-10 pt-6">
                {superAdminItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex w-full items-center rounded-xl p-3 text-left font-semibold transition-all hover:bg-white hover:bg-opacity-10 ${isActive(item.path) ? 'bg-white bg-opacity-10' : ''}`}
                  >
                    <span className="mr-3">{item.icon}</span> {item.label}
                  </Link>
                ))}
              </div>
            )}
        </nav>

        {/* Footer - Fixed at bottom */}
        <div className="flex-shrink-0 border-t border-white border-opacity-10 p-6">
          <button
            onClick={() => {
              void logout();
            }}
            className="flex w-full items-center p-3 text-left font-bold text-red-300 transition-colors hover:text-red-100"
          >
            <span className="mr-3">🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex min-w-0 flex-grow flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between bg-white px-4 shadow md:px-8">
          <div className="flex items-center gap-4">
            <button
              className="text-gray-500 focus:outline-none lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="text-xl font-bold text-wiria-blue-dark lg:hidden">WIRIA</div>
            {/* Global Search - Hidden on mobile */}
            <div className="hidden md:block">
              <GlobalSearch />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Notification Bell */}
            <NotificationBell />
            <span className="hidden rounded-full bg-blue-100 px-2 py-1 text-xs font-bold uppercase text-blue-700 sm:block md:px-3">
              {user?.role ?? '...'}
            </span>
            <div className="flex h-9 w-9 select-none items-center justify-center rounded-full bg-wiria-yellow font-bold text-white md:h-10 md:w-10">
              {(user?.firstName ?? 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-grow overflow-x-hidden p-8">{children}</main>
      </div>
    </div>
  );
}
