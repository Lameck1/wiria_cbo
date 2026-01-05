/**
 * Member Login Page
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/shared/components/layout/Layout';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/context/AuthContext';
import { UserRole } from '@/shared/types';
import { ROUTES } from '@/shared/constants/routes';

function MemberLoginPage() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user?.role === UserRole.MEMBER) {
            navigate(ROUTES.MEMBER_PORTAL, { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    return (
        <Layout>
            <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
                <LoginForm
                    isMember
                    title="Member Portal Login"
                    subtitle="Access your WIRIA CBO membership account"
                />
            </div>
        </Layout>
    );
}

export default MemberLoginPage;
