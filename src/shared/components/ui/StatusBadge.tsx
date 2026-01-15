export type BadgeType = 'success' | 'warning' | 'danger' | 'info';

interface StatusBadgeProps {
  status: string;
  type?: BadgeType;
}

const colors: Record<BadgeType, string> = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

const statusTypeMap: Record<string, BadgeType> = {
  // Success
  COMPLETED: 'success',
  ACTIVE: 'success',
  ACCEPTED: 'success',
  RESOLVED: 'success',
  RESPONDED: 'success',
  PUBLISHED: 'success',
  OPEN: 'success',
  APPROVED: 'success',

  // Warning
  PENDING: 'warning',
  UNDER_REVIEW: 'warning',
  INVESTIGATING: 'warning',
  DRAFT: 'warning',
  SUSPENDED: 'warning',

  // Danger
  REJECTED: 'danger',
  FAILED: 'danger',
  CRITICAL: 'danger',
  CANCELLED: 'danger',
  CLOSED: 'danger',
  EXPIRED: 'danger',

  // Info
  SHORTLISTED: 'info',
  IN_PROGRESS: 'info',
  AWARDED: 'info',
  INTERVIEWED: 'info',
  STAFF: 'info',
  ADMIN: 'info',
};

export function getStatusType(status: string): BadgeType {
  return statusTypeMap[status.toUpperCase()] ?? 'info';
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const badgeType = type ?? getStatusType(status);
  const colorClass = colors[badgeType];

  return <span className={`rounded-full px-2 py-1 text-xs font-bold ${colorClass}`}>{status}</span>;
}
