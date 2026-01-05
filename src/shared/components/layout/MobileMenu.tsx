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
            className="fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl z-50 xl:hidden flex flex-col border-l-4 border-l-gradient-to-b from-wiria-yellow via-wiria-green-light to-wiria-blue-light"
        >
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center p-4 border-b border-gradient-to-r from-wiria-yellow/20 to-wiria-green-light/20">
                <span className="text-xl font-bold text-wiria-blue-dark">Menu</span>
                <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-wiria-blue-dark rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200"
                    aria-label="Close menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                                    `block px-4 py-3 rounded-lg text-base font-medium transition-all ${navIsActive || isActive(item.to)
                                        ? 'text-wiria-yellow bg-gradient-to-r from-yellow-50 to-amber-50 shadow-sm'
                                        : 'text-gray-700 hover:text-wiria-blue-dark hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        </motion.div>
                    ))}
                </div>

                {/* Divider */}
                <div className="my-4 h-0.5 bg-gradient-to-r from-transparent via-wiria-yellow/30 via-50% via-wiria-green-light/30 to-transparent rounded-full" />

                {/* Auth Links - only show when backend is connected */}
                <div className="space-y-1">
                    {isBackendConnected && isAuthenticated ? (
                        <>
                            {userRole === UserRole.MEMBER && (
                                <Link
                                    to={ROUTES.MEMBER_PORTAL}
                                    onClick={onClose}
                                    className="block px-4 py-3 rounded-lg text-base font-medium text-wiria-blue-dark bg-gradient-to-r from-wiria-blue-dark/5 to-blue-100/50 hover:from-wiria-blue-dark/10 hover:to-blue-100 transition-all"
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
                                        className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-wiria-blue-dark hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            <button
                                onClick={onLogout}
                                className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-all"
                            >
                                Logout
                            </button>
                        </>
                    ) : isBackendConnected ? (
                        <>
                            <Link
                                to={ROUTES.MEMBER_LOGIN}
                                onClick={onClose}
                                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-wiria-blue-dark hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all"
                            >
                                Portal Login
                            </Link>
                            <Link
                                to={ROUTES.STAFF_LOGIN}
                                onClick={onClose}
                                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-wiria-blue-dark hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all"
                            >
                                Staff Login
                            </Link>
                            <Link
                                to={`${ROUTES.RESOURCES}#tenders`}
                                onClick={onClose}
                                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-wiria-blue-dark hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all"
                            >
                                Tenders
                            </Link>
                        </>
                    ) : (
                        /* When backend is offline: show only Tenders */
                        <Link
                            to={`${ROUTES.RESOURCES}#tenders`}
                            onClick={onClose}
                            className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-wiria-blue-dark hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all"
                        >
                            Tenders
                        </Link>
                    )}
                </div>
            </nav>

            {/* Mobile Menu Footer - Donate Button */}
            {!isAuthenticated && (
                <div className="p-4 border-t border-gradient-to-r from-wiria-yellow/20 to-wiria-green-light/20">
                    <Link
                        to={ROUTES.DONATIONS}
                        onClick={onClose}
                        className="block w-full bg-gradient-to-r from-wiria-yellow to-amber-500 hover:from-amber-500 hover:to-wiria-yellow text-white font-bold py-3 px-4 rounded-full text-center shadow-lg hover:shadow-xl transition-all"
                    >
                        Donate Now
                    </Link>
                </div>
            )}
        </motion.div>
    );
});
