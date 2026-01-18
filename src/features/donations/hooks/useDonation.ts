/**
 * useDonation Hook
 * Handles donation submission and payment processing
 * Refactored to use shared usePaymentFlow hook
 */

import { useCallback, useState } from 'react';

import { usePaymentFlow } from '@/shared/hooks/usePaymentFlow';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { useServices } from '@/shared/services/di';

import type { DonationFormData, DonationResponse } from '../types';

export function useDonation() {
  const [donationId, setDonationId] = useState<string | null>(null);
  const { apiClient, notificationService } = useServices();

  const paymentFlow = usePaymentFlow({
    flowType: 'donation',
    initiationEndpoint: API_ENDPOINTS.DONATIONS_INITIATE,
    statusEndpoint: API_ENDPOINTS.DONATIONS_STATUS,
    manualVerificationEndpoint: API_ENDPOINTS.DONATIONS_VERIFY_MANUAL,
    messages: {
      initiationSuccess: 'Donation initiated successfully!',
      paymentCompleted: 'Payment completed successfully! Thank you for your donation.',
      stkPushSent: 'STK push sent to your phone. Please complete the payment.',
    },
  });

  const initiateDonation = useCallback(
    async (data: DonationFormData) => {
      try {
        // Call API to create donation record
        const response = await apiClient.post<DonationResponse>(
          API_ENDPOINTS.DONATIONS_INITIATE,
          data
        );

        const { donation, checkoutRequestId, message } = response.data;
        setDonationId(donation.id);

        // Use shared payment flow for payment processing
        const result = await paymentFlow.initiatePayment({
          ...data,
          donationId: donation.id,
        });

        return {
          success: result.success,
          donationId: donation.id,
          checkoutRequestId: checkoutRequestId ?? result.checkoutRequestId,
          message,
        };
      } catch {
        notificationService.error('Failed to initiate donation. Please try again.');
        return { success: false };
      }
    },
    [apiClient, notificationService, paymentFlow]
  );

  const resetDonation = useCallback(() => {
    setDonationId(null);
    paymentFlow.resetPayment();
  }, [paymentFlow]);

  return {
    // Donation-specific state
    donationId,

    // Payment flow state and actions (delegated to shared hook)
    isSubmitting: paymentFlow.isSubmitting,
    isVerifying: paymentFlow.isVerifying,
    isManualPaymentVerified: paymentFlow.isManualPaymentVerified,
    checkoutRequestId: paymentFlow.checkoutRequestId,
    paymentStatus: paymentFlow.paymentStatus,

    // Actions
    initiateDonation,
    checkPaymentStatus: paymentFlow.checkPaymentStatus,
    verifyManualPayment: paymentFlow.verifyManualPayment,
    resetDonation,
  };
}

// Re-export PaymentStatus for convenience
export { PaymentStatus } from '@/shared/types/payment';
