/**
 * usePaymentFlow - Shared Payment Processing Hook
 * Eliminates code duplication across donation, registration, and renewal flows
 * 
 * This hook provides unified payment state management and status checking
 * for all M-Pesa STK Push and manual payment workflows.
 */

import { useState } from 'react';

import { useServices } from '@/shared/services/di';

import { PaymentStatus } from '../types/payment';
import { measureAsyncPerformance } from '../utils/performance';

import type {
  ManualPaymentVerificationResult,
  PaymentInitiationResult,
  PaymentMethod,
  PaymentStatusResponse,
} from '../types/payment';

interface PaymentInitiationApiResponse {
  checkoutRequestId?: string;
  transactionId?: string;
  message?: string;
  data?: {
    checkoutRequestId?: string;
    transactionId?: string;
    message?: string;
  };
}

type AnyPaymentStatusResponse =
  | PaymentStatusResponse
  | {
    data?: {
      status?: PaymentStatus;
      transactionId?: string;
      message?: string;
    };
  };

interface InitiationMeta {
  requestId?: string;
  message?: string;
}

interface InitiationSuccessContext {
  paymentMethod: PaymentMethod;
  requestId?: string;
  message?: string;
  config: UsePaymentFlowConfig;
  setCheckoutRequestId: (id: string | null) => void;
  setTransactionId: (id: string | null) => void;
  setPaymentStatus: (status: PaymentStatus | null) => void;
  notifySuccess: (message: string) => void;
}

function getInitiationMeta(
  response: PaymentInitiationApiResponse,
  messages?: UsePaymentFlowConfig['messages']
): InitiationMeta {
  const requestId =
    response.checkoutRequestId ??
    response.transactionId ??
    response.data?.checkoutRequestId ??
    response.data?.transactionId;

  const message =
    response.message ??
    response.data?.message ??
    messages?.initiationSuccess;

  return { requestId, message };
}

function handleInitiationSuccess({
  paymentMethod,
  requestId,
  message,
  config,
  setCheckoutRequestId,
  setTransactionId,
  setPaymentStatus,
  notifySuccess,
}: InitiationSuccessContext): void {
  if (paymentMethod === 'STK_PUSH' && requestId) {
    setCheckoutRequestId(requestId);
    setTransactionId(requestId);
    setPaymentStatus(PaymentStatus.PENDING);
    const successMessage =
      config.messages?.stkPushSent ??
      message ??
      'STK push sent to your phone. Please complete the payment.';
    notifySuccess(successMessage);
    return;
  }

  if (paymentMethod === 'MANUAL') {
    setPaymentStatus(PaymentStatus.PENDING);
    const manualMessage =
      config.messages?.manualPaymentSubmitted ??
      config.messages?.initiationSuccess ??
      'Payment submitted for verification.';
    notifySuccess(manualMessage);
    return;
  }

  setPaymentStatus(PaymentStatus.COMPLETED);
  notifySuccess(message ?? 'Payment initiated successfully!');
}

interface ApiClientLike {
  post<TResponse>(url: string, data: unknown): Promise<TResponse>;
  get<TResponse>(url: string): Promise<TResponse>;
}

interface NotificationServiceLike {
  success(message: string): void;
  error(message: string): void;
  warning(message: string): void;
}

interface InitiatePaymentDependencies {
  apiClient: ApiClientLike;
  config: UsePaymentFlowConfig;
  notificationService: NotificationServiceLike;
  setIsSubmitting: (value: boolean) => void;
  setPaymentStatus: (status: PaymentStatus | null) => void;
  setCheckoutRequestId: (id: string | null) => void;
  setTransactionId: (id: string | null) => void;
}

