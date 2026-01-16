/**
 * Footer Component - Refactored with Sub-Components
 * Global footer with clean component composition
 */

import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/shared/constants/routes';
import { useBackendStatus } from '@/shared/services/backendStatus';
import { notificationService } from '@/shared/services/notification/notificationService';

import {
  FooterBrand,
  FooterContact,
  FooterCopyright,
  FooterLinkSection,
  FooterNewsletter,
  FooterSocial,
} from './footer';

export function Footer() {
  const { isBackendConnected } = useBackendStatus();
  const navigate = useNavigate();

  const handleProtectedLink = (event: React.MouseEvent, route: string, label: string) => {
    if (isBackendConnected) {
      navigate(route);
    } else {
      event.preventDefault();
      notificationService.info(
        `${label} is temporarily unavailable while we finalize our server setup. Please check back soon!`,
        5000
      );
    }
  };

  const soonBadge = (
    <span className="rounded border border-wiria-yellow/30 bg-wiria-yellow/20 px-1.5 py-0.5 text-[10px] uppercase tracking-tighter text-wiria-yellow">
      Soon
    </span>
  );

  const exploreLinks = [
    { to: ROUTES.ABOUT, label: 'About Us' },
    { to: ROUTES.PROGRAMS, label: 'Our Programs' },
    { to: ROUTES.MEMBERSHIP, label: 'Get Involved' },
    {
      to: ROUTES.MEMBER_MEETINGS,
      label: 'Meetings',
      onClick: (event: React.MouseEvent) => handleProtectedLink(event, ROUTES.MEMBER_MEETINGS, 'Member Meetings'),
      badge: isBackendConnected ? undefined : soonBadge,
      className: `flex items-center gap-2 text-gray-300 transition-colors hover:text-white ${!isBackendConnected && 'cursor-not-allowed opacity-60'}`,
    },
    { to: ROUTES.DONATIONS, label: 'Donate' },
  ];

  const opportunitiesLinks = [
    { to: ROUTES.CAREERS, label: 'Careers' },
    { to: ROUTES.OPPORTUNITIES, label: 'Volunteering' },
    { to: `${ROUTES.RESOURCES}#tenders`, label: 'Tenders' },
    { to: `${ROUTES.OPPORTUNITIES}#internships`, label: 'Internships' },
  ];

  const resourcesLinks = [
    { to: ROUTES.RESOURCES, label: 'Documents' },
    { to: `${ROUTES.RESOURCES}#publications`, label: 'Publications' },
    { to: `${ROUTES.RESOURCES}#annual-reports`, label: 'Annual Reports' },
  ];

  const transparencyLinks = [
    {
      to: ROUTES.STAFF_LOGIN,
      label: 'Staff Portal',
      onClick: (event: React.MouseEvent) => handleProtectedLink(event, ROUTES.STAFF_LOGIN, 'Staff Portal'),
      badge: isBackendConnected ? undefined : soonBadge,
      className: `flex items-center gap-2 text-gray-300 transition-colors hover:text-white ${!isBackendConnected && 'cursor-not-allowed opacity-60'}`,
    },
    { to: ROUTES.SAFEGUARDING, label: 'Privacy Policy' },
    {
      to: ROUTES.SAFEGUARDING,
      label: (
        <>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          Report a Concern
        </>
      ),
      className: 'flex items-center gap-2 text-gray-300 transition-colors hover:text-white',
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-wiria-blue-dark to-slate-900 text-white">
      <div className="container mx-auto px-4 pb-8 pt-16 lg:px-6">
        {/* Top Section with Logo and Newsletter */}
        <div className="mb-12 flex flex-col gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-start lg:justify-between">
          <FooterBrand />
          <FooterNewsletter />
        </div>

        {/* Links Grid */}
        <div className="mb-12 flex flex-wrap justify-center gap-8 lg:justify-between lg:gap-12">
          <FooterLinkSection title="Explore" links={exploreLinks} />
          <FooterLinkSection title="Opportunities" links={opportunitiesLinks} />
          <FooterLinkSection title="Resources" links={resourcesLinks} />
          <FooterLinkSection title="Transparency" links={transparencyLinks} />
          <FooterContact />
        </div>

        {/* Social Links & Copyright Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <FooterSocial />
            <FooterCopyright />
          </div>
        </div>
      </div>
    </footer>
  );
}
