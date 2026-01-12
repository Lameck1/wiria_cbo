/**
 * Donations API Service
 * Handles donation management for admin
 */

import { apiClient } from '@/shared/services/api/client';
import { extractArray, extractData } from '@/shared/utils/apiUtils';

export interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  transactionId?: string;
  mpesaReceiptNumber?: string;
  message?: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DonationStatistics {
  total: number;
  totalAmount: number;
  completed: number;
  pending: number;
  failed: number;
  thisMonth: number;
  thisMonthAmount: number;
}

export const getDonations = async (params?: { status?: string }): Promise<Donation[]> => {
  try {
    const queryString = params?.status ? `?status=${params.status}` : '';
    const response = await apiClient.get(`/donations${queryString}`);
    return extractArray<Donation>(response);
  } catch (error) {
    console.error('Failed to fetch donations:', error);
    return [];
  }
};

export const getDonationById = async (id: string): Promise<Donation | null> => {
  try {
    const response = await apiClient.get(`/donations/${id}`);
    return extractData<Donation>(response);
  } catch (error) {
    console.error('Failed to fetch donation:', error);
    return null;
  }
};

export const getDonationStatistics = async (): Promise<DonationStatistics> => {
  try {
    const response = await apiClient.get('/donations/statistics');
    return (
      extractData<DonationStatistics>(response) ?? {
        total: 0,
        totalAmount: 0,
        completed: 0,
        pending: 0,
        failed: 0,
        thisMonth: 0,
        thisMonthAmount: 0,
      }
    );
  } catch (error) {
    console.error('Failed to fetch donation statistics:', error);
    return {
      total: 0,
      totalAmount: 0,
      completed: 0,
      pending: 0,
      failed: 0,
      thisMonth: 0,
      thisMonthAmount: 0,
    };
  }
};
