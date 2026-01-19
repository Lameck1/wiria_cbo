import { Link } from 'react-router-dom';

import { Button } from '@/shared/components/ui/Button';

export function ResetPasswordSuccessStep() {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-10 w-10 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-green-800">Password Reset!</h1>
      <p className="mb-6 text-gray-600">
        Your password has been successfully reset. You can now login with your new password.
      </p>
      <Link to="/member-login">
        <Button fullWidth size="lg">
          Login to Member Portal
        </Button>
      </Link>
    </div>
  );
}
