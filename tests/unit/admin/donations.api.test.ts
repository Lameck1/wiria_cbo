/**
 * Admin Donations API Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { getDonations, getDonationById, getDonationStatistics } from '@/features/admin/api/donations.api';

const mockDonation = {
    id: '1',
    donorName: 'John Doe',
    donorEmail: 'john@example.com',
    donorPhone: '+254712345678',
    amount: 1000,
    currency: 'KES',
    paymentMethod: 'MPESA',
    status: 'COMPLETED' as const,
    transactionId: 'TRX123',
    mpesaReceiptNumber: 'ABC123',
    message: 'For education',
    isAnonymous: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
};

const mockStatistics = {
    total: 100,
    totalAmount: 50000,
    completed: 80,
    pending: 15,
    failed: 5,
    thisMonth: 20,
    thisMonthAmount: 10000,
};

const server = setupServer();

beforeEach(() => {
    server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
});

afterEach(() => {
    server.close();
});

describe('donations.api', () => {
    describe('getDonations', () => {
        it('fetches all donations', async () => {
            server.use(
                http.get('*/donations', () => {
                    return HttpResponse.json({ data: [mockDonation] });
                })
            );

            const result = await getDonations();
            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                id: '1',
                donorName: 'John Doe',
                amount: 1000,
            });
        });

        it('fetches donations with status filter', async () => {
            server.use(
                http.get('*/donations', ({ request }) => {
                    const url = new URL(request.url);
                    if (url.searchParams.get('status') === 'COMPLETED') {
                        return HttpResponse.json({ data: [mockDonation] });
                    }
                    return HttpResponse.json({ data: [] });
                })
            );

            const result = await getDonations({ status: 'COMPLETED' });
            expect(result).toHaveLength(1);
        });

        it('returns empty array on error', async () => {
            server.use(
                http.get('*/donations', () => {
                    return HttpResponse.error();
                })
            );

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            const result = await getDonations();
            expect(result).toEqual([]);
            consoleSpy.mockRestore();
        });
    });

    describe('getDonationById', () => {
        it('fetches a single donation', async () => {
            server.use(
                http.get('*/donations/1', () => {
                    return HttpResponse.json({ data: mockDonation });
                })
            );

            const result = await getDonationById('1');
            expect(result).toMatchObject({
                id: '1',
                donorName: 'John Doe',
            });
        });

        it('returns null on error', async () => {
            server.use(
                http.get('*/donations/999', () => {
                    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
                })
            );

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            const result = await getDonationById('999');
            expect(result).toBeNull();
            consoleSpy.mockRestore();
        });
    });

    describe('getDonationStatistics', () => {
        it('fetches donation statistics', async () => {
            server.use(
                http.get('*/donations/statistics', () => {
                    return HttpResponse.json({ data: mockStatistics });
                })
            );

            const result = await getDonationStatistics();
            expect(result).toMatchObject({
                total: 100,
                totalAmount: 50000,
                completed: 80,
            });
        });

        it('returns default stats on error', async () => {
            server.use(
                http.get('*/donations/statistics', () => {
                    return HttpResponse.error();
                })
            );

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            const result = await getDonationStatistics();
            expect(result).toMatchObject({
                total: 0,
                totalAmount: 0,
                completed: 0,
            });
            consoleSpy.mockRestore();
        });
    });
});
