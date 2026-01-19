import { NavLink } from 'react-router-dom';

import { ROUTES } from '@/shared/constants/routes';

const NAV_ITEMS = [
  { to: ROUTES.HOME, label: 'Home' },
  { to: ROUTES.ABOUT, label: 'About' },
  { to: ROUTES.PROGRAMS, label: 'Programs' },
  { to: ROUTES.OPPORTUNITIES, label: 'Opportunities' },
  { to: ROUTES.CAREERS, label: 'Careers' },
  { to: ROUTES.RESOURCES, label: 'Resources' },
  { to: ROUTES.CONTACT, label: 'Contact' },
];

interface DesktopNavProps {
  isActive: (path: string) => boolean;
}

export function DesktopNav({ isActive }: DesktopNavProps) {
  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Main Navigation">
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
          <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light transition-all duration-300 group-hover:w-3/4" />
        </NavLink>
      ))}
    </nav>
  );
}
