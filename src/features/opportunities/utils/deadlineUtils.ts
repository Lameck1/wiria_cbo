/**
 * Date and Deadline Utilities
 * Pure functions for deadline calculations
 */

/**
 * Calculate days until deadline
 */
export function getDaysUntilDeadline(deadline: string): number | null {
    if (deadline === 'Ongoing' || deadline === 'Rolling basis') {
        return null;
    }
    try {
        const deadlineDate = new Date(deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    } catch {
        return null;
    }
}

/**
 * Get urgency level based on days remaining
 */
export function getUrgencyLevel(daysRemaining: number | null): 'urgent' | 'soon' | 'normal' | null {
    if (daysRemaining === null) return null;
    if (daysRemaining <= 3) return 'urgent';
    if (daysRemaining <= 7) return 'soon';
    return 'normal';
}

/**
 * Check if opportunity was posted recently (within last 7 days)
 */
export function isNewOpportunity(createdAt: string): boolean {
    try {
        const created = new Date(createdAt);
        const now = new Date();
        const daysDiff = Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff <= 7;
    } catch {
        return false;
    }
}
