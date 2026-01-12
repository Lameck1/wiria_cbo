/**
 * MobileMenu Component
 * Slide-out mobile navigation menu
 */

import { memo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '@/shared/constants/routes';
import { UserRole } from '@/shared/types';

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

interface MobileMenuProps {
  isBackendConnected: boolean;
  isAuthenticated: boolean;
  userRole: UserRole | undefined;
  onClose: () => void;
  onLogout: () => void;
  isActive: (path: string) => boolean;
}

export const MobileMenu = memo(function MobileMenu({
  isBackendConnected,
  isAuthenticated,
  userRole,
  onClose,
  onLogout,
  isActive,
}: MobileMenuProps) {
  return (
    <motion.div
      id="mobile-menu-panel"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="border-l-gradient-to-b to-wiria-blue-light fixed right-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-l-4 bg-white from-wiria-yellow via-wiria-green-light shadow-2xl xl:hidden"
    >
      {/* Mobile Menu Header */}
      <div className="border-gradient-to-r flex items-center justify-between border-b from-wiria-yellow/20 to-wiria-green-light/20 p-4">
        <span className="text-xl font-bold text-wiria-blue-dark">Menu</span>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-wiria-blue-dark"
          aria-label="Close menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {NAV_ITEMS.map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.to}
                onClick={onClose}
                className={({ isActive: navIsActive }) =>
                  `block rounded-lg px-4 py-3 text-base font-medium transition-all ${
                    navIsActive || isActive(item.to)
                      ? 'bg-gradient-to-r from-yellow-50 to-amber-50 text-wiria-yellow shadow-sm'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-wiria-blue-dark'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 h-0.5 rounded-full bg-gradient-to-r from-transparent via-wiria-green-light/30 via-wiria-yellow/30 via-50% to-transparent" />

        {/* Auth Links - only show when backend is connected */}
        <div className="space-y-1">
          {isBackendConnected && isAuthenticated ? (
            <>
              {userRole === UserRole.MEMBER && (
                <Link
                  to={ROUTES.MEMBER_PORTAL}
                  onClick={onClose}
                  className="block rounded-lg bg-gradient-to-r from-wiria-blue-dark/5 to-blue-100/50 px-4 py-3 text-base font-medium text-wiria-blue-dark transition-all hover:from-wiria-blue-dark/10 hover:to-blue-100"
                >
                  👤 Member Dashboard
                </Link>
              )}
              {[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF].includes(
                userRole as UserRole
              ) && (
                <Link
                  to={ROUTES.ADMIN}
                  onClick={onClose}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-wiria-blue-dark"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={onLogout}
                className="w-full rounded-lg px-4 py-3 text-left text-base font-medium text-red-600 transition-all hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : isBackendConnected ? (
            <>
              <Link
                to={ROUTES.MEMBER_LOGIN}
                onClick={onClose}
                className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-wiria-blue-dark"
              >
                Portal Login
              </Link>
              <Link
                to={ROUTES.STAFF_LOGIN}
                onClick={onClose}
                className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-wiria-blue-dark"
              >
                Staff Login
              </Link>
              <Link
                to={`${ROUTES.RESOURCES}#tenders`}
                onClick={onClose}
                className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-wiria-blue-dark"
              >
                Tenders
              </Link>
            </>
          ) : (
            /* When backend is offline: show only Tenders */
            <Link
              to={`${ROUTES.RESOURCES}#tenders`}
              onClick={onClose}
              className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-wiria-blue-dark"
            >
              Tenders
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu Footer - Donate Button */}
      {!isAuthenticated && (
        <div className="border-gradient-to-r border-t from-wiria-yellow/20 to-wiria-green-light/20 p-4">
          <Link
            to={ROUTES.DONATIONS}
            onClick={onClose}
            className="block w-full rounded-full bg-gradient-to-r from-wiria-yellow to-amber-500 px-4 py-3 text-center font-bold text-white shadow-lg transition-all hover:from-amber-500 hover:to-wiria-yellow hover:shadow-xl"
          >
            Donate Now
          </Link>
        </div>
      )}
    </motion.div>
  );
});
