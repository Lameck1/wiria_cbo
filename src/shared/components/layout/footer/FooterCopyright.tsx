import { Link } from 'react-router-dom';

import { ROUTES } from '@/shared/constants/routes';

export function FooterCopyright() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col items-center gap-2 text-center text-sm text-gray-400 sm:flex-row sm:gap-4">
      <p>&copy; {currentYear} WIRIA Community Based Organization.</p>
      <span className="hidden sm:block">•</span>
      <p>All Rights Reserved.</p>
      <span className="hidden sm:block">•</span>
      <Link to={ROUTES.SAFEGUARDING} className="transition-colors hover:text-wiria-yellow">
        Kenya Data Protection Act 2019
      </Link>
    </div>
  );
}
