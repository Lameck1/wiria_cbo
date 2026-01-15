/**
 * Admin Contacts API Tests
 */
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockContact = {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+254712345678',
    subject: 'Partnership Inquiry',
    message: 'I would like to discuss a partnership opportunity.',
    status: 'NEW' as const,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
};

const server = setupServer();

beforeEach(() => {
    server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
    server.close();
});

describe('contacts.api', () => {
    describe('getContacts', () => {
        it('fetches all contacts', async () => {
            server.use(
                http.get('*/contact', () => {
                    return HttpResponse.json({ data: [mockContact] });
                })
            );

            const { getContacts } = await import('@/features/admin/api/contacts.api');
            const result = await getContacts();
            expect(Array.isArray(result)).toBe(true);
        });

        it('handles API errors gracefully', async () => {
            server.use(
                http.get('*/contact', () => {
                    return HttpResponse.error();
                })
            );

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
            const { getContacts } = await import('@/features/admin/api/contacts.api');
            
            // Now expects error to be thrown instead of returning empty array
            await expect(getContacts()).rejects.toThrow('Failed to load contacts');
            consoleSpy.mockRestore();
        });
    });

    describe('getContactById', () => {
        it('fetches a single contact', async () => {
            server.use(
                http.get('*/contact/1', () => {
                    return HttpResponse.json({ data: mockContact });
                })
            );

            const { getContactById } = await import('@/features/admin/api/contacts.api');
            const result = await getContactById('1');
            expect(result).toBeTruthy();
        });

        it('returns null for non-existent contact', async () => {
            server.use(
                http.get('*/contact/999', () => {
                    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
                })
            );

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
            const { getContactById } = await import('@/features/admin/api/contacts.api');
            const result = await getContactById('999');
            expect(result).toBeNull();
            consoleSpy.mockRestore();
        });
    });

    describe('respondToContact', () => {
        it('sends reply to contact', async () => {
            server.use(
                http.post('*/contact/1/respond', () => {
                    return HttpResponse.json({ success: true });
                })
            );

            const { respondToContact } = await import('@/features/admin/api/contacts.api');
            const result = await respondToContact('1', 'Thank you for your inquiry.');
            expect(result).toBe(true);
        });
    });

    describe('archiveContact', () => {
        it('archives a contact', async () => {
            server.use(
                http.delete('*/contact/1', () => {
                    return HttpResponse.json({ success: true });
                })
            );

            const { archiveContact } = await import('@/features/admin/api/contacts.api');
            const result = await archiveContact('1');
            expect(result).toBe(true);
        });
    });

    describe('getContactStatistics', () => {
        it('fetches contact statistics', async () => {
            server.use(
                http.get('*/contact/statistics', () => {
                    return HttpResponse.json({
                        data: { total: 100, pending: 20, responded: 70, archived: 10, unread: 15 },
                    });
                })
            );

            const { getContactStatistics } = await import('@/features/admin/api/contacts.api');
            const result = await getContactStatistics();
            expect(result.total).toBe(100);
        });
    });
});
