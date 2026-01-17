/**
 * Member Data Hook
 * Aggregates granular TanStack Query hooks for better caching and reactivity.
 */

import { useMemo } from 'react';

import {
  useMemberProfileQuery,
  useUpdateMemberProfileMutation,
  useMemberPaymentsQuery,
  useMemberMeetingsQuery,
  useAvailableMeetingsQuery,
  useMemberDocumentsQuery,
  useMemberActivityQuery,
  useRsvpMutation,
  useCancelRsvpMutation,
} from './queries/useMemberQueries';

// Types
export interface MemberProfile {
  id: string;
  memberNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId?: string;
  occupation?: string;
  address?: string;
  county?: string;
  subcounty?: string;
  ward?: string;
  interests?: string[];
  skills?: string[];
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  membershipType?: 'INDIVIDUAL' | 'GROUP';
  groupName?: string;
  currentMemberCount?: number;
  maxMemberCountReached?: number;
  membershipExpiresAt?: string;
  joinedAt: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  type: 'REGISTRATION' | 'RENEWAL' | 'DONATION';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  method: 'STK_PUSH' | 'MANUAL';
  mpesaReceiptNumber?: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  type: 'AGM' | 'SPECIAL' | 'COMMITTEE' | 'TRAINING';
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  isRsvpd?: boolean;
  attendeesCount?: number;
  capacity?: number | null;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  timestamp?: string;
}

function useMemberComputedValues(
  profileQuery: ReturnType<typeof useMemberProfileQuery>,
  paymentsQuery: ReturnType<typeof useMemberPaymentsQuery>,
  meetingsQuery: ReturnType<typeof useMemberMeetingsQuery>
) {
  const totalPayments = useMemo(
    () =>
      (paymentsQuery.data ?? [])
        .filter((payment: Payment) => payment.status === 'COMPLETED')
        .reduce((sum: number, payment: Payment) => sum + payment.amount, 0),
    [paymentsQuery.data]
  );

  const pendingPayments = useMemo(
    () =>
      (paymentsQuery.data ?? []).filter((payment: Payment) => payment.status === 'PENDING').length,
    [paymentsQuery.data]
  );

  const upcomingMeetings = useMemo(
    () =>
      (meetingsQuery.data ?? []).filter((meeting: Meeting) => meeting.status === 'UPCOMING').length,
    [meetingsQuery.data]
  );

  const daysUntilExpiry = useMemo(() => {
    const expiry = profileQuery.data?.membershipExpiresAt;
    if (!expiry) return null;
    return Math.ceil((new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }, [profileQuery.data?.membershipExpiresAt]);

  const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0;
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 30;

  return {
    totalPayments,
    pendingPayments,
    upcomingMeetings,
    daysUntilExpiry,
    isExpired,
    isExpiringSoon,
  };
}

/**
 * useMemberData Hook (Refactored)
 * Recommended: Use the granular hooks directly in components for better performance.
 */
export function useMemberData() {
  const profileQuery = useMemberProfileQuery();
  const updateProfileMutation = useUpdateMemberProfileMutation();
  const paymentsQuery = useMemberPaymentsQuery();
  const meetingsQuery = useMemberMeetingsQuery();
  const availableMeetingsQuery = useAvailableMeetingsQuery();
  const documentsQuery = useMemberDocumentsQuery();
  const activityQuery = useMemberActivityQuery();
  const rsvpMutation = useRsvpMutation();
  const cancelRsvpMutation = useCancelRsvpMutation();

  const {
    totalPayments,
    pendingPayments,
    upcomingMeetings,
    daysUntilExpiry,
    isExpired,
    isExpiringSoon,
  } = useMemberComputedValues(profileQuery, paymentsQuery, meetingsQuery);

  const isLoading =
    profileQuery.isLoading ||
    paymentsQuery.isLoading ||
    meetingsQuery.isLoading ||
    documentsQuery.isLoading ||
    activityQuery.isLoading;

  const error = profileQuery.error?.message ?? paymentsQuery.error?.message ?? null;

  return {
    profile: profileQuery.data ?? null,
    payments: paymentsQuery.data ?? [],
    meetings: meetingsQuery.data ?? [],
    availableMeetings: availableMeetingsQuery.data ?? [],
    documents: documentsQuery.data ?? [],
    activity: activityQuery.data ?? [],
    isLoading,
    error,
    fetchProfile: profileQuery.refetch,
    updateProfile: updateProfileMutation.mutateAsync,
    fetchPayments: paymentsQuery.refetch,
    fetchMeetings: meetingsQuery.refetch,
    fetchAvailableMeetings: availableMeetingsQuery.refetch,
    rsvpToMeeting: rsvpMutation.mutateAsync,
    cancelRsvp: cancelRsvpMutation.mutateAsync,
    fetchDocuments: documentsQuery.refetch,
    fetchActivity: activityQuery.refetch,
    fetchAll: async () => {
      await Promise.all([
        profileQuery.refetch(),
        paymentsQuery.refetch(),
        meetingsQuery.refetch(),
        documentsQuery.refetch(),
        activityQuery.refetch(),
      ]);
    },
    totalPayments,
    pendingPayments,
    upcomingMeetings,
    daysUntilExpiry,
    isExpired,
    isExpiringSoon,
  };
}