function createInitiatePayment({
  apiClient,
  config,
  notificationService,
  setIsSubmitting,
  setPaymentStatus,
  setCheckoutRequestId,
  setTransactionId,
}: InitiatePaymentDependencies) {
  return async <T extends Record<string, unknown>>(
    paymentData: T & { paymentMethod: PaymentMethod }
  ): Promise<PaymentInitiationResult> => {
    return measureAsyncPerformance('payment_initiation', async () => {
      setIsSubmitting(true);
      setPaymentStatus(null);

      try {
        const response = await apiClient.post<PaymentInitiationApiResponse>(
          config.initiationEndpoint,
          paymentData
        );

        const { requestId, message } = getInitiationMeta(response, config.messages);

        handleInitiationSuccess({
          paymentMethod: paymentData.paymentMethod,
          requestId,
          message,
          config,
          setCheckoutRequestId,
          setTransactionId,
          setPaymentStatus,
          notifySuccess: (successMessage) => notificationService.success(successMessage),
        });

        return {
          success: true,
          checkoutRequestId: requestId,
          transactionId: requestId,
          message,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Payment initiation failed';
        notificationService.error(`${errorMessage}. Please try again.`);
        return { success: false };
      } finally {
        setIsSubmitting(false);
      }
    })();
  };
}

interface CheckPaymentStatusDependencies {
  apiClient: ApiClientLike;
  config: UsePaymentFlowConfig;
  notificationService: NotificationServiceLike;
  setPaymentStatus: (status: PaymentStatus | null) => void;
}

function createCheckPaymentStatus({
  apiClient,
  config,
  notificationService,
  setPaymentStatus,
}: CheckPaymentStatusDependencies) {
  return async (id: string): Promise<PaymentStatus> => {
    try {
      const response = await apiClient.get<AnyPaymentStatusResponse>(
        `${config.statusEndpoint}/${id}`
      );

      let status: PaymentStatus | null = null;

      if ('status' in response && response.status) {
        status = response.status;
      } else if ('data' in response && response.data?.status) {
        status = response.data.status;
      }

      if (!status) {
        return PaymentStatus.PENDING;
      }
      setPaymentStatus(status);

      switch (status) {
        case PaymentStatus.COMPLETED: {
          notificationService.success(
            config.messages?.paymentCompleted ?? 'Payment completed successfully!'
          );
          return PaymentStatus.COMPLETED;
        }
        case PaymentStatus.FAILED: {
          notificationService.error('Payment failed. Please try again.');
          return PaymentStatus.FAILED;
        }
        case PaymentStatus.CANCELLED: {
          notificationService.warning('Payment was cancelled.');
          return PaymentStatus.CANCELLED;
        }
        default: {
          return PaymentStatus.PENDING;
        }
      }
    } catch {
      return PaymentStatus.PENDING;
    }
  };
}

interface VerifyManualPaymentDependencies {
  apiClient: ApiClientLike;
  config: UsePaymentFlowConfig;
  notificationService: NotificationServiceLike;
  setIsVerifying: (value: boolean) => void;
  setIsManualPaymentVerified: (value: boolean) => void;
  setPaymentStatus: (status: PaymentStatus | null) => void;
}

function createVerifyManualPayment({
  apiClient,
  config,
  notificationService,
  setIsVerifying,
  setIsManualPaymentVerified,
  setPaymentStatus,
}: VerifyManualPaymentDependencies) {
  return async (
    phone: string,
    amount: number,
    reference?: string
  ): Promise<ManualPaymentVerificationResult> => {
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
          accountReference: reference ?? config.flowType.toUpperCase(),
        }
      );

      const verified = response.verified === true || response.status === 'CONFIRMED';

      if (verified) {
        setIsManualPaymentVerified(true);
        setPaymentStatus(PaymentStatus.COMPLETED);
        notificationService.success('Payment verified successfully!');
        return { success: true, verified: true };
      } else {
        notificationService.error(
          'Payment not found yet. Please wait a moment and try again.'
        );
        return { success: false, verified: false };
      }
    } catch {
      notificationService.error('Verification failed. Please try again.');
      return { success: false };
    } finally {
      setIsVerifying(false);
    }
  };
}

interface ResetPaymentDependencies {
  setCheckoutRequestId: (id: string | null) => void;
  setTransactionId: (id: string | null) => void;
  setPaymentStatus: (status: PaymentStatus | null) => void;
  setIsSubmitting: (value: boolean) => void;
  setIsVerifying: (value: boolean) => void;
  setIsManualPaymentVerified: (value: boolean) => void;
}

function resetPaymentState({
  setCheckoutRequestId,
  setTransactionId,
  setPaymentStatus,
  setIsSubmitting,
  setIsVerifying,
  setIsManualPaymentVerified,
}: ResetPaymentDependencies): void {
  setCheckoutRequestId(null);
  setTransactionId(null);
  setPaymentStatus(null);
  setIsSubmitting(false);
  setIsVerifying(false);
  setIsManualPaymentVerified(false);
}

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
  const { apiClient, notificationService } = useServices();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isManualPaymentVerified, setIsManualPaymentVerified] = useState(false);

  const initiatePayment = createInitiatePayment({
    apiClient,
    config,
    notificationService,
    setIsSubmitting,
    setPaymentStatus,
    setCheckoutRequestId,
    setTransactionId,
  });

  const checkPaymentStatus = createCheckPaymentStatus({
    apiClient,
    config,
    notificationService,
    setPaymentStatus,
  });

  const verifyManualPayment = createVerifyManualPayment({
    apiClient,
    config,
    notificationService,
    setIsVerifying,
    setIsManualPaymentVerified,
    setPaymentStatus,
  });

  const resetPayment = () => {
    resetPaymentState({
      setCheckoutRequestId,
      setTransactionId,
      setPaymentStatus,
      setIsSubmitting,
      setIsVerifying,
      setIsManualPaymentVerified,
    });
  };

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
