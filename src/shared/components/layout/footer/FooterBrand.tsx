import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

export function FooterBrand() {
  return (
    <div className="text-center lg:max-w-sm lg:text-left">
      <Link to={ROUTES.HOME} className="mb-4 inline-flex items-center gap-3">
        <img
          src={`${import.meta.env.BASE_URL}images/Wiria_CBO_Logo_NEW_IV.png`}
          alt="WIRIA CBO"
          className="h-14 w-auto"
        />
        <span className="text-2xl font-bold">WIRIA CBO</span>
      </Link>
      <p className="mb-6 text-sm leading-relaxed text-gray-300">
        Wiria (Wellness, Inclusion, Rights, and Impact Advocates) Community Based Organization.
        Empowering Communities, Enhancing Health, Championing Rights for Key and Vulnerable
        Populations.
      </p>
      <Link
        to={ROUTES.DONATIONS}
        className="inline-flex items-center gap-2 rounded-full bg-wiria-yellow px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        Support Our Mission
      </Link>
    </div>
  );
}
