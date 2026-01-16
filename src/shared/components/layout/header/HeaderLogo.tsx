import { Link } from 'react-router-dom';

import { ROUTES } from '@/shared/constants/routes';

interface HeaderLogoProps {
  isScrolled: boolean;
  mobile?: boolean;
}

export function HeaderLogo({ isScrolled, mobile }: HeaderLogoProps) {
  const logoHeight = mobile ? (isScrolled ? 'h-8' : 'h-10') : isScrolled ? 'h-14' : 'h-16';

  const textSize = mobile
    ? isScrolled
      ? 'text-base'
      : 'text-lg'
    : isScrolled
      ? 'text-2xl'
      : 'text-3xl';

  return (
    <Link
      to={ROUTES.HOME}
      className="flex items-center gap-3 transition-all duration-300 hover:opacity-90"
    >
      <img
        src={`${import.meta.env.BASE_URL}images/Wiria_CBO_Logo_NEW_IV.png`}
        alt="WIRIA CBO"
        className={`transition-all duration-300 ${logoHeight}`}
      />
      <span
        className={`whitespace-nowrap font-bold text-wiria-blue-dark transition-all duration-300 ${textSize}`}
      >
        WIRIA CBO
      </span>
    </Link>
  );
}
