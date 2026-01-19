/**
 * Route Protection Utilities
 * Helper functions for cleaner protected route definitions
 */

import type { ReactElement } from 'react';

import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { ROUTES } from '@/shared/constants/routes';
import { UserRole } from '@/shared/types';

/**
 * Wraps a component with member-only protection
 */
function withMemberProtection(element: ReactElement): ReactElement {
  return (
    <ProtectedRoute allowedRoles={[UserRole.MEMBER]} redirectTo={ROUTES.MEMBER_LOGIN}>
      {element}
    </ProtectedRoute>
  );
}



/**
 * Creates a protected route object for use in router config
 */
export function createMemberRoute(path: string, element: ReactElement) {
  return {
    path,
    element: withMemberProtection(element),
  };
}

