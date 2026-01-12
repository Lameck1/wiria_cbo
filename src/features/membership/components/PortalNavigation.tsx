/**
 * Portal Navigation Component
 * Horizontal tabs for member portal pages
 */

import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/member-portal', label: 'Dashboard', icon: '🏠', exact: true },
  { to: '/member-profile', label: 'Profile', icon: '👤' },
  { to: '/member-renewal', label: 'Renewal', icon: '🔄' },
  { to: '/member-payments', label: 'Payments', icon: '💳' },
  { to: '/member-meetings', label: 'Meetings', icon: '📅' },
];

export function PortalNavigation() {
  return (
    <nav className="mb-6 overflow-x-auto rounded-xl bg-white shadow-md">
      <div className="flex">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-2 whitespace-nowrap border-b-2 px-5 py-4 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-wiria-blue-dark bg-wiria-blue-dark/5 text-wiria-blue-dark'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-wiria-blue-dark'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
