/**
 * Spinner Component
 * Loading spinner with different sizes
 */

import { cn } from '@/shared/utils/helpers';

/**
 * Props for the Spinner component.
 */
export interface SpinnerProps {
  /** Size of the spinner. Defaults to 'md'. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Optional class name for custom styling. */
  className?: string;
}

/**
 * Loading spinner component with configurable size.
 */
export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <svg
      className={cn('animate-spin text-wiria-yellow', sizeStyles[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Full Page Loader
 */
export function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <Spinner size="xl" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
