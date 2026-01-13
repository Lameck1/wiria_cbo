/**
 * useFeeCalculation Hook
 * Centralized fee calculation for membership registration and renewal
 */

import { useMemo } from 'react';
import { MEMBERSHIP_FEES } from '@/shared/constants/membership';

export type MembershipType = 'INDIVIDUAL' | 'GROUP';

export interface FeeDetail {
    rate: number;
    count: number;
    subtotal: number;
}

export interface FeeBreakdown {
    registration: FeeDetail;
    subscription: FeeDetail;
    total: number;
}

export interface RenewalFeeBreakdown {
    renewal: FeeDetail;
    newRegistration: FeeDetail;
    total: number;
}

interface UseFeeCalculationOptions {
    membershipType: MembershipType;
    memberCount: number;
}

interface UseRenewalFeeOptions extends UseFeeCalculationOptions {
    /** The previous maximum count reached to handle incremental group fees */
    maxCount: number;
}

/**
 * Calculate fees for new membership registration
 */
export function useFeeCalculation({
    membershipType,
    memberCount,
}: UseFeeCalculationOptions): FeeBreakdown {
    return useMemo(() => {
        const fees = MEMBERSHIP_FEES[membershipType];
        const regRate = fees.registration;
        const subRate = fees.subscription;
        const count = membershipType === 'INDIVIDUAL' ? 1 : Math.max(1, memberCount);

        const registration: FeeDetail = { rate: regRate, count, subtotal: regRate * count };
        const subscription: FeeDetail = { rate: subRate, count, subtotal: subRate * count };

        return {
            registration,
            subscription,
            total: registration.subtotal + subscription.subtotal,
        };
    }, [membershipType, memberCount]);
}

/**
 * Calculate fees for membership renewal
 * Handles incremental registration for groups adding new members
 */
export function useRenewalFeeCalculation({
    membershipType,
    memberCount,
    maxCount,
}: UseRenewalFeeOptions): RenewalFeeBreakdown {
    return useMemo(() => {
        const fees = MEMBERSHIP_FEES[membershipType];
        const { subscription: subRate, registration: regRate } = fees;

        const renewalCount = membershipType === 'GROUP' ? Math.max(1, memberCount) : 1;
        const newRegCount = membershipType === 'GROUP' ? Math.max(0, memberCount - maxCount) : 0;

        const renewalTotal = renewalCount * subRate;
        const regTotal = newRegCount * regRate;

        const renewal: FeeDetail = { count: renewalCount, rate: subRate, subtotal: renewalTotal };
        const newRegistration: FeeDetail = { count: newRegCount, rate: regRate, subtotal: regTotal };

        return {
            renewal,
            newRegistration,
            total: renewalTotal + regTotal,
        };
    }, [membershipType, memberCount, maxCount]);
}
