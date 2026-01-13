import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/services/api/client';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { memberAdapter } from '../../api/memberAdapter';
import type { MemberProfile, Document } from '../useMemberData';

/**
 * API Response Types
 * These match the structure returned by the backend.
 */
interface ApiProfileResponse {
    data: {
        id?: string;
        memberNumber?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        status?: string;
        membershipType?: string;
        props?: Record<string, unknown>;
        [key: string]: unknown;
    };
}

interface ApiPaymentsResponse {
    data: Array<{
        id?: string;
        amount?: number | string;
        type?: string;
        status?: string;
        method?: string;
        mpesaReceiptNumber?: string;
        createdAt?: string;
    }> | { payments: Array<Record<string, unknown>> };
}

interface ApiMeetingsResponse {
    data: Array<{
        id?: string;
        title?: string;
        description?: string;
        date?: string;
        time?: string;
        location?: string;
        type?: string;
        status?: string;
        isRsvpd?: boolean;
        attendeesCount?: number;
    }> | { data: Array<Record<string, unknown>> };
}

interface ApiDocumentsResponse {
    data: {
        documents?: Array<{
            id?: string;
            name?: string;
            type?: string;
            url?: string;
            createdAt?: string;
        }>;
    };
}

interface ApiActivityResponse {
    data: Array<{
        id?: string;
        type?: string;
        description?: string;
        timestamp?: string;
        createdAt?: string;
    }> | { data: Array<Record<string, unknown>> };
}

export const MEMBER_KEYS = {
    all: ['member'] as const,
    profile: () => [...MEMBER_KEYS.all, 'profile'] as const,
    payments: () => [...MEMBER_KEYS.all, 'payments'] as const,
    meetings: (type: 'joined' | 'available') => [...MEMBER_KEYS.all, 'meetings', type] as const,
    documents: () => [...MEMBER_KEYS.all, 'documents'] as const,
    activity: () => [...MEMBER_KEYS.all, 'activity'] as const,
};

export function useMemberProfileQuery() {
    return useQuery({
        queryKey: MEMBER_KEYS.profile(),
        queryFn: async () => {
            const response = await apiClient.get<ApiProfileResponse>(API_ENDPOINTS.MEMBERS_ME);
            return memberAdapter.profile(response.data);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useUpdateMemberProfileMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<MemberProfile>) => {
            const response = await apiClient.put<ApiProfileResponse>(API_ENDPOINTS.MEMBERS_ME, data);
            return memberAdapter.profile(response.data);
        },
        onSuccess: (updatedProfile) => {
            queryClient.setQueryData(MEMBER_KEYS.profile(), updatedProfile);
        },
    });
}

export function useMemberPaymentsQuery() {
    return useQuery({
        queryKey: MEMBER_KEYS.payments(),
        queryFn: async () => {
            const response = await apiClient.get<ApiPaymentsResponse>(API_ENDPOINTS.MEMBERS_PAYMENTS);
            return memberAdapter.payments(response.data);
        },
        staleTime: 1000 * 60 * 5,
    });
}

export function useMemberMeetingsQuery() {
    return useQuery({
        queryKey: MEMBER_KEYS.meetings('joined'),
        queryFn: async () => {
            const response = await apiClient.get<ApiMeetingsResponse>(API_ENDPOINTS.MEMBERS_MEETINGS);
            return memberAdapter.meetings(response.data);
        },
        staleTime: 1000 * 60 * 5,
    });
}

export function useAvailableMeetingsQuery() {
    return useQuery({
        queryKey: MEMBER_KEYS.meetings('available'),
        queryFn: async () => {
            const response = await apiClient.get<ApiMeetingsResponse>(API_ENDPOINTS.MEMBERS_MEETINGS_AVAILABLE);
            return memberAdapter.meetings(response.data);
        },
        staleTime: 1000 * 60 * 5,
    });
}

export function useMemberDocumentsQuery() {
    return useQuery({
        queryKey: MEMBER_KEYS.documents(),
        queryFn: async () => {
            const response = await apiClient.get<ApiDocumentsResponse>(API_ENDPOINTS.MEMBERS_DOCUMENTS);
            // Backend returns { data: { documents: [] } }
            const docs = response.data?.documents || [];
            return docs.map((d): Document => ({
                id: d.id || '',
                name: d.name || '',
                type: d.type || '',
                url: d.url || '',
                createdAt: d.createdAt || '',
            }));
        },
        staleTime: 1000 * 60 * 10,
    });
}

export function useMemberActivityQuery() {
    return useQuery({
        queryKey: MEMBER_KEYS.activity(),
        queryFn: async () => {
            const response = await apiClient.get<ApiActivityResponse>(API_ENDPOINTS.MEMBERS_ACTIVITY);
            return memberAdapter.activity(response.data);
        },
        staleTime: 1000 * 60 * 2,
    });
}

export function useRsvpMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (meetingId: string) => {
            const endpoint = API_ENDPOINTS.MEMBERS_MEETINGS_RSVP.replace(':id', meetingId);
            return apiClient.post(endpoint, {});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.meetings('joined') });
            queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.meetings('available') });
        },
    });
}

export function useCancelRsvpMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (meetingId: string) => {
            const endpoint = API_ENDPOINTS.MEMBERS_MEETINGS_RSVP.replace(':id', meetingId);
            return apiClient.delete(endpoint);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.meetings('joined') });
            queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.meetings('available') });
        },
    });
}
