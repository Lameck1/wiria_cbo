/**
 * Header Component - Vibrant Centered Two-Tier Navigation
 * Design: Both menus centered to viewport (logo included in top menu)
 * Features:
 * - Vibrant brand colors with subtle gradients
 * - Enhanced visual depth and animations
 * - Colorful separator between menu rows
 * - Premium hover effects and transitions
 */

import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useBackendStatus } from '@/shared/services/backendStatus';
import { UserRole } from '@/shared/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { ROUTES } from '@/shared/constants/routes';
import { MobileMenu } from './MobileMenu';
import { LoginDropdown } from './LoginDropdown';

// Navigation items configuration
const NAV_ITEMS = [
    { to: ROUTES.HOME, label: 'Home' },
    { to: ROUTES.ABOUT, label: 'About' },
    { to: ROUTES.PROGRAMS, label: 'Programs' },
    { to: ROUTES.OPPORTUNITIES, label: 'Opportunities' },
    { to: ROUTES.CAREERS, label: 'Careers' },
    { to: ROUTES.RESOURCES, label: 'Resources' },
    { to: ROUTES.CONTACT, label: 'Contact' },
];

export function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const { isBackendConnected } = useBackendStatus();
    const userRole = user?.role;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Handle scroll detection for navbar shrinking
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    // Handle keyboard navigation (Escape to close)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (mobileMenuOpen) setMobileMenuOpen(false);
                if (loginDropdownOpen) setLoginDropdownOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mobileMenuOpen, loginDropdownOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setLoginDropdownOpen(false);
    }, [location.pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.login-dropdown-container')) {
                setLoginDropdownOpen(false);
            }
        };
        if (loginDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [loginDropdownOpen]);

    const handleLogout = useCallback(async () => {
        await logout();
        navigate(ROUTES.HOME);
        setMobileMenuOpen(false);
    }, [logout, navigate]);

    const closeMobileMenu = useCallback(() => {
        setMobileMenuOpen(false);
    }, []);

    // Check if a link is active
    const isActive = useCallback((path: string) => {
        if (path === ROUTES.HOME) {
            return location.pathname === ROUTES.HOME;
        }
        return location.pathname.startsWith(path);
    }, [location.pathname]);

    return (
        <header className="bg-white sticky top-0 z-50 shadow-md border-b-4 border-b-gradient-to-r from-wiria-yellow via-wiria-green-light to-wiria-blue-light relative overflow-visible">
            {/* Gradient bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-wiria-yellow via-wiria-green-light to-wiria-blue-light" />

            {/* Desktop Layout: Both menus centered */}
            <div className={`hidden xl:block transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
                <div className="container mx-auto px-4 lg:px-6">
                    {/* CENTERED MENUS */}
                    <div className="flex flex-col items-center justify-center space-y-3">
                        {/* TOP MENU - Logo + Login + Tenders + Donate (all centered together) */}
                        <div className="flex items-center gap-6">
                            {/* Logo */}
                            <Link
                                to={ROUTES.HOME}
                                className="flex items-center gap-3 hover:opacity-90 transition-all duration-300"
                            >
                                <img
                                    src={`${import.meta.env.BASE_URL}images/Wiria_CBO_Logo_NEW_IV.png`}
                                    alt="WIRIA CBO"
                                    className={`transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}
                                />
                                <span className={`font-bold text-wiria-blue-dark transition-all duration-300 whitespace-nowrap ${isScrolled ? 'text-2xl' : 'text-3xl'}`}>
                                    WIRIA CBO
                                </span>
                            </Link>

                            {/* Gradient Separator */}
                            <div className="h-10 w-0.5 bg-gradient-to-b from-wiria-yellow via-wiria-green-light to-transparent rounded-full" />

                            {/* Auth/Utility Items */}
                            <div className="flex items-center gap-4">
                                {/* Only show auth-related items when backend is connected */}
                                {isBackendConnected && isAuthenticated ? (
                                    <>
                                        {userRole === UserRole.MEMBER && (
                                            <Link
                                                to={ROUTES.MEMBER_PORTAL}
                                                className="flex items-center gap-2 text-sm font-medium text-wiria-blue-dark bg-gradient-to-r from-wiria-blue-dark/5 to-blue-100/50 px-4 py-2 rounded-lg hover:from-wiria-blue-dark/10 hover:to-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>Dashboard</span>
                                            </Link>
                                        )}
                                        {[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF].includes(
                                            userRole as UserRole
                                        ) && (
                                                <Link
                                                    to={ROUTES.ADMIN}
                                                    className="text-sm font-medium text-gray-600 hover:text-wiria-blue-dark transition-colors"
                                                >
                                                    Dashboard
                                                </Link>
                                            )}
                                        <button
                                            onClick={handleLogout}
                                            className="text-sm text-red-600 hover:text-red-700 transition-colors font-medium"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : isBackendConnected ? (
                                    <>
                                        {/* Login Dropdown */}
                                        <div className="relative login-dropdown-container">
                                            <button
                                                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                                                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-wiria-blue-dark transition-all duration-200 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 border border-transparent hover:border-gray-200 shadow-sm hover:shadow"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>Login</span>
                                                <svg className={`w-4 h-4 transition-transform ${loginDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {/* Dropdown Menu */}
                                            <AnimatePresence>
                                                {loginDropdownOpen && (
                                                    <LoginDropdown onClose={() => setLoginDropdownOpen(false)} />
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Tenders */}
                                        <Link
                                            to={`${ROUTES.RESOURCES}#tenders`}
                                            className="text-sm font-medium text-gray-700 hover:text-wiria-blue-dark transition-all duration-200 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 border border-transparent hover:border-gray-200 shadow-sm hover:shadow"
                                        >
                                            Tenders
                                        </Link>

                                        {/* Donate Button - Enhanced */}
                                        <Link
                                            to={ROUTES.DONATIONS}
                                            className="relative bg-gradient-to-r from-wiria-yellow to-amber-500 hover:from-amber-500 hover:to-wiria-yellow text-white font-bold text-sm py-2.5 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group overflow-hidden"
                                        >
                                            {/* Animated gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                            <span className="relative z-10">Donate</span>
                                        </Link>
                                    </>
                                ) : (
                                    /* When backend is offline: show only Tenders and Donate */
                                    <>
                                        <Link
                                            to={`${ROUTES.RESOURCES}#tenders`}
                                            className="text-sm font-medium text-gray-700 hover:text-wiria-blue-dark transition-all duration-200 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 border border-transparent hover:border-gray-200 shadow-sm hover:shadow"
                                        >
                                            Tenders
                                        </Link>
                                        <Link
                                            to={ROUTES.DONATIONS}
                                            className="relative bg-gradient-to-r from-wiria-yellow to-amber-500 hover:from-amber-500 hover:to-wiria-yellow text-white font-bold text-sm py-2.5 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                            <span className="relative z-10">Donate</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* COLORFUL SEPARATOR */}
                        <div className="w-full max-w-2xl h-0.5 bg-gradient-to-r from-transparent via-wiria-yellow/40 via-50% via-wiria-green-light/40 to-transparent rounded-full" />

                        {/* BOTTOM MENU - All navigation items (centered) */}
                        <nav className="flex items-center justify-center gap-1">
                            {NAV_ITEMS.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive: navIsActive }) =>
                                        `relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 group ${navIsActive || isActive(item.to)
                                            ? 'text-wiria-yellow bg-gradient-to-r from-yellow-50 to-amber-50 shadow-sm'
                                            : 'text-gray-700 hover:text-wiria-blue-dark hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-green-50/50'
                                        }`
                                    }
                                >
                                    {item.label}
                                    {/* Animated underline on hover */}
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-wiria-yellow to-wiria-green-light rounded-full group-hover:w-3/4 transition-all duration-300" />
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet Layout: Logo + Hamburger */}
            <div className={`flex xl:hidden justify-between items-center transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link
                        to={ROUTES.HOME}
                        className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                        <img
                            src={`${import.meta.env.BASE_URL}images/Wiria_CBO_Logo_NEW_IV.png`}
                            alt="WIRIA CBO"
                            className={`transition-all duration-300 ${isScrolled ? 'h-8' : 'h-10'}`}
                        />
                        <span className={`font-bold text-wiria-blue-dark transition-all duration-300 ${isScrolled ? 'text-base' : 'text-lg'}`}>
                            WIRIA CBO
                        </span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-wiria-blue-dark p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-wiria-yellow/50"
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileMenuOpen ? 'true' : 'false'}
                        aria-controls="mobile-menu-panel"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <motion.path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay and Panel */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={closeMobileMenu}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 xl:hidden"
                            aria-hidden="true"
                        />

                        {/* Mobile Menu Component */}
                        <MobileMenu
                            isBackendConnected={isBackendConnected}
                            isAuthenticated={isAuthenticated}
                            userRole={userRole}
                            onClose={closeMobileMenu}
                            onLogout={handleLogout}
                            isActive={isActive}
                        />
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
