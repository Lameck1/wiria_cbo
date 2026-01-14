/**
 * useRenewal Hook
 */

import { useReducer } from 'react';
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

type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | null;

interface RenewalState {
  isSubmitting: boolean;
  paymentStatus: PaymentStatus;
  transactionId: string | null;
}

type RenewalAction =
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_END' }
  | { type: 'RESET_STATE' }
  | { type: 'SET_PENDING_STK'; transactionId: string }
  | { type: 'SET_PENDING_MANUAL' }
  | { type: 'SET_SUCCESS' }
  | { type: 'SET_FAILED' };

const initialState: RenewalState = {
  isSubmitting: false,
  paymentStatus: null,
  transactionId: null,
};

function renewalReducer(state: RenewalState, action: RenewalAction): RenewalState {
  switch (action.type) {
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true };
    case 'SUBMIT_END':
      return { ...state, isSubmitting: false };
    case 'RESET_STATE':
      return { ...state, paymentStatus: null, transactionId: null };
    case 'SET_PENDING_STK':
      return { ...state, paymentStatus: 'PENDING', transactionId: action.transactionId };
    case 'SET_PENDING_MANUAL':
      return { ...state, paymentStatus: 'PENDING' };
    case 'SET_SUCCESS':
      return { ...state, paymentStatus: 'SUCCESS' };
    case 'SET_FAILED':
      return { ...state, paymentStatus: 'FAILED' };
    default:
      return state;
  }
}

export function useRenewal() {
  const [state, dispatch] = useReducer(renewalReducer, initialState);

  const submitRenewal = async (data: RenewalData) => {
    dispatch({ type: 'SUBMIT_START' });
    dispatch({ type: 'RESET_STATE' });

    try {
      const response = await apiClient.post<RenewalResponse>(API_ENDPOINTS.MEMBERS_RENEW, data);

      const { checkoutRequestId, message } = response as RenewalResponse;

      if (data.paymentMethod === 'STK_PUSH' && checkoutRequestId) {
        dispatch({ type: 'SET_PENDING_STK', transactionId: checkoutRequestId });
        notificationService.info('STK push sent to your phone. Please complete the payment.');
      } else if (data.paymentMethod === 'MANUAL') {
        dispatch({ type: 'SET_PENDING_MANUAL' });
        notificationService.success('Transaction submitted for verification.');
      } else {
        dispatch({ type: 'SET_SUCCESS' });
        notificationService.success(message || 'Renewal successful!');
      }

      return { success: true };
    } catch (_error) {
      notificationService.error('Renewal failed. Please try again.');
      return { success: false };
    } finally {
      dispatch({ type: 'SUBMIT_END' });
    }
  };

  const checkPaymentStatus = async (tid: string) => {
    try {
      const response = await apiClient.get<{ data: { status: string } }>(
        `${API_ENDPOINTS.PAYMENTS_STATUS}/${tid}`
      );

      const { status } = response.data;
      if (status === 'COMPLETED') {
        dispatch({ type: 'SET_SUCCESS' });
        return 'SUCCESS';
      } else if (status === 'FAILED') {
        dispatch({ type: 'SET_FAILED' });
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
    isSubmitting: state.isSubmitting,
    paymentStatus: state.paymentStatus,
    transactionId: state.transactionId,
  };
}
