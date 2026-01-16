export const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700',
  INVESTIGATING: 'bg-orange-100 text-orange-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-500',
};

export const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL: 'bg-red-600 text-white',
  HIGH: 'bg-orange-500 text-white',
  MEDIUM: 'bg-yellow-500 text-white',
  LOW: 'bg-green-500 text-white',
};

export const INCIDENT_TYPES: Record<string, string> = {
  CHILD_PROTECTION: 'Child Protection',
  SEXUAL_EXPLOITATION: 'Sexual Exploitation',
  HARASSMENT: 'Harassment',
  DISCRIMINATION: 'Discrimination',
  FRAUD: 'Fraud',
  OTHER: 'Other',
};
