/**
 * useAuthCTA Hook
 * Provides authentication-aware CTA configuration for Hero section
 * Matches original HTML behavior
 * When backend is offline, always returns "Join Us" to /membership
 */

import { useMemo } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useBackendStatus } from '@/shared/services/backendStatus';
import { UserRole } from '@/shared/types';

interface AuthCTAConfig {
    text: string;
    href: string;
    className: string;
    showArrow: boolean;
}

export function useAuthCTA(): AuthCTAConfig {
    const { user, isAuthenticated } = useAuth();
    const { isBackendConnected } = useBackendStatus();
    const role = user?.role;

    return useMemo(() => {
        // Default CTA for when backend is offline or user is not authenticated
        const defaultCTA: AuthCTAConfig = {
            text: 'Join Us',
            href: '/membership',
            className: 'bg-wiria-yellow text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-all',
            showArrow: false,
        };

        // When backend is offline, always show default "Join Us" CTA
        if (!isBackendConnected) {
            return defaultCTA;
        }

        // Not authenticated - default "Join Us" CTA
        if (!isAuthenticated) {
            return defaultCTA;
        }

        // Member - "Go to Dashboard"
        if (role === UserRole.MEMBER) {
            return {
                text: 'Go to Dashboard',
                href: '/member-portal',
                className: 'bg-wiria-blue-dark text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-all',
                showArrow: true,
            };
        }

        // Admin/Staff - "Go to Dashboard"
        if ([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF].includes(role as UserRole)) {
            return {
                text: 'Go to Dashboard',
                href: '/admin',
                className: 'bg-wiria-blue-dark text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-all',
                showArrow: true,
            };
        }

        // Fallback
        return defaultCTA;
    }, [isAuthenticated, role, isBackendConnected]);
}
