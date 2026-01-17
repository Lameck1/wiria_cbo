/**
 * Protected Route Component
 * Handles role-based access control
 */

import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/shared/constants/routes';
import type { UserRole } from '@/shared/types';

import { useAuth } from '../context/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo: string;
}

export function ProtectedRoute({ children, allowedRoles, redirectTo }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // While checking auth, render nothing (instant - no spinner)
  if (isLoading) {
    return null;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Authorized - render children
  return <>{children}</>;
}
