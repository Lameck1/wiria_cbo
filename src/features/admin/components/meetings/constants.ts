export const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export const TYPE_LABELS: Record<string, string> = {
  AGM: 'Annual General Meeting',
  SGM: 'Special General Meeting',
  COMMITTEE: 'Committee Meeting',
  OTHER: 'Other',
};

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = Number.parseInt(hours ?? '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes ?? '00'} ${ampm}`;
}
