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
  {
    label: 'Members',
    path: ROUTES.ADMIN_MEMBERS,
    icon: '👤',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
  },
];

const SUPER_ADMIN_ITEMS: NavItem[] = [
  {
    label: 'Staff',
    path: ROUTES.ADMIN_USERS,
    icon: '👥',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    label: 'Resources',
    path: ROUTES.ADMIN_RESOURCES,
    icon: '📚',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
];

export function AdminSidebar() {
  const { user, logout } = useAuth();
  const userRole = user?.role as UserRole;

  const hasAccess = (item: NavItem) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col bg-wiria-blue-dark text-white lg:flex">
      <div className="border-b border-white border-opacity-10 p-6">
        <Link to={ROUTES.HOME} className="block text-2xl font-bold">
          WIRIA CBO
        </Link>
        <p className="mb-4 text-xs text-blue-200 opacity-70">Admin Panel</p>
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center rounded-lg bg-white bg-opacity-10 px-3 py-1.5 text-xs font-bold transition-all hover:bg-opacity-20"
        >
          <span className="mr-2">🌐</span> Visit Website
        </Link>
      </div>
      <nav className="mt-4 flex-grow space-y-2 overflow-y-auto p-4">
        {NAV_ITEMS.filter(hasAccess).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.ADMIN}
            className={({ isActive }) =>
              `flex w-full items-center rounded-xl p-3 text-left font-semibold transition-all hover:bg-white hover:bg-opacity-10 ${isActive ? 'bg-white bg-opacity-10' : ''}`
            }
          >
            <span className="mr-3">{item.icon}</span> {item.label}
          </NavLink>
        ))}

        {(userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN) && (
          <div className="mt-4 space-y-2 border-t border-white border-opacity-10 pt-6">
            {SUPER_ADMIN_ITEMS.filter(hasAccess).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex w-full items-center rounded-xl p-3 text-left font-semibold transition-all hover:bg-white hover:bg-opacity-10 ${isActive ? 'bg-white bg-opacity-10' : ''}`
                }
              >
                <span className="mr-3">{item.icon}</span> {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
      <div className="border-t border-white border-opacity-10 p-6">
        <button
          onClick={() => logout()}
          className="flex w-full items-center p-3 text-left font-bold text-red-300 transition-colors hover:text-red-100"
        >
          <span className="mr-3">🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
