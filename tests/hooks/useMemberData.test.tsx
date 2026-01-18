/**
 * useMemberData Hook Tests
 * Tests for member data aggregation hook that uses TanStack Query
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useMemberData } from '../../src/features/membership/hooks/useMemberData';

// Mock the granular query hooks
jest.mock('../../src/features/membership/hooks/queries/useMemberQueries', () => ({
  useMemberProfileQuery: jest.fn(),
  useUpdateMemberProfileMutation: jest.fn(),
  useMemberPaymentsQuery: jest.fn(),
  useMemberMeetingsQuery: jest.fn(),
  useAvailableMeetingsQuery: jest.fn(),
  useMemberDocumentsQuery: jest.fn(),
  useMemberActivityQuery: jest.fn(),
  useRsvpMutation: jest.fn(),
  useCancelRsvpMutation: jest.fn(),
}));

import * as memberQueries from '../../src/features/membership/hooks/queries/useMemberQueries';

describe('useMemberData', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: ReactNode }) => JSX.Element;

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

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('Data Aggregation', () => {
    test('should aggregate all member data successfully', async () => {
      // Mock all query hooks
      (memberQueries.useMemberProfileQuery as jest.Mock).mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as jest.Mock).mockReturnValue({
        data: mockPayments,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as jest.Mock).mockReturnValue({
        data: mockMeetings,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useAvailableMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberDocumentsQuery as jest.Mock).mockReturnValue({
        data: mockDocuments,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberActivityQuery as jest.Mock).mockReturnValue({
        data: mockActivity,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useUpdateMemberProfileMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
      });

      (memberQueries.useRsvpMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
      });

      (memberQueries.useCancelRsvpMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
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
      (memberQueries.useMemberProfileQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useAvailableMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberDocumentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberActivityQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useUpdateMemberProfileMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
      });

      (memberQueries.useRsvpMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
      });

      (memberQueries.useCancelRsvpMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });

    test('should handle error state', () => {
      (memberQueries.useMemberProfileQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        error: { message: 'Failed to load profile' },
        refetch: jest.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useAvailableMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberDocumentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberActivityQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useUpdateMemberProfileMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
      });

      (memberQueries.useRsvpMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
      });

      (memberQueries.useCancelRsvpMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      expect(result.current.error).toBe('Failed to load profile');
    });
  });

  describe('Computed Values', () => {
    beforeEach(() => {
      (memberQueries.useAvailableMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberDocumentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberActivityQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useUpdateMemberProfileMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
      });

      (memberQueries.useRsvpMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
      });

      (memberQueries.useCancelRsvpMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
      });
    });

    test('should calculate total payments correctly', async () => {
      (memberQueries.useMemberProfileQuery as jest.Mock).mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as jest.Mock).mockReturnValue({
        data: mockPayments,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should sum only COMPLETED payments: 1000 + 2000 = 3000
      expect(result.current.totalPayments).toBe(3000);
    });

    test('should count pending payments correctly', async () => {
      (memberQueries.useMemberProfileQuery as jest.Mock).mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as jest.Mock).mockReturnValue({
        data: mockPayments,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should count only PENDING payments: 1
      expect(result.current.pendingPayments).toBe(1);
    });

    test('should count upcoming meetings correctly', async () => {
      (memberQueries.useMemberProfileQuery as jest.Mock).mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as jest.Mock).mockReturnValue({
        data: mockMeetings,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
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
      
      (memberQueries.useMemberProfileQuery as jest.Mock).mockReturnValue({
        data: { ...mockProfile, membershipExpiresAt: expiryDate.toISOString() },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
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
      
      (memberQueries.useMemberProfileQuery as jest.Mock).mockReturnValue({
        data: { ...mockProfile, membershipExpiresAt: expiredDate.toISOString() },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
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
      
      (memberQueries.useMemberProfileQuery as jest.Mock).mockReturnValue({
        data: { ...mockProfile, membershipExpiresAt: expiringSoonDate.toISOString() },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
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
      const mockRefetchProfile = jest.fn();
      const mockRefetchPayments = jest.fn();
      const mockRefetchMeetings = jest.fn();
      const mockRefetchAvailable = jest.fn();
      const mockRefetchDocuments = jest.fn();
      const mockRefetchActivity = jest.fn();

      (memberQueries.useMemberProfileQuery as jest.Mock).mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
        refetch: mockRefetchProfile,
      });

      (memberQueries.useMemberPaymentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetchPayments,
      });

      (memberQueries.useMemberMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetchMeetings,
      });

      (memberQueries.useAvailableMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetchAvailable,
      });

      (memberQueries.useMemberDocumentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetchDocuments,
      });

      (memberQueries.useMemberActivityQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetchActivity,
      });

      (memberQueries.useUpdateMemberProfileMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
      });

      (memberQueries.useRsvpMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
      });

      (memberQueries.useCancelRsvpMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
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
      const mockUpdateProfile = jest.fn();

      (memberQueries.useMemberProfileQuery as jest.Mock).mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useAvailableMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberDocumentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberActivityQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useUpdateMemberProfileMutation as jest.Mock).mockReturnValue({
        mutateAsync: mockUpdateProfile,
      });

      (memberQueries.useRsvpMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
      });

      (memberQueries.useCancelRsvpMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
      });

      const { result } = renderHook(() => useMemberData(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.updateProfile).toBe(mockUpdateProfile);
    });

    test('should provide RSVP mutations', async () => {
      const mockRsvp = jest.fn();
      const mockCancelRsvp = jest.fn();

      (memberQueries.useMemberProfileQuery as jest.Mock).mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberPaymentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useAvailableMeetingsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberDocumentsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useMemberActivityQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      (memberQueries.useUpdateMemberProfileMutation as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
      });

      (memberQueries.useRsvpMutation as jest.Mock).mockReturnValue({
        mutateAsync: mockRsvp,
      });

      (memberQueries.useCancelRsvpMutation as jest.Mock).mockReturnValue({
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
