/**
 * Staff Login Page
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Layout } from '@/shared/components/layout/Layout';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/context/AuthContext';
import { UserRole } from '@/shared/types';
import { ROUTES } from '@/shared/constants/routes';

function StaffLoginPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const isExpired = new URLSearchParams(window.location.search).get('expired') === 'true';

  useEffect(() => {
    if (
      isAuthenticated &&
      [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF].includes(user?.role as UserRole)
    ) {
      navigate(ROUTES.ADMIN, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <Layout>
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12">
        {isExpired && (
          <div className="mb-6 max-w-md rounded-xl border border-orange-200 bg-orange-50 p-4 text-center text-orange-700">
            <p className="font-bold">Session Expired</p>
            <p className="text-sm">
              Your session is no longer valid or has been reset. Please log in again to continue.
            </p>
          </div>
        )}
        <LoginForm title="Staff Portal Login" subtitle="Authorized personnel only" />
      </div>
    </Layout>
  );
}

export default StaffLoginPage;
