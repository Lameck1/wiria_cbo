/**
 * Unit tests for membership constants
 */

import { describe, it, expect } from 'vitest';
import { MEMBERSHIP_FEES, getTotalFee } from '@/shared/constants/membership';

describe('Membership Constants', () => {
    describe('MEMBERSHIP_FEES', () => {
        it('should have correct INDIVIDUAL fees', () => {
            expect(MEMBERSHIP_FEES.INDIVIDUAL.registration).toBe(500);
            expect(MEMBERSHIP_FEES.INDIVIDUAL.subscription).toBe(1000);
        });

        it('should have correct GROUP fees', () => {
            expect(MEMBERSHIP_FEES.GROUP.registration).toBe(250);
            expect(MEMBERSHIP_FEES.GROUP.subscription).toBe(500);
        });

        it('should have GROUP fees lower than INDIVIDUAL fees', () => {
            expect(MEMBERSHIP_FEES.GROUP.registration).toBeLessThan(MEMBERSHIP_FEES.INDIVIDUAL.registration);
            expect(MEMBERSHIP_FEES.GROUP.subscription).toBeLessThan(MEMBERSHIP_FEES.INDIVIDUAL.subscription);
        });
    });

    describe('getTotalFee', () => {
        it('should calculate correct total for INDIVIDUAL', () => {
            const total = getTotalFee('INDIVIDUAL');
            expect(total).toBe(1500); // 500 + 1000
        });

        it('should calculate correct total for GROUP', () => {
            const total = getTotalFee('GROUP');
            expect(total).toBe(750); // 250 + 500
        });
    });
});
