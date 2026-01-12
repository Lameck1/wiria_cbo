/**
 * useRenewal Hook
 */

import { useState } from 'react';
import { apiClient } from '@/shared/services/api/client';
import { notificationService } from '@/shared/services/notification/notificationService';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED' | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const submitRenewal = async (data: RenewalData) => {
    setIsSubmitting(true);
    setPaymentStatus(null);
    setTransactionId(null);

    try {
      const response = await apiClient.post<RenewalResponse>(API_ENDPOINTS.MEMBERS_RENEW, data);

      const { checkoutRequestId, message } = response as RenewalResponse;

      if (data.paymentMethod === 'STK_PUSH' && checkoutRequestId) {
        setTransactionId(checkoutRequestId);
        setPaymentStatus('PENDING');
        notificationService.info('STK push sent to your phone. Please complete the payment.');
      } else if (data.paymentMethod === 'MANUAL') {
        setPaymentStatus('PENDING'); // Wait for admin verification
        notificationService.success('Transaction submitted for verification.');
      } else {
        setPaymentStatus('SUCCESS');
        notificationService.success(message || 'Renewal successful!');
      }

      return { success: true };
    } catch (_error) {
      notificationService.error('Renewal failed. Please try again.');
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkPaymentStatus = async (tid: string) => {
    try {
      const response = await apiClient.get<{ data: { status: string } }>(
        `${API_ENDPOINTS.PAYMENTS_STATUS}/${tid}`
      );

      const { status } = response.data;
      if (status === 'COMPLETED') {
        setPaymentStatus('SUCCESS');
        return 'SUCCESS';
      } else if (status === 'FAILED') {
        setPaymentStatus('FAILED');
        return 'FAILED';
      }
      return 'PENDING';
    } catch (_error) {
      return 'PENDING';
    }
  };

  return {
    submitRenewal,
    checkPaymentStatus,
    isSubmitting,
    paymentStatus,
    transactionId,
  };
}
