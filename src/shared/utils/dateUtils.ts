/**
 * Date Formatting Utilities

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

/**
 * Formats a date as human-readable relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Formats a month key (YYYY-MM) to readable format
 */
export function formatMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const yearInt = parseInt(year || '0');
  const monthInt = parseInt(month || '1');
  const date = new Date(yearInt, monthInt - 1);
  return date.toLocaleDateString('en-KE', { month: 'short', year: 'numeric' });
}
