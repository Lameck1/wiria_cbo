/**
 * Date Formatting Utilities

 */

/**
 * Format a date to a human-readable format
 */
export function formatDate(date: string | Date): string {
  if (typeof date === 'string' && (date === 'Ongoing' || date === 'Rolling basis')) {
    return date;
  }
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return String(date);
  }
}

/**
 * Format a date to a short format (for listings)
 */
export function formatDateShort(dateString: string): string {
  if (dateString === 'Ongoing' || dateString === 'Rolling basis') {
    return dateString;
  }
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
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
  const yearInt = Number.parseInt(year || '0');
  const monthInt = Number.parseInt(month || '1');
  const date = new Date(yearInt, monthInt - 1);
  return date.toLocaleDateString('en-KE', { month: 'short', year: 'numeric' });
}

/**
 * Formats a date to include time (e.g., "Jan 12, 2026, 10:57 PM")
 */
export function formatDateTime(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(date);
  }
}
