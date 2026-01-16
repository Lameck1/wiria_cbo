/**
 * Payment Status Poller Hook
 * Polls payment status at regular intervals
 */

import { useEffect, useRef } from 'react';

import { TIMING } from '@/shared/constants/config';

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
  interval = TIMING.PAYMENT_POLL_INTERVAL,
}: UsePaymentPollerProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callbackRef = useRef(onStatusCheck);

  useEffect(() => {
    callbackRef.current = onStatusCheck;
  }, [onStatusCheck]);

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
      const callback = callbackRef.current;
      if (!callback) {
        return;
      }

      const status = await callback(donationId);

      // Stop polling if payment is complete or failed
      if ((status === 'COMPLETED' || status === 'FAILED') && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    void checkStatus();

    // Set up polling interval
    intervalRef.current = setInterval(() => void checkStatus(), interval);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [donationId, isActive, interval]);
}
