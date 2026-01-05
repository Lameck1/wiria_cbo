/**
 * Member Data Hook
 * Fetches member profile, payments, meetings, documents, and activity
 */

import { useState, useCallback } from 'react';
import { apiClient } from '@/shared/services/api/client';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';

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
    timestamp?: string; // Backend may send timestamp instead of createdAt
}

// API response type that handles varying backend response structures
interface MemberApiResponse extends Partial<MemberProfile> {
    props?: Partial<MemberProfile> & {
        joinDate?: string;
        expiryDate?: string;
    };
    joinDate?: string;
    expiryDate?: string;
}

export function useMemberData() {
    const [profile, setProfile] = useState<MemberProfile | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [availableMeetings, setAvailableMeetings] = useState<Meeting[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [activity, setActivity] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        try {
            const response = await apiClient.get<{ data: MemberApiResponse }>(API_ENDPOINTS.MEMBERS_ME);

            const apiData = response.data;

            if (!apiData) {
                console.error('fetchProfile: Valid data not found in response');
                return null;
            }

            // Map backend fields to frontend interface, handling potential "props" wrapper or flat structure
            const mappedProfile: MemberProfile = {
                ...apiData as Partial<MemberProfile>,
                // Required fields with fallbacks
                id: apiData.id || '',
                memberNumber: apiData.memberNumber || '',
                firstName: apiData.firstName || apiData.props?.firstName || '',
                lastName: apiData.lastName || apiData.props?.lastName || '',
                email: apiData.email || apiData.props?.email || '',
                phone: apiData.phone || apiData.props?.phone || '',

                // Date overrides
                joinedAt: apiData.joinDate || apiData.joinedAt || apiData.props?.joinDate || '',
                membershipExpiresAt: apiData.expiryDate || apiData.membershipExpiresAt || apiData.props?.expiryDate,
                status: apiData.status || 'PENDING',
                createdAt: apiData.createdAt || '',
                // Group fields
                membershipType: apiData.membershipType || apiData.props?.membershipType,
                groupName: apiData.groupName || apiData.props?.groupName,
                currentMemberCount: apiData.currentMemberCount || apiData.props?.currentMemberCount,
                maxMemberCountReached: apiData.maxMemberCountReached || apiData.props?.maxMemberCountReached,
            };

            setProfile(mappedProfile);
            return mappedProfile;
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            throw err;
        }
    }, []);

    const updateProfile = useCallback(async (data: Partial<MemberProfile>) => {
        try {
            const response = await apiClient.put<{ data: MemberApiResponse }>(API_ENDPOINTS.MEMBERS_ME, data);
            const apiData = response.data;
            const mappedProfile: MemberProfile = {
                ...apiData as Partial<MemberProfile>,
                id: apiData.id || '',
                memberNumber: apiData.memberNumber || '',
                firstName: apiData.firstName || '',
                lastName: apiData.lastName || '',
                email: apiData.email || '',
                phone: apiData.phone || '',
                status: apiData.status || 'PENDING',
                createdAt: apiData.createdAt || '',
                joinedAt: apiData.joinDate || apiData.joinedAt || '',
                membershipExpiresAt: apiData.expiryDate || apiData.membershipExpiresAt,
            };
            setProfile(mappedProfile);
            return mappedProfile;
        } catch (err) {
            console.error('Failed to update profile:', err);
            throw err;
        }
    }, []);



    const fetchPayments = useCallback(async () => {
        try {
            // API returns { data: { payments: [], summary: {} } }
            const response = await apiClient.get<{ data: { payments: Payment[] } }>(API_ENDPOINTS.MEMBERS_PAYMENTS);
            const paymentList = response.data?.payments || [];
            setPayments(paymentList);
            return paymentList;
        } catch (err) {
            console.error('Failed to fetch payments:', err);
            // Don't throw, just set empty to avoid crash
            setPayments([]);
            return [];
        }
    }, []);

    const fetchMeetings = useCallback(async () => {
        try {
            // API returns { data: Meeting[] }
            const response = await apiClient.get<{ data: Meeting[] }>(API_ENDPOINTS.MEMBERS_MEETINGS);
            const meetingList = Array.isArray(response.data) ? response.data : [];
            setMeetings(meetingList);
            return meetingList;
        } catch (err) {
            console.error('Failed to fetch meetings:', err);
            setMeetings([]);
            return [];
        }
    }, []);

    const fetchAvailableMeetings = useCallback(async () => {
        try {
            const response = await apiClient.get<{ data: Meeting[] }>(API_ENDPOINTS.MEMBERS_MEETINGS_AVAILABLE);
            const meetingList = Array.isArray(response.data) ? response.data : [];
            setAvailableMeetings(meetingList);
            return meetingList;
        } catch (err) {
            console.error('Failed to fetch available meetings:', err);
            setAvailableMeetings([]);
            return [];
        }
    }, []);

    // ... (rsvp/cancelRsvp)

    const rsvpToMeeting = useCallback(async (meetingId: string) => {
        try {
            const endpoint = API_ENDPOINTS.MEMBERS_MEETINGS_RSVP.replace(':id', meetingId);
            await apiClient.post(endpoint, {});
            // Refresh meetings after RSVP
            await fetchMeetings();
            await fetchAvailableMeetings();
        } catch (err) {
            console.error('Failed to RSVP:', err);
            // throw err; // Optional: rethrow if UI needs to show specific error
        }
    }, [fetchMeetings, fetchAvailableMeetings]);

    const cancelRsvp = useCallback(async (meetingId: string) => {
        try {
            const endpoint = API_ENDPOINTS.MEMBERS_MEETINGS_RSVP.replace(':id', meetingId);
            await apiClient.delete(endpoint);
            await fetchMeetings();
            await fetchAvailableMeetings();
        } catch (err) {
            console.error('Failed to cancel RSVP:', err);
        }
    }, [fetchMeetings, fetchAvailableMeetings]);

    const fetchDocuments = useCallback(async () => {
        try {
            // API returns { data: { documents: [], message: string } }
            const response = await apiClient.get<{ data: { documents: Document[] } }>(API_ENDPOINTS.MEMBERS_DOCUMENTS);
            const docList = response.data?.documents || [];
            setDocuments(docList);
            return docList;
        } catch (err) {
            console.error('Failed to fetch documents:', err);
            setDocuments([]);
            return [];
        }
    }, []);

    const fetchActivity = useCallback(async () => {
        try {
            // API returns { data: Activity[] }
            const response = await apiClient.get<{ data: Activity[] }>(API_ENDPOINTS.MEMBERS_ACTIVITY);
            const activityList = Array.isArray(response.data) ? response.data : [];

            // Map backend timestamp to frontend createdAt
            const mappedActivity = activityList.map(item => ({
                ...item,
                createdAt: item.timestamp || item.createdAt
            }));

            setActivity(mappedActivity);
            return mappedActivity;
        } catch (err) {
            console.error('Failed to fetch activity:', err);
            setActivity([]);
            return [];
        }
    }, []);

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await Promise.all([
                fetchProfile(),
                fetchPayments(),
                fetchMeetings(),
                fetchDocuments(),
                fetchActivity(),
            ]);
        } catch (_err) {
            setError('Failed to load member data');
        } finally {
            setIsLoading(false);
        }
    }, [fetchProfile, fetchPayments, fetchMeetings, fetchDocuments, fetchActivity]);

    // Computed values
    const totalPayments = payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0);

    const pendingPayments = payments.filter(p => p.status === 'PENDING').length;

    const upcomingMeetings = (meetings || []).filter(m => m.status === 'UPCOMING').length;

    const daysUntilExpiry = profile?.membershipExpiresAt
        ? Math.ceil((new Date(profile.membershipExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;

    const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0;
    const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 30;

    return {
        // Data
        profile,
        payments,
        meetings,
        availableMeetings,
        documents,
        activity,

        // State
        isLoading,
        error,

        // Actions
        fetchProfile,
        updateProfile,
        fetchPayments,
        fetchMeetings,
        fetchAvailableMeetings,
        rsvpToMeeting,
        cancelRsvp,
        fetchDocuments,
        fetchActivity,
        fetchAll,

        // Computed
        totalPayments,
        pendingPayments,
        upcomingMeetings,
        daysUntilExpiry,
        isExpired,
        isExpiringSoon,
    };
}
