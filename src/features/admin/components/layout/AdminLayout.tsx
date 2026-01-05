import { useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { GlobalSearch } from '@/features/admin/components/GlobalSearch';
import { NotificationBell } from '@/features/admin/components/NotificationBell';
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
            <aside className={`w-64 bg-wiria-blue-dark text-white flex-shrink-0 flex flex-col h-screen fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Header - Fixed */}
                <div className="p-6 border-b border-white border-opacity-10 flex-shrink-0">
                    <Link to={ROUTES.ADMIN} className="flex items-center gap-3 mb-3">
                        <img
                            src="/images/Wiria_CBO_Logo_NEW_IV.png"
                            alt="WIRIA CBO Logo"
                            className="w-10 h-10 rounded-lg bg-white p-1"
                        />
                        <span className="text-2xl font-bold">WIRIA CBO</span>
                    </Link>
                    <p className="text-xs text-blue-200 opacity-70 mb-4">Admin Panel</p>
                    <Link to={ROUTES.HOME} className="inline-flex items-center text-xs font-bold bg-white bg-opacity-10 hover:bg-opacity-20 px-3 py-1.5 rounded-lg transition-all">
                        <span className="mr-2">🌐</span> Visit Website
                    </Link>
                </div>

                {/* Navigation - Scrollable with custom scrollbar */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/40">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`w-full text-left p-3 rounded-xl hover:bg-white hover:bg-opacity-10 transition-all font-semibold flex items-center ${isActive(item.path) && item.path !== ROUTES.ADMIN ? 'bg-white bg-opacity-10' : ''} ${item.path === ROUTES.ADMIN && location.pathname === ROUTES.ADMIN ? 'bg-white bg-opacity-10' : ''}`}
                        >
                            <span className="mr-3">{item.icon}</span> {item.label}
                        </Link>
                    ))}

                    {(user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ADMIN) && superAdminItems.length > 0 && (
                        <div className="pt-6 border-t border-white border-opacity-10 space-y-2">
                            {superAdminItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`w-full text-left p-3 rounded-xl hover:bg-white hover:bg-opacity-10 transition-all font-semibold flex items-center ${isActive(item.path) ? 'bg-white bg-opacity-10' : ''}`}
                                >
                                    <span className="mr-3">{item.icon}</span> {item.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </nav>

                {/* Footer - Fixed at bottom */}
                <div className="p-6 border-t border-white border-opacity-10 flex-shrink-0">
                    <button
                        onClick={() => logout()}
                        className="w-full text-left p-3 text-red-300 hover:text-red-100 transition-colors flex items-center font-bold"
                    >
                        <span className="mr-3">🚪</span> Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-grow flex flex-col min-w-0">
                {/* Top Header */}
                <header className="bg-white shadow h-20 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-gray-500 focus:outline-none"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="lg:hidden text-xl font-bold text-wiria-blue-dark">WIRIA</div>
                        {/* Global Search - Hidden on mobile */}
                        <div className="hidden md:block">
                            <GlobalSearch />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Notification Bell */}
                        <NotificationBell />
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 md:px-3 py-1 rounded-full uppercase hidden sm:block">
                            {user?.role || '...'}
                        </span>
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-wiria-yellow rounded-full flex items-center justify-center text-white font-bold select-none">
                            {(user?.firstName || 'U').charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="p-8 flex-grow overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
