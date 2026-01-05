import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { UserRole } from '@/shared/types';
import { ROUTES } from '@/shared/constants/routes';

interface NavItem {
    label: string;
    path: string;
    icon: string;
    roles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', path: ROUTES.ADMIN, icon: '📊' },
    { label: 'News & Updates', path: ROUTES.ADMIN_NEWS, icon: '📰' },
    { label: 'Tenders', path: ROUTES.ADMIN_TENDERS, icon: '📜' },
    { label: 'HR & Careers', path: ROUTES.ADMIN_HR, icon: '💼' },
    { label: 'Donations', path: ROUTES.ADMIN_DONATIONS, icon: '💰' },
    { label: 'Safeguarding', path: ROUTES.ADMIN_SAFEGUARDING, icon: '🛡️' },
    { label: 'Messages', path: ROUTES.ADMIN_CONTACTS, icon: '✉️' },
    { label: 'Meetings', path: ROUTES.ADMIN_MEETINGS, icon: '📅' },
    { label: 'Members', path: ROUTES.ADMIN_MEMBERS, icon: '👤', roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF] },
];

const SUPER_ADMIN_ITEMS: NavItem[] = [
    { label: 'Staff', path: ROUTES.ADMIN_USERS, icon: '👥', roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] },
    { label: 'Resources', path: ROUTES.ADMIN_RESOURCES, icon: '📚', roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] },
];

export function AdminSidebar() {
    const { user, logout } = useAuth();
    const userRole = user?.role as UserRole;

    const hasAccess = (item: NavItem) => {
        if (!item.roles) return true;
        return item.roles.includes(userRole);
    };

    return (
        <aside className="w-64 bg-wiria-blue-dark text-white flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-white border-opacity-10">
                <Link to={ROUTES.HOME} className="text-2xl font-bold block">WIRIA CBO</Link>
                <p className="text-xs text-blue-200 opacity-70 mb-4">Admin Panel</p>
                <Link
                    to={ROUTES.HOME}
                    className="inline-flex items-center text-xs font-bold bg-white bg-opacity-10 hover:bg-opacity-20 px-3 py-1.5 rounded-lg transition-all"
                >
                    <span className="mr-2">🌐</span> Visit Website
                </Link>
            </div>
            <nav className="flex-grow p-4 space-y-2 mt-4 overflow-y-auto">
                {NAV_ITEMS.filter(hasAccess).map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === ROUTES.ADMIN}
                        className={({ isActive }) =>
                            `w-full text-left p-3 rounded-xl hover:bg-white hover:bg-opacity-10 transition-all font-semibold flex items-center ${isActive ? 'bg-white bg-opacity-10' : ''}`
                        }
                    >
                        <span className="mr-3">{item.icon}</span> {item.label}
                    </NavLink>
                ))}

                {(userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN) && (
                    <div className="pt-6 border-t border-white border-opacity-10 space-y-2 mt-4">
                        {SUPER_ADMIN_ITEMS.filter(hasAccess).map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `w-full text-left p-3 rounded-xl hover:bg-white hover:bg-opacity-10 transition-all font-semibold flex items-center ${isActive ? 'bg-white bg-opacity-10' : ''}`
                                }
                            >
                                <span className="mr-3">{item.icon}</span> {item.label}
                            </NavLink>
                        ))}
                    </div>
                )}
            </nav>
            <div className="p-6 border-t border-white border-opacity-10">
                <button
                    onClick={() => logout()}
                    className="w-full text-left p-3 text-red-300 hover:text-red-100 transition-colors flex items-center font-bold"
                >
                    <span className="mr-3">🚪</span> Logout
                </button>
            </div>
        </aside>
    );
}
