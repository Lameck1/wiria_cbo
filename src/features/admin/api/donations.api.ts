/**
 * Donations API Service
 * Handles donation management for admin
 */

import { apiClient } from '@/shared/services/api/client';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractArray = (response: any): Donation[] => {
    if (Array.isArray(response)) return response;
    if (response?.data && Array.isArray(response.data)) return response.data;
    if (response?.donations && Array.isArray(response.donations)) return response.donations;
    return [];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractData = (response: any) => {
    if (response?.data) return response.data;
    return response;
};

export const getDonations = async (params?: { status?: string }): Promise<Donation[]> => {
    try {
        const queryString = params?.status ? `?status=${params.status}` : '';
        const response = await apiClient.get(`/donations${queryString}`);
        return extractArray(response);
    } catch (error) {
        console.error('Failed to fetch donations:', error);
        return [];
    }
};

export const getDonationById = async (id: string): Promise<Donation | null> => {
    try {
        const response = await apiClient.get(`/donations/${id}`);
        return extractData(response);
    } catch (error) {
        console.error('Failed to fetch donation:', error);
        return null;
    }
};

export const getDonationStatistics = async (): Promise<DonationStatistics> => {
    try {
        const response = await apiClient.get('/donations/statistics');
        return extractData(response);
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
