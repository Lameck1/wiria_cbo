/**
 * usePaymentFlow - Shared Payment Processing Hook
 * Eliminates code duplication across donation, registration, and renewal flows
 * 
 * This hook provides unified payment state management and status checking
 * for all M-Pesa STK Push and manual payment workflows.
 */

import { useState, useCallback } from 'react';

import { apiClient } from '@/shared/services/api/client';
import { notificationService } from '@/shared/services/notification/notificationService';

import { PaymentStatus } from '../types/payment';

import type { PaymentMethod, PaymentStatusResponse, PaymentInitiationResult, ManualPaymentVerificationResult } from '../types/payment';

export interface UsePaymentFlowConfig {
  /**
   * Type of payment flow (for customized messaging)
   */
  flowType: 'donation' | 'registration' | 'renewal';
  
  /**
   * API endpoint for initiating payment
   */
  initiationEndpoint: string;
  
  /**
   * API endpoint for checking payment status
   * Should accept an ID parameter: `${endpoint}/${id}`
   */
  statusEndpoint: string;
  
  /**
   * Optional endpoint for manual payment verification
   */
  manualVerificationEndpoint?: string;
  
  /**
   * Custom success messages (optional)
   */
  messages?: {
    initiationSuccess?: string;
    paymentCompleted?: string;
    stkPushSent?: string;
    manualPaymentSubmitted?: string;
  };
}

export interface PaymentFlowState {
  isSubmitting: boolean;
  isVerifying: boolean;
  paymentStatus: PaymentStatus | null;
  checkoutRequestId: string | null;
  transactionId: string | null;
  isManualPaymentVerified: boolean;
}

export function usePaymentFlow(config: UsePaymentFlowConfig) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isManualPaymentVerified, setIsManualPaymentVerified] = useState(false);

  /**
   * Initiate a payment (STK Push or Manual)
   */
  const initiatePayment = useCallback(
    async <T extends Record<string, unknown>>(
      paymentData: T & { paymentMethod: PaymentMethod }
    ): Promise<PaymentInitiationResult> => {
      setIsSubmitting(true);
      setPaymentStatus(null);

      try {
        const response = await apiClient.post<{
          checkoutRequestId?: string;
          transactionId?: string;
          message?: string;
        }>(config.initiationEndpoint, paymentData);

        const requestId = response.checkoutRequestId || response.transactionId;

        if (paymentData.paymentMethod === 'STK_PUSH' && requestId) {
          setCheckoutRequestId(requestId);
          setTransactionId(requestId);
          setPaymentStatus(PaymentStatus.PENDING);
          notificationService.info(
            config.messages?.stkPushSent || 'STK push sent to your phone. Please complete the payment.'
          );
        } else if (paymentData.paymentMethod === 'MANUAL') {
          setPaymentStatus(PaymentStatus.PENDING);
          notificationService.success(
            config.messages?.manualPaymentSubmitted || 
            config.messages?.initiationSuccess || 
            'Payment submitted for verification.'
          );
        } else {
          setPaymentStatus(PaymentStatus.COMPLETED);
          notificationService.success(
            response.message || config.messages?.initiationSuccess || 'Payment initiated successfully!'
          );
        }

        return {
          success: true,
          checkoutRequestId: requestId,
          transactionId: requestId,
          message: response.message,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Payment initiation failed';
        notificationService.error(`${errorMessage}. Please try again.`);
        return { success: false };
      } finally {
        setIsSubmitting(false);
      }
    },
    [config]
  );

  /**
   * Check payment status by transaction ID
   */
  const checkPaymentStatus = useCallback(
    async (id: string): Promise<PaymentStatus> => {
      try {
        const response = await apiClient.get<PaymentStatusResponse>(
          `${config.statusEndpoint}/${id}`
        );

        const status = response.data?.status || response.status;
        setPaymentStatus(status);

        if (status === PaymentStatus.COMPLETED) {
          notificationService.success(
            config.messages?.paymentCompleted || 'Payment completed successfully!'
          );
          return PaymentStatus.COMPLETED;
        } else if (status === PaymentStatus.FAILED) {
          notificationService.error('Payment failed. Please try again.');
          return PaymentStatus.FAILED;
        } else if (status === PaymentStatus.CANCELLED) {
          notificationService.warn('Payment was cancelled.');
          return PaymentStatus.CANCELLED;
        }

        return PaymentStatus.PENDING;
      } catch {
        return PaymentStatus.PENDING;
      }
    },
    [config]
  );

  /**
   * Verify manual payment (M-Pesa manual transaction)
   */
  const verifyManualPayment = useCallback(
    async (phone: string, amount: number, reference?: string): Promise<ManualPaymentVerificationResult> => {
      if (!config.manualVerificationEndpoint) {
        notificationService.error('Manual payment verification not configured.');
        return { success: false };
      }

      setIsVerifying(true);
      setIsManualPaymentVerified(false);

      try {
        const response = await apiClient.post<{ verified: boolean; status?: string }>(
          config.manualVerificationEndpoint,
          {
            phone,
            amount,
            accountReference: reference || config.flowType.toUpperCase(),
          }
        );

        const verified = response.verified || response.status === 'CONFIRMED';

        if (verified) {
          setIsManualPaymentVerified(true);
          setPaymentStatus(PaymentStatus.COMPLETED);
          notificationService.success('Payment verified successfully!');
          return { success: true, verified: true };
        } else {
          notificationService.error('Payment not found yet. Please wait a moment and try again.');
          return { success: false, verified: false };
        }
      } catch {
        notificationService.error('Verification failed. Please try again.');
        return { success: false };
      } finally {
        setIsVerifying(false);
      }
    },
    [config]
  );

  /**
   * Reset all payment state
   */
  const resetPayment = useCallback(() => {
    setCheckoutRequestId(null);
    setTransactionId(null);
    setPaymentStatus(null);
    setIsSubmitting(false);
    setIsVerifying(false);
    setIsManualPaymentVerified(false);
  }, []);

  return {
    // State
    isSubmitting,
    isVerifying,
    paymentStatus,
    checkoutRequestId,
    transactionId,
    isManualPaymentVerified,
    
    // Actions
    initiatePayment,
    checkPaymentStatus,
    verifyManualPayment,
    resetPayment,
  };
}
