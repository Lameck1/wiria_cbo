/**
 * Membership Fee Constants
 * Centralized source of truth for membership pricing.
 */

export const MEMBERSHIP_FEES = {
    INDIVIDUAL: {
        registration: 500,
        subscription: 1000,
    },
    GROUP: {
        registration: 250,
        subscription: 500,
    },
} as const;

/** Type for membership categories */
export type MembershipCategory = keyof typeof MEMBERSHIP_FEES;

/** Helper to get total fee (registration + subscription) */
export function getTotalFee(category: MembershipCategory): number {
    const fees = MEMBERSHIP_FEES[category];
    return fees.registration + fees.subscription;
}
