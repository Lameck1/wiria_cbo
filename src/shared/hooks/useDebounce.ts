/**
 * useDebounce hook
 * Delays function execution until after a specified delay
 */

import { useCallback, useEffect, useRef } from 'react';
import { TIMING } from '../constants/config';

/**
 * Returns a debounced version of the provided callback
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds (default: 300ms from config)
 * @returns Debounced callback function
 */
export function useDebounce<T extends (...args: never[]) => void>(
  callback: T,
  delay: number = TIMING.DEBOUNCE_DEFAULT
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}
