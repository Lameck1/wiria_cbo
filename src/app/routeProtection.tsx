/**
 * Route Protection Utilities
 * Helper functions for cleaner protected route definitions
 */

import { ReactElement } from 'react';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { UserRole } from '@/shared/types';
import { ROUTES } from '@/shared/constants/routes';

/**
 * Wraps a component with member-only protection
 */
export function withMemberProtection(element: ReactElement): ReactElement {
    return (
        <ProtectedRoute allowedRoles={[UserRole.MEMBER]} redirectTo={ROUTES.MEMBER_LOGIN}>
            {element}
        </ProtectedRoute>
    );
}

/**
 * Wraps a component with admin/staff protection
 */
export function withAdminProtection(element: ReactElement): ReactElement {
    return (
        <ProtectedRoute
            allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF]}
            redirectTo={ROUTES.STAFF_LOGIN}
        >
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

/**
 * Creates a protected admin route object
 */
export function createAdminRoute(path: string, element: ReactElement) {
    return {
        path,
        element: withAdminProtection(element),
    };
}
