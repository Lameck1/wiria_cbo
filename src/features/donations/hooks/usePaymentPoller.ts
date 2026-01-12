/**
 * Payment Status Poller Hook
 * Polls payment status at regular intervals
 */

import { useEffect, useRef } from 'react';

interface UsePaymentPollerProps {
  donationId: string | null;
  isActive: boolean;
  onStatusCheck: (donationId: string) => Promise<string>;
  interval?: number;
}

export function usePaymentPoller({
  donationId,
  isActive,
  onStatusCheck,
  interval = 5000, // 5 seconds
}: UsePaymentPollerProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive || !donationId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial check
    const checkStatus = async () => {
      const status = await onStatusCheck(donationId);

      // Stop polling if payment is complete or failed
      if (status === 'COMPLETED' || status === 'FAILED') {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    checkStatus();

    // Set up polling interval
    intervalRef.current = setInterval(checkStatus, interval);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [donationId, isActive, onStatusCheck, interval]);
}
