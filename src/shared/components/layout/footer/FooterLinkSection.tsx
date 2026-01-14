import { ReactNode } from 'react';

import { Link } from 'react-router-dom';

interface FooterLink {
  to: string;
  label: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  badge?: React.ReactNode;
  className?: string;
}

interface FooterLinkSectionProps {
  title: string;
  links: FooterLink[];
}

export function FooterLinkSection({ title, links }: FooterLinkSectionProps) {
  return (
    <div className="min-w-[200px] flex-1 text-center lg:text-left">
      <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-wiria-yellow">
        {title}
      </h4>
      <ul className="flex flex-col items-center space-y-3 text-sm lg:items-start">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              onClick={link.onClick}
              className={link.className || 'text-gray-300 transition-colors hover:text-white'}
            >
              {link.label}
              {link.badge}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
