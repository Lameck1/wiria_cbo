/**
 * useRegistration Hook
 * Refactored to use shared usePaymentFlow hook
 */

import { useState, useCallback } from 'react';

import { apiClient } from '@/shared/services/api/client';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { usePaymentFlow } from '@/shared/hooks/usePaymentFlow';
import { PaymentStatus } from '@/shared/types/payment';

import type { RegistrationFormData, RegistrationResponse } from '../types';

export function useRegistration() {
  const [memberId, setMemberId] = useState<string | null>(null);
  const [membershipNumber, setMembershipNumber] = useState<string | null>(null);

  const paymentFlow = usePaymentFlow({
    flowType: 'registration',
    initiationEndpoint: API_ENDPOINTS.MEMBERS_REGISTER,
    statusEndpoint: API_ENDPOINTS.PAYMENTS_STATUS,
    messages: {
      initiationSuccess: 'Registration successful!',
      paymentCompleted: 'Payment completed! Your membership is now active.',
      stkPushSent: 'STK push sent to your phone. Please complete the payment.',
    },
  });

  const submitRegistration = useCallback(
    async (data: RegistrationFormData) => {
      try {
        // Call API to register member
        const response = await apiClient.post<RegistrationResponse>(
          API_ENDPOINTS.MEMBERS_REGISTER,
          data
        );

        const { member, checkoutRequestId, message } = response.data;
        
        setMemberId(member.id);
        setMembershipNumber(member.membershipNumber);

        // Use shared payment flow for payment processing
        const result = await paymentFlow.initiatePayment({
          ...data,
          memberId: member.id,
        });

        return {
          success: result.success,
          memberId: member.id,
          membershipNumber: member.membershipNumber,
          checkoutRequestId: checkoutRequestId || result.checkoutRequestId,
          message,
        };
      } catch (error) {
        return { success: false };
      }
    },
    [paymentFlow]
  );

  const resetRegistration = useCallback(() => {
    setMemberId(null);
    setMembershipNumber(null);
    paymentFlow.resetPayment();
  }, [paymentFlow]);

  return {
    // Registration-specific state
    memberId,
    membershipNumber,
    
    // Payment flow state and actions (delegated to shared hook)
    isSubmitting: paymentFlow.isSubmitting,
    checkoutRequestId: paymentFlow.checkoutRequestId,
    paymentStatus: paymentFlow.paymentStatus,
    
    // Actions
    submitRegistration,
    checkPaymentStatus: paymentFlow.checkPaymentStatus,
    resetRegistration,
  };
}

// Re-export PaymentStatus for convenience
export { PaymentStatus };
