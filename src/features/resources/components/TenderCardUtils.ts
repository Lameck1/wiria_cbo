export function getCountdown(deadline: string): {
  days: number;
  hours: number;
  isExpired: boolean;
  isUrgent: boolean;
} {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, isExpired: true, isUrgent: false };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const isUrgent = days <= 7;

  return { days, hours, isExpired: false, isUrgent };
}

export function getStatusBadge(status: string, isUrgent: boolean, isExpired: boolean) {
  if (isExpired || status === 'CLOSED') {
    return { text: 'Closed', bgClass: 'bg-gray-100 text-gray-600', dotClass: 'bg-gray-400' };
  }
  if (isUrgent) {
    return {
      text: 'Closing Soon',
      bgClass: 'bg-red-100 text-red-600',
      dotClass: 'bg-red-500 animate-pulse',
    };
  }
  if (status === 'OPEN') {
    return { text: 'Open', bgClass: 'bg-green-100 text-green-600', dotClass: 'bg-green-600' };
  }
  return { text: status, bgClass: 'bg-gray-100 text-gray-600', dotClass: 'bg-gray-400' };
}

