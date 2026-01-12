/**
 * Donation Types
 */

export interface DonationFormData {
  amount: number;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  purpose?: string;
  isAnonymous: boolean;
  paymentMethod: 'STK_PUSH' | 'MANUAL';
}

export interface DonationResponse {
  data: {
    donation: {
      id: string;
      amount: number;
      status: string;
      transactionId?: string;
    };
    checkoutRequestId?: string;
    message: string;
  };
}

export interface PaymentStatusResponse {
  data: {
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    transactionId?: string;
    message?: string;
  };
}
