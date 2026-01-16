/**
 * Member Login Page
 */

import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/context/useAuth';
import { ROUTES } from '@/shared/constants/routes';
import { UserRole } from '@/shared/types';

function MemberLoginPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === UserRole.MEMBER) {
      navigate(ROUTES.MEMBER_PORTAL, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <LoginForm
        isMember
        title="Member Portal Login"
        subtitle="Access your WIRIA CBO membership account"
      />
    </div>
  );
}

export default MemberLoginPage;
