import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { UserRole } from '@/shared/types';
import { ROUTES } from '@/shared/constants/routes';
import { LoginDropdown } from '../LoginDropdown';

interface AuthActionsProps {
    isBackendConnected: boolean;
    isAuthenticated: boolean;
    userRole?: UserRole;
    loginDropdownOpen: boolean;
    setLoginDropdownOpen: (open: boolean) => void;
    handleLogout: () => void;
}

export function AuthActions({
    isBackendConnected,
    isAuthenticated,
    userRole,
    loginDropdownOpen,
    setLoginDropdownOpen,
    handleLogout,
}: AuthActionsProps) {
    if (!isBackendConnected) {
        return (
            <div className="flex items-center gap-4">
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
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <div className="flex items-center gap-4">
                {userRole === UserRole.MEMBER && (
                    <Link
                        to={ROUTES.MEMBER_PORTAL}
                        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-wiria-blue-dark/5 to-blue-100/50 px-4 py-2 text-sm font-medium text-wiria-blue-dark shadow-sm transition-all duration-200 hover:from-wiria-blue-dark/10 hover:to-blue-100 hover:shadow-md"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Dashboard</span>
                    </Link>
                )}
                {[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF].includes(userRole as UserRole) && (
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
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <div className="login-dropdown-container relative">
                <button
                    onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                    className="flex items-center gap-2 rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-wiria-blue-dark hover:shadow"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Login</span>
                    <svg
                        className={`h-4 w-4 transition-transform ${loginDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <AnimatePresence>
                    {loginDropdownOpen && <LoginDropdown onClose={() => setLoginDropdownOpen(false)} />}
                </AnimatePresence>
            </div>

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
        </div>
    );
}
