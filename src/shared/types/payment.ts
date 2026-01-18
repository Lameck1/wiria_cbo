/**
 * Shared Payment Types
 * Standardized payment status and interfaces across all payment flows
 */

/**
 * Standardized Payment Status Enum
 * Used consistently across donations, registrations, and renewals
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * Payment Method Types
 */
export type PaymentMethod = 'STK_PUSH' | 'MANUAL';

/**
 * Generic Payment Response from API
 */
export interface PaymentStatusResponse {
  status: PaymentStatus;
  transactionId?: string;
  message?: string;
}

/**
 * Payment Initiation Result
 */
export interface PaymentInitiationResult {
  success: boolean;
  transactionId?: string;
  checkoutRequestId?: string;
  message?: string;
}

/**
 * Manual Payment Verification Result
 */
export interface ManualPaymentVerificationResult {
  success: boolean;
  verified?: boolean;
  message?: string;
}
