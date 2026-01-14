import clsx, { ClassValue } from 'clsx';

/**
 * Utility function to merge class names.
 * Uses clsx for conditional class names.
 */
export function cn(...inputs: ClassValue[]): string {
    return clsx(inputs);
}
