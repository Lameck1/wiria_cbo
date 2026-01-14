/**
 * useRegistration Hook
 */

import { useState } from 'react';

import { PaymentStatusResponse } from '@/features/donations/types';
import { apiClient } from '@/shared/services/api/client';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { notificationService } from '@/shared/services/notification/notificationService';

import { RegistrationFormData, RegistrationResponse } from '../types';

export function useRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [membershipNumber, setMembershipNumber] = useState<string | null>(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | null
  >(null);

  const submitRegistration = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    setPaymentStatus(null);

    try {
      const response = await apiClient.post<RegistrationResponse>(
        API_ENDPOINTS.MEMBERS_REGISTER,
        data
      );

      const { member, checkoutRequestId: requestId, message } = response.data;

      setMemberId(member.id);
      setMembershipNumber(member.membershipNumber);

      if (data.paymentMethod === 'STK_PUSH' && requestId) {
        setCheckoutRequestId(requestId);
        setPaymentStatus('PENDING');
        notificationService.info('STK push sent to your phone. Please complete the payment.');
      } else {
        notificationService.success(message || 'Registration successful!');
      }

      return { success: true, memberId: member.id, membershipNumber: member.membershipNumber };
    } catch {
      notificationService.error('Registration failed. Please try again.');
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkPaymentStatus = async (memberIdToCheck: string) => {
    try {
      const response = await apiClient.get<PaymentStatusResponse>(
        `${API_ENDPOINTS.PAYMENTS_STATUS}/${memberIdToCheck}`
      );

      const { status } = response.data;
      setPaymentStatus(status);

      if (status === 'COMPLETED') {
        notificationService.success('Payment completed! Your membership is now active.');
        return 'COMPLETED';
      } else if (status === 'FAILED') {
        notificationService.error('Payment failed. Please try again.');
        return 'FAILED';
      }

      return status;
    } catch {
      return 'PENDING';
    }
  };

  const resetRegistration = () => {
    setMemberId(null);
    setMembershipNumber(null);
    setCheckoutRequestId(null);
    setPaymentStatus(null);
    setIsSubmitting(false);
  };

  return {
    submitRegistration,
    checkPaymentStatus,
    resetRegistration,
    isSubmitting,
    memberId,
    membershipNumber,
    checkoutRequestId,
    paymentStatus,
  };
}
