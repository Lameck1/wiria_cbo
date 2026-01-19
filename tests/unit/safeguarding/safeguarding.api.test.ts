import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { SafeguardingReportData } from '@/features/safeguarding/hooks/useSafeguardingReport';
import { ApiError } from '@/shared/services/api/client';

const server = setupServer();

const createReportData = (overrides: Partial<SafeguardingReportData> = {}): SafeguardingReportData => ({
    isAnonymous: false,
    reporterName: 'Test Reporter',
    reporterEmail: 'reporter@example.com',
    reporterPhone: '+254712345678',
    reporterRelation: 'Witness',
    category: 'ABUSE',
    incidentDate: '2024-01-01',
    location: 'Community Center',
    personsInvolved: 'Test Person',
    description: 'Test description',
    ...overrides,
});

beforeEach(() => {
    server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
    server.resetHandlers();
    server.close();
});

describe('safeguardingApi', () => {
    describe('submit', () => {
        it('submits safeguarding report and returns reference number', async () => {
            server.use(
                http.post('*/safeguarding', () => {
                    return HttpResponse.json({ data: { referenceNumber: 'SAFE-123' } });
                })
            );

            const { safeguardingApi } = await import('@/features/safeguarding/api/safeguardingApi');
            const result = await safeguardingApi.submit(createReportData());

            expect(result.data.referenceNumber).toBe('SAFE-123');
        });

        it('throws error when API returns non-ok response', async () => {
            server.use(
                http.post('*/safeguarding', () => {
                    return HttpResponse.json({ message: 'Server error' }, { status: 500 });
                })
            );

            const { safeguardingApi } = await import('@/features/safeguarding/api/safeguardingApi');

            await expect(safeguardingApi.submit(createReportData())).rejects.toThrow(
                'Failed to submit report'
            );
        });
    });

    describe('lookup', () => {
        it('posts reference and email and returns lookup result', async () => {
            server.use(
                http.post('*/safeguarding/lookup', async ({ request }) => {
                    const body = (await request.json()) as { referenceNumber: string; email?: string };

                    expect(body.referenceNumber).toBe('SAFE-999');
                    expect(body.email).toBe('user@example.com');

                    return HttpResponse.json({
                        data: {
                            referenceNumber: 'SAFE-999',
                            status: 'IN_REVIEW',
                            category: 'ABUSE',
                            createdAt: '2024-01-01T00:00:00Z',
                            updatedAt: '2024-01-02T00:00:00Z',
                        },
                    });
                })
            );

            const { safeguardingApi } = await import('@/features/safeguarding/api/safeguardingApi');
            const response = await safeguardingApi.lookup('SAFE-999', 'user@example.com');

            expect(response.data.referenceNumber).toBe('SAFE-999');
            expect(response.data.status).toBe('IN_REVIEW');
        });

        it('throws ApiError when lookup fails', async () => {
            server.use(
                http.post('*/safeguarding/lookup', () => {
                    return HttpResponse.json({ message: 'Not found' }, { status: 404 });
                })
            );

            const { safeguardingApi } = await import('@/features/safeguarding/api/safeguardingApi');

            await expect(safeguardingApi.lookup('SAFE-000')).rejects.toBeInstanceOf(ApiError);
        });
    });
});
