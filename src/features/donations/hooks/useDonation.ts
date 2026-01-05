/**
 * useDonation Hook
 * Handles donation submission and payment processing
 */

import { useState } from 'react';
import { apiClient } from '@/shared/services/api/client';
import { notificationService } from '@/shared/services/notification/notificationService';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { DonationFormData, DonationResponse, PaymentStatusResponse } from '../types';

export function useDonation() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
    const [donationId, setDonationId] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<
        'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | null
    >(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isManualPaymentVerified, setIsManualPaymentVerified] = useState(false);

    const initiateDonation = async (data: DonationFormData) => {
        setIsSubmitting(true);
        setPaymentStatus(null);

        try {
            const response = await apiClient.post<DonationResponse>(
                API_ENDPOINTS.DONATIONS_INITIATE,
                data
            );

            const { donation, checkoutRequestId: reqId, message } = response.data;

            setDonationId(donation.id);

            if (data.paymentMethod === 'STK_PUSH' && reqId) {
                setCheckoutRequestId(reqId);
                setPaymentStatus('PENDING');
                notificationService.info('STK push sent to your phone. Please complete the payment.');
            } else {
                notificationService.success(message || 'Donation initiated successfully!');
            }

            return { success: true, donationId: donation.id, checkoutRequestId: reqId };
        } catch (_error) {
            notificationService.error('Failed to initiate donation. Please try again.');
            return { success: false };
        } finally {
            setIsSubmitting(false);
        }
    };

    const checkPaymentStatus = async (donationIdToCheck: string) => {
        try {
            const response = await apiClient.get<PaymentStatusResponse>(
                `${API_ENDPOINTS.DONATIONS_STATUS}/${donationIdToCheck}`
            );

            const { status } = response.data;
            setPaymentStatus(status);

            if (status === 'COMPLETED') {
                notificationService.success('Payment completed successfully! Thank you for your donation.');
                return 'COMPLETED';
            } else if (status === 'FAILED') {
                notificationService.error('Payment failed. Please try again.');
                return 'FAILED';
            }

            return status;
        } catch (_error) {
            return 'PENDING';
        }
    };

    const verifyManualPayment = async (phone: string, amount: number) => {
        setIsVerifying(true);
        setIsManualPaymentVerified(false);

        try {
            const response = await apiClient.post<{ verified: boolean; status?: string }>(
                '/api/donations/verify-manual',
                {
                    phone,
                    amount,
                    accountReference: 'DONATION',
                }
            );

            if (response.verified || response.status === 'CONFIRMED') {
                setIsManualPaymentVerified(true);
                notificationService.success('Payment verified successfully!');
                return { success: true };
            } else {
                notificationService.error('Payment not found yet. Please wait a moment and try again.');
                return { success: false };
            }
        } catch (_error) {
            notificationService.error('Verification failed. Please try again.');
            return { success: false };
        } finally {
            setIsVerifying(false);
        }
    };

    const resetDonation = () => {
        setCheckoutRequestId(null);
        setDonationId(null);
        setPaymentStatus(null);
        setIsSubmitting(false);
        setIsVerifying(false);
        setIsManualPaymentVerified(false);
    };

    return {
        initiateDonation,
        checkPaymentStatus,
        verifyManualPayment,
        resetDonation,
        isSubmitting,
        isVerifying,
        isManualPaymentVerified,
        checkoutRequestId,
        donationId,
        paymentStatus,
    };
}

