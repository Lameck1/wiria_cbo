/**
 * Unit tests for useDashboardData hook utilities
 */

import { describe, it, expect } from 'vitest';

import { canAccessModule, formatCurrency } from '@/features/admin/hooks/useDashboardData';
import { UserRole } from '@/shared/types';

describe('useDashboardData utilities', () => {

    describe('canAccessModule', () => {
        it('should allow SUPER_ADMIN to access all modules', () => {
            expect(canAccessModule(UserRole.SUPER_ADMIN, 'members')).toBe(true);
            expect(canAccessModule(UserRole.SUPER_ADMIN, 'safeguarding')).toBe(true);
            expect(canAccessModule(UserRole.SUPER_ADMIN, 'users')).toBe(true);
        });

        it('should allow ADMIN to access all modules', () => {
            expect(canAccessModule(UserRole.ADMIN, 'members')).toBe(true);
            expect(canAccessModule(UserRole.ADMIN, 'safeguarding')).toBe(true);
        });

        it('should restrict STAFF from accessing sensitive modules', () => {
            expect(canAccessModule(UserRole.STAFF, 'members')).toBe(false);
            expect(canAccessModule(UserRole.STAFF, 'safeguarding')).toBe(false);
            expect(canAccessModule(UserRole.STAFF, 'users')).toBe(false);
        });

        it('should allow STAFF to access non-restricted modules', () => {
            expect(canAccessModule(UserRole.STAFF, 'news')).toBe(true);
            expect(canAccessModule(UserRole.STAFF, 'tenders')).toBe(true);
        });

        it('should return false for undefined role', () => {
            expect(canAccessModule(undefined, 'news')).toBe(false);
        });
    });

    describe('formatCurrency', () => {
        it('should format amounts with KES prefix', () => {
            expect(formatCurrency(1000)).toBe('KES 1,000');
            expect(formatCurrency(50000)).toBe('KES 50,000');
            expect(formatCurrency(0)).toBe('KES 0');
        });

        it('should handle large amounts', () => {
            expect(formatCurrency(1000000)).toBe('KES 1,000,000');
        });
    });
});
