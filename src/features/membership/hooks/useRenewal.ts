/**
 * useRenewal Hook
 * Refactored to use shared usePaymentFlow hook
 */

import { useCallback, useState } from 'react';

import { usePaymentFlow } from '@/shared/hooks/usePaymentFlow';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { useServices } from '@/shared/services/di';

export interface RenewalData {
  paymentMethod: 'STK_PUSH' | 'MANUAL';
  phoneNumber?: string;
  transactionCode?: string;
  memberCount?: number;
  amount: number;
}

export interface RenewalResponse {
  success: boolean;
  message: string;
  checkoutRequestId?: string;
  transactionId?: string;
}

export function useRenewal() {
  const { apiClient } = useServices();
  const [renewalId, setRenewalId] = useState<string | null>(null);

  const paymentFlow = usePaymentFlow({
    flowType: 'renewal',
    initiationEndpoint: API_ENDPOINTS.MEMBERS_RENEW,
    statusEndpoint: API_ENDPOINTS.PAYMENTS_STATUS,
    messages: {
      initiationSuccess: 'Renewal successful!',
      paymentCompleted: 'Payment completed! Your membership has been renewed.',
      stkPushSent: 'STK push sent to your phone. Please complete the payment.',
      manualPaymentSubmitted: 'Transaction submitted for verification.',
    },
  });

  const submitRenewal = useCallback(
    async (data: RenewalData) => {
      try {
        // Call API to initiate renewal
        const response = await apiClient.post<RenewalResponse>(
          API_ENDPOINTS.MEMBERS_RENEW,
          data
        );

        const { checkoutRequestId, transactionId, message } = response;
        const renewalTransactionId = checkoutRequestId ?? transactionId;

        if (renewalTransactionId) {
          setRenewalId(renewalTransactionId);
        }

        // Use shared payment flow for payment processing
        const result = await paymentFlow.initiatePayment({
          ...data,
          renewalId: renewalTransactionId,
        });

        return {
          success: result.success,
          transactionId: renewalTransactionId,
          message,
        };
      } catch {
        return { success: false };
      }
    },
    [apiClient, paymentFlow]
  );

  const resetRenewal = useCallback(() => {
    setRenewalId(null);
    paymentFlow.resetPayment();
  }, [paymentFlow]);

  return {
    // Renewal-specific state
    renewalId,

    // Payment flow state and actions (delegated to shared hook)
    isSubmitting: paymentFlow.isSubmitting,
    paymentStatus: paymentFlow.paymentStatus,
    transactionId: paymentFlow.transactionId,

    // Actions
    submitRenewal,
    checkPaymentStatus: paymentFlow.checkPaymentStatus,
    resetRenewal,
  };
}

// Re-export PaymentStatus for convenience
export { PaymentStatus } from '@/shared/types/payment';
