/**
 * Header Component - Vibrant Centered Two-Tier Navigation
 * Design: Both menus centered to viewport (logo included in top menu)

 * - Vibrant brand colors with subtle gradients
 * - visual depth and animations
 * - Colorful separator between menu rows
 * - hover effects and transitions
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
  const isActive = useCallback(
    (path: string) => {
      if (path === ROUTES.HOME) {
        return location.pathname === ROUTES.HOME;
      }
      return location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  return (
    <header className="border-b-gradient-to-r to-wiria-blue-light relative sticky top-0 z-50 overflow-visible border-b-4 bg-white from-wiria-yellow via-wiria-green-light shadow-md">
      {/* Gradient bottom border */}
      <div className="to-wiria-blue-light absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-wiria-yellow via-wiria-green-light" />

      {/* Desktop Layout: Both menus centered */}
      <div
        className={`hidden transition-all duration-300 xl:block ${isScrolled ? 'py-2' : 'py-3'}`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          {/* CENTERED MENUS */}
          <div className="flex flex-col items-center justify-center space-y-3">
            {/* TOP MENU - Logo + Login + Tenders + Donate (all centered together) */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link
                to={ROUTES.HOME}
                className="flex items-center gap-3 transition-all duration-300 hover:opacity-90"
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/Wiria_CBO_Logo_NEW_IV.png`}
                  alt="WIRIA CBO"
                  className={`transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}
                />
                <span
                  className={`whitespace-nowrap font-bold text-wiria-blue-dark transition-all duration-300 ${isScrolled ? 'text-2xl' : 'text-3xl'}`}
                >
                  WIRIA CBO
                </span>
              </Link>

              {/* Gradient Separator */}
              <div className="h-10 w-0.5 rounded-full bg-gradient-to-b from-wiria-yellow via-wiria-green-light to-transparent" />

              {/* Auth/Utility Items */}
              <div className="flex items-center gap-4">
                {/* Only show auth-related items when backend is connected */}
                {isBackendConnected && isAuthenticated ? (
                  <>
                    {userRole === UserRole.MEMBER && (
                      <Link
                        to={ROUTES.MEMBER_PORTAL}
                        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-wiria-blue-dark/5 to-blue-100/50 px-4 py-2 text-sm font-medium text-wiria-blue-dark shadow-sm transition-all duration-200 hover:from-wiria-blue-dark/10 hover:to-blue-100 hover:shadow-md"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>Dashboard</span>
                      </Link>
                    )}
                    {[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF].includes(
                      userRole as UserRole
                    ) && (
                      <Link
                        to={ROUTES.ADMIN}
                        className="text-sm font-medium text-gray-600 transition-colors hover:text-wiria-blue-dark"
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                    >
                      Logout
                    </button>
                  </>
                ) : isBackendConnected ? (
                  <>
                    {/* Login Dropdown */}
                    <div className="login-dropdown-container relative">
                      <button
                        onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                        className="flex items-center gap-2 rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-wiria-blue-dark hover:shadow"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>Login</span>
                        <svg
                          className={`h-4 w-4 transition-transform ${loginDropdownOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
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
                      className="rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-wiria-blue-dark hover:shadow"
                    >
                      Tenders
                    </Link>

                    {/* Donate Button - */}
                    <Link
                      to={ROUTES.DONATIONS}
                      className="group relative transform overflow-hidden rounded-full bg-gradient-to-r from-wiria-yellow to-amber-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-wiria-yellow hover:shadow-xl"
                    >
                      {/* Animated gradient overlay */}
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      <span className="relative z-10">Donate</span>
                    </Link>
                  </>
                ) : (
                  /* When backend is offline: show only Tenders and Donate */
                  <>
                    <Link
                      to={`${ROUTES.RESOURCES}#tenders`}
                      className="rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-wiria-blue-dark hover:shadow"
                    >
                      Tenders
                    </Link>
                    <Link
                      to={ROUTES.DONATIONS}
                      className="group relative transform overflow-hidden rounded-full bg-gradient-to-r from-wiria-yellow to-amber-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-wiria-yellow hover:shadow-xl"
                    >
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      <span className="relative z-10">Donate</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* COLORFUL SEPARATOR */}
            <div className="h-0.5 w-full max-w-2xl rounded-full bg-gradient-to-r from-transparent via-wiria-green-light/40 via-wiria-yellow/40 via-50% to-transparent" />

            {/* BOTTOM MENU - All navigation items (centered) */}
            <nav className="flex items-center justify-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive: navIsActive }) =>
                    `group relative rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      navIsActive || isActive(item.to)
                        ? 'bg-gradient-to-r from-yellow-50 to-amber-50 text-wiria-yellow shadow-sm'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-green-50/50 hover:text-wiria-blue-dark'
                    }`
                  }
                >
                  {item.label}
                  {/* Animated underline on hover */}
                  <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light transition-all duration-300 group-hover:w-3/4" />
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout: Logo + Hamburger */}
      <div
        className={`flex items-center justify-between transition-all duration-300 xl:hidden ${isScrolled ? 'py-2' : 'py-3'}`}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 transition-opacity hover:opacity-90"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/Wiria_CBO_Logo_NEW_IV.png`}
              alt="WIRIA CBO"
              className={`transition-all duration-300 ${isScrolled ? 'h-8' : 'h-10'}`}
            />
            <span
              className={`font-bold text-wiria-blue-dark transition-all duration-300 ${isScrolled ? 'text-base' : 'text-lg'}`}
            >
              WIRIA CBO
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-wiria-blue-dark transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 focus:outline-none focus:ring-2 focus:ring-wiria-yellow/50"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen ? 'true' : 'false'}
            aria-controls="mobile-menu-panel"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
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
