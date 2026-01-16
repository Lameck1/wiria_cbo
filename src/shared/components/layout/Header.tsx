/**
 * Header Component - Vibrant Centered Two-Tier Navigation
 * Design: Both menus centered to viewport (logo included in top menu)

 * - Vibrant brand colors with subtle gradients
 * - visual depth and animations
 * - Colorful separator between menu rows
 * - hover effects and transitions
 */

import { useState, useEffect, useCallback } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth/context/AuthContext';
import { ROUTES } from '@/shared/constants/routes';

import { HeaderLogo, DesktopNav, AuthActions } from './header';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const userRole = user?.role;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (loginDropdownOpen) setLoginDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, loginDropdownOpen]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLoginDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.login-dropdown-container')) {
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

  const isActive = useCallback(
    (path: string) => {
      if (path === ROUTES.HOME) return location.pathname === ROUTES.HOME;
      return location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  return (
    <header className="border-b-gradient-to-r to-wiria-blue-light relative sticky top-0 z-50 overflow-visible border-b-4 bg-white from-wiria-yellow via-wiria-green-light shadow-md">
      <div className="to-wiria-blue-light absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-wiria-yellow via-wiria-green-light" />

      {/* Desktop Layout */}
      <div className={`hidden transition-all duration-300 xl:block ${isScrolled ? 'py-2' : 'py-3'}`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center gap-6">
              <HeaderLogo isScrolled={isScrolled} />

              <div className="h-10 w-0.5 rounded-full bg-gradient-to-b from-wiria-yellow via-wiria-green-light to-transparent" />

              <AuthActions
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                loginDropdownOpen={loginDropdownOpen}
                setLoginDropdownOpen={setLoginDropdownOpen}
                handleLogout={handleLogout}
              />
            </div>

            <div className="h-0.5 w-full max-w-2xl rounded-full bg-gradient-to-r from-transparent via-wiria-green-light/40 via-wiria-yellow/40 via-50% to-transparent" />

            <DesktopNav isActive={isActive} />
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className={`flex items-center justify-between transition-all duration-300 xl:hidden ${isScrolled ? 'py-2' : 'py-3'}`}>
        <div className="container mx-auto flex items-center justify-between px-4">
          <HeaderLogo isScrolled={isScrolled} mobile />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-wiria-blue-dark transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 focus:outline-none focus:ring-2 focus:ring-wiria-yellow/50"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
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
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
              aria-hidden="true"
            />

            {/* Mobile Menu Component */}
            <MobileMenu
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              onClose={() => setMobileMenuOpen(false)}
              onLogout={handleLogout}
              isActive={isActive}
            />
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
