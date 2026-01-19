import type { ReactElement, ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as memberQueries from '../../src/features/membership/hooks/queries/useMemberQueries';
import { useMemberData } from '../../src/features/membership/hooks/useMemberData';

vi.mock('../../src/features/membership/hooks/queries/useMemberQueries', () => ({
  useMemberProfileQuery: vi.fn(),
  useUpdateMemberProfileMutation: vi.fn(),
  useMemberPaymentsQuery: vi.fn(),
  useMemberMeetingsQuery: vi.fn(),
  useAvailableMeetingsQuery: vi.fn(),
  useMemberDocumentsQuery: vi.fn(),
  useMemberActivityQuery: vi.fn(),
  useRsvpMutation: vi.fn(),
  useCancelRsvpMutation: vi.fn(),
}));

describe('useMemberData', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: ReactNode }) => ReactElement;

  const mockProfile = {
    id: '1',
    memberNumber: 'M001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+254712345678',
    status: 'ACTIVE' as const,
    membershipExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    joinedAt: '2023-01-01',
    createdAt: '2023-01-01',
  };

  const mockPayments = [
    {
      id: '1',
      amount: 1000,
      type: 'REGISTRATION' as const,
      status: 'COMPLETED' as const,
      method: 'STK_PUSH' as const,
      mpesaReceiptNumber: 'ABC123',
      createdAt: '2023-01-01',
    },
    {
      id: '2',
      amount: 500,
      type: 'RENEWAL' as const,
      status: 'PENDING' as const,
      method: 'MANUAL' as const,
      createdAt: '2023-02-01',
    },
    {
      id: '3',
      amount: 2000,
      type: 'DONATION' as const,
      status: 'COMPLETED' as const,
      method: 'STK_PUSH' as const,
      mpesaReceiptNumber: 'DEF456',
      createdAt: '2023-03-01',
    },
  ];

  const mockMeetings = [
    {
      id: '1',
      title: 'AGM 2024',
      date: '2024-03-01',
      time: '10:00',
      location: 'Main Hall',
      type: 'AGM' as const,
      status: 'UPCOMING' as const,
      isRsvpd: true,
      attendeesCount: 50,
      capacity: 100,
    },
    {
      id: '2',
      title: 'Training Workshop',
      date: '2024-04-01',
      time: '14:00',
      location: 'Room 2',
      type: 'TRAINING' as const,
      status: 'UPCOMING' as const,
      isRsvpd: false,
      attendeesCount: 20,
      capacity: 30,
    },
    {
      id: '3',
      title: 'Past Meeting',
      date: '2023-12-01',
      time: '10:00',
      location: 'Main Hall',
      type: 'SPECIAL' as const,
      status: 'COMPLETED' as const,
      isRsvpd: true,
      attendeesCount: 75,
      capacity: 100,
    },
  ];

  const mockDocuments = [
    {
      id: '1',
      name: 'Membership Certificate',
      type: 'PDF',
      url: 'https://example.com/cert.pdf',
      createdAt: '2023-01-15',
    },
  ];

  const mockActivity = [
    {
      id: '1',
      type: 'REGISTRATION',
      description: 'Member registered',
      createdAt: '2023-01-01',
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('Data Aggregation', () => {
    test('should aggregate all member data successfully', async () => {
      (memberQueries.useMemberProfileQuery as any).mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as any).mockReturnValue({
        data: mockPayments,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as any).mockReturnValue({
        data: mockMeetings,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useAvailableMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberDocumentsQuery as any).mockReturnValue({
        data: mockDocuments,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberActivityQuery as any).mockReturnValue({
        data: mockActivity,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useUpdateMemberProfileMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      (memberQueries.useRsvpMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      (memberQueries.useCancelRsvpMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.profile).toEqual(mockProfile);
      expect(result.current.payments).toEqual(mockPayments);
      expect(result.current.meetings).toEqual(mockMeetings);
      expect(result.current.documents).toEqual(mockDocuments);
      expect(result.current.activity).toEqual(mockActivity);
    });

    test('should handle loading state', () => {
      (memberQueries.useMemberProfileQuery as any).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useAvailableMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberDocumentsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberActivityQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useUpdateMemberProfileMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      (memberQueries.useRsvpMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      (memberQueries.useCancelRsvpMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });

    test('should handle error state', () => {
      (memberQueries.useMemberProfileQuery as any).mockReturnValue({
        data: null,
        isLoading: false,
        error: { message: 'Failed to load profile' },
        refetch: vi.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useAvailableMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberDocumentsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberActivityQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useUpdateMemberProfileMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      (memberQueries.useRsvpMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      (memberQueries.useCancelRsvpMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      expect(result.current.error).toBe('Failed to load profile');
    });
  });

  describe('Computed Values', () => {
    beforeEach(() => {
      (memberQueries.useAvailableMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberDocumentsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberActivityQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useUpdateMemberProfileMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      (memberQueries.useRsvpMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      (memberQueries.useCancelRsvpMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });
    });

    test('should calculate total payments correctly', async () => {
      (memberQueries.useMemberProfileQuery as any).mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as any).mockReturnValue({
        data: mockPayments,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should sum only COMPLETED payments: 1000 + 2000 = 3000
      expect(result.current.totalPayments).toBe(3000);
    });

    test('should count pending payments correctly', async () => {
      (memberQueries.useMemberProfileQuery as any).mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as any).mockReturnValue({
        data: mockPayments,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should count only PENDING payments: 1
      expect(result.current.pendingPayments).toBe(1);
    });

    test('should count upcoming meetings correctly', async () => {
      (memberQueries.useMemberProfileQuery as any).mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as any).mockReturnValue({
        data: mockMeetings,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should count only UPCOMING meetings: 2
      expect(result.current.upcomingMeetings).toBe(2);
    });

    test('should calculate days until expiry correctly', async () => {
      const expiryDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days from now

      (memberQueries.useMemberProfileQuery as any).mockReturnValue({
        data: { ...mockProfile, membershipExpiresAt: expiryDate.toISOString() },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.daysUntilExpiry).toBeGreaterThanOrEqual(14);
      expect(result.current.daysUntilExpiry).toBeLessThanOrEqual(16);
    });

    test('should detect expired membership', async () => {
      const expiredDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago

      (memberQueries.useMemberProfileQuery as any).mockReturnValue({
        data: { ...mockProfile, membershipExpiresAt: expiredDate.toISOString() },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isExpired).toBe(true);
      expect(result.current.isExpiringSoon).toBe(false);
    });

    test('should detect membership expiring soon', async () => {
      const expiringSoonDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days from now

      (memberQueries.useMemberProfileQuery as any).mockReturnValue({
        data: { ...mockProfile, membershipExpiresAt: expiringSoonDate.toISOString() },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isExpired).toBe(false);
      expect(result.current.isExpiringSoon).toBe(true);
    });
  });

  describe('Refetch Functions', () => {
    test('should provide refetch functions for all queries', async () => {
      const mockRefetchProfile = vi.fn();
      const mockRefetchPayments = vi.fn();
      const mockRefetchMeetings = vi.fn();
      const mockRefetchAvailable = vi.fn();
      const mockRefetchDocuments = vi.fn();
      const mockRefetchActivity = vi.fn();

      (memberQueries.useMemberProfileQuery as any).mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
        refetch: mockRefetchProfile,
      });

      (memberQueries.useMemberPaymentsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetchPayments,
      });

      (memberQueries.useMemberMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetchMeetings,
      });

      (memberQueries.useAvailableMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetchAvailable,
      });

      (memberQueries.useMemberDocumentsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetchDocuments,
      });

      (memberQueries.useMemberActivityQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetchActivity,
      });

      (memberQueries.useUpdateMemberProfileMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      (memberQueries.useRsvpMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      (memberQueries.useCancelRsvpMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.fetchAll();

      expect(mockRefetchProfile).toHaveBeenCalled();
      expect(mockRefetchPayments).toHaveBeenCalled();
      expect(mockRefetchMeetings).toHaveBeenCalled();
      expect(mockRefetchDocuments).toHaveBeenCalled();
      expect(mockRefetchActivity).toHaveBeenCalled();
    });
  });

  describe('Mutations', () => {
    test('should provide updateProfile mutation', async () => {
      const mockUpdateProfile = vi.fn();

      (memberQueries.useMemberProfileQuery as any).mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useAvailableMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberDocumentsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberActivityQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useUpdateMemberProfileMutation as any).mockReturnValue({
        mutateAsync: mockUpdateProfile,
      });

      (memberQueries.useRsvpMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      (memberQueries.useCancelRsvpMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.updateProfile).toBe(mockUpdateProfile);
    });

    test('should provide RSVP mutations', async () => {
      const mockRsvp = vi.fn();
      const mockCancelRsvp = vi.fn();

      (memberQueries.useMemberProfileQuery as any).mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useAvailableMeetingsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberDocumentsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useMemberActivityQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      (memberQueries.useUpdateMemberProfileMutation as any).mockReturnValue({
        mutateAsync: vi.fn(),
      });

      (memberQueries.useRsvpMutation as any).mockReturnValue({
        mutateAsync: mockRsvp,
      });

      (memberQueries.useCancelRsvpMutation as any).mockReturnValue({
        mutateAsync: mockCancelRsvp,
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.rsvpToMeeting).toBe(mockRsvp);
      expect(result.current.cancelRsvp).toBe(mockCancelRsvp);
    });
  });
});
