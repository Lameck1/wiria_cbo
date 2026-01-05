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
        <nav className="bg-white rounded-xl shadow-md mb-6 overflow-x-auto">
            <div className="flex">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.exact}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${isActive
                                ? 'border-wiria-blue-dark text-wiria-blue-dark bg-wiria-blue-dark/5'
                                : 'border-transparent text-gray-600 hover:text-wiria-blue-dark hover:bg-gray-50'
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
