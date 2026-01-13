/**
 * Admin Meetings API Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const mockMeeting = {
    id: '1',
    title: 'Annual General Meeting',
    description: 'Yearly review and elections',
    meetingType: 'AGM' as const,
    date: '2024-03-15',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Main Hall',
    isVirtual: false,
    status: 'SCHEDULED' as const,
    attendanceCount: 50,
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

describe('meetings.api', () => {
    describe('getMeetings', () => {
        it('fetches all meetings', async () => {
            server.use(
                http.get('*/admin/meetings', () => {
                    return HttpResponse.json({ data: [mockMeeting] });
                })
            );

            const { getMeetings } = await import('@/features/admin/api/meetings.api');
            const result = await getMeetings();
            expect(Array.isArray(result)).toBe(true);
        });

        it('handles API errors gracefully', async () => {
            server.use(
                http.get('*/admin/meetings', () => {
                    return HttpResponse.error();
                })
            );

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            const { getMeetings } = await import('@/features/admin/api/meetings.api');
            const result = await getMeetings();
            expect(result).toEqual([]);
            consoleSpy.mockRestore();
        });
    });

    describe('getMeetingById', () => {
        it('fetches a single meeting', async () => {
            server.use(
                http.get('*/admin/meetings/1', () => {
                    return HttpResponse.json({ data: mockMeeting });
                })
            );

            const { getMeetingById } = await import('@/features/admin/api/meetings.api');
            const result = await getMeetingById('1');
            expect(result).toBeTruthy();
        });

        it('returns null for non-existent meeting', async () => {
            server.use(
                http.get('*/admin/meetings/999', () => {
                    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
                })
            );

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            const { getMeetingById } = await import('@/features/admin/api/meetings.api');
            const result = await getMeetingById('999');
            expect(result).toBeNull();
            consoleSpy.mockRestore();
        });
    });

    describe('createMeeting', () => {
        it('creates a meeting', async () => {
            server.use(
                http.post('*/admin/meetings', () => {
                    return HttpResponse.json({ data: mockMeeting });
                })
            );

            const { createMeeting } = await import('@/features/admin/api/meetings.api');
            const result = await createMeeting({
                title: 'New Meeting',
                description: 'Description',
                date: '2024-04-01',
                startTime: '14:00',
                endTime: '16:00',
                location: 'Room A',
                meetingType: 'COMMITTEE',
                isVirtual: false,
            });
            expect(result).toBeTruthy();
        });
    });

    describe('updateMeeting', () => {
        it('updates a meeting', async () => {
            server.use(
                http.put('*/admin/meetings/1', () => {
                    return HttpResponse.json({ data: { ...mockMeeting, title: 'Updated Title' } });
                })
            );

            const { updateMeeting } = await import('@/features/admin/api/meetings.api');
            const result = await updateMeeting('1', { title: 'Updated Title' });
            expect(result).toBeTruthy();
        });
    });

    describe('cancelMeeting', () => {
        it('cancels a meeting', async () => {
            server.use(
                http.patch('*/admin/meetings/1', () => {
                    return HttpResponse.json({ data: { ...mockMeeting, status: 'CANCELLED' } });
                })
            );

            const { cancelMeeting } = await import('@/features/admin/api/meetings.api');
            const result = await cancelMeeting('1');
            expect(result).toBe(true);
        });
    });

    describe('getMeetingAttendance', () => {
        it('fetches meeting attendance', async () => {
            server.use(
                http.get('*/admin/meetings/1/attendance', () => {
                    return HttpResponse.json({
                        attendance: [
                            { id: '1', meetingId: '1', memberId: '1', checkedInAt: '2024-03-15T10:05:00Z' },
                        ],
                    });
                })
            );

            const { getMeetingAttendance } = await import('@/features/admin/api/meetings.api');
            const result = await getMeetingAttendance('1');
            expect(Array.isArray(result)).toBe(true);
        });
    });
});
