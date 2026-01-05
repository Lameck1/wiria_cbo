/**
 * Date Formatting Utilities
 * Single responsibility: Format dates consistently across the app
 */

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateStr: string): string {
    if (dateStr === 'Ongoing' || dateStr === 'Rolling basis') {
        return dateStr;
    }
    try {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

/**
 * Format a date to a short format (for listings)
 */
export function formatDateShort(dateStr: string): string {
    if (dateStr === 'Ongoing' || dateStr === 'Rolling basis') {
        return dateStr;
    }
    try {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

/**
 * Calculate days remaining until a deadline
 */
export function getDaysRemaining(deadline: string): number | null {
    if (deadline === 'Ongoing' || deadline === 'Rolling basis') {
        return null;
    }
    try {
        const deadlineDate = new Date(deadline);
        const today = new Date();
        return Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    } catch {
        return null;
    }
}
