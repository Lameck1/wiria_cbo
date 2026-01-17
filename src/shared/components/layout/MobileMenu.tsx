import { motion } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';

import { ROUTES } from '@/shared/constants/routes';
import { useBackendStatus } from '@/shared/services/useBackendStatus';
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
  isAuthenticated: boolean;
  userRole: UserRole | undefined;
  onClose: () => void;
  onLogout: () => Promise<void>;
  isActive?: (path: string) => boolean;
}

export function MobileMenu({
  isAuthenticated,
  userRole,
  onClose,
  onLogout,
  isActive,
}: MobileMenuProps) {
  const { isBackendConnected } = useBackendStatus();

  return (
    <motion.div
      id="mobile-menu-panel"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="fixed right-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-l-4 border-l-wiria-yellow bg-white shadow-2xl xl:hidden"
    >
      {/* Mobile Menu Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <span className="text-xl font-bold text-wiria-blue-dark">Menu</span>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-wiria-blue-dark"
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
                    navIsActive || isActive?.(item.to)
                      ? 'bg-wiria-yellow/10 font-bold text-wiria-yellow'
                      : 'text-gray-700 hover:bg-wiria-blue-dark/5 hover:text-wiria-blue-dark'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </motion.div>
          ))}
        </div>

        <div className="my-4 h-px bg-gray-100" />

        <div className="space-y-1">
          {isBackendConnected && isAuthenticated ? (
            <>
              {userRole === UserRole.MEMBER && (
                <Link
                  to={ROUTES.MEMBER_PORTAL}
                  onClick={onClose}
                  className="block rounded-lg bg-wiria-blue-dark/5 px-4 py-3 text-base font-medium text-wiria-blue-dark hover:bg-wiria-blue-dark/10"
                >
                  👤 Member Dashboard
                </Link>
              )}
              {[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF].includes(userRole!) && (
                <Link
                  to={ROUTES.ADMIN}
                  onClick={onClose}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-wiria-blue-dark/5"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => void onLogout()}
                className="w-full rounded-lg px-4 py-3 text-left text-base font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : isBackendConnected ? (
            <>
              <Link
                to={ROUTES.MEMBER_LOGIN}
                onClick={onClose}
                className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-wiria-blue-dark/5"
              >
                Portal Login
              </Link>
              <Link
                to={ROUTES.STAFF_LOGIN}
                onClick={onClose}
                className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-wiria-blue-dark/5"
              >
                Staff Login
              </Link>
            </>
          ) : (
            <Link
              to={`${ROUTES.RESOURCES}#tenders`}
              onClick={onClose}
              className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-wiria-blue-dark/5"
            >
              Tenders (Offline Mode)
            </Link>
          )}
        </div>
      </nav>

      {!isAuthenticated && (
        <div className="border-t border-gray-100 p-4">
          <Link
            to={ROUTES.DONATIONS}
            onClick={onClose}
            className="block w-full rounded-full bg-wiria-yellow px-4 py-3 text-center font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
          >
            Donate Now
          </Link>
        </div>
      )}
    </motion.div>
  );
}
