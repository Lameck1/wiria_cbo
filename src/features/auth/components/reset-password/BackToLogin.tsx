import { Link } from 'react-router-dom';

export function ResetPasswordBackToLogin({ hidden }: { hidden: boolean }) {
  if (hidden) {
    return null;
  }

  return (
    <div className="mt-8 border-t border-gray-100 pt-6 text-center">
      <Link
        to="/member-login"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-wiria-blue-dark"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Login
      </Link>
    </div>
  );
}
