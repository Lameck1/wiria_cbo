import type { Activity, Meeting, MemberProfile, Payment } from '../hooks/useMemberData';

/**
 * API Response Types
 * These interfaces model the raw backend response structure.
 * The adapter normalizes these into the frontend types.
 */

/** Raw profile data from API - may have different nesting structures */
interface ApiMemberProfileData {
    id?: string;
    memberNumber?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    nationalId?: string;
    occupation?: string;
    address?: string;
    county?: string;
    subcounty?: string;
    ward?: string;
    interests?: string[];
    skills?: string[];
    status?: string;
    membershipType?: string;
    groupName?: string;
    currentMemberCount?: number;
    maxMemberCountReached?: number;
    joinDate?: string;
    joinedAt?: string;
    expiryDate?: string;
    membershipExpiresAt?: string;
    createdAt?: string;
    props?: ApiMemberProfileData;
}

/** Raw payment data from API */
interface ApiPaymentData {
    id?: string;
    amount?: number | string;
    type?: string;
    status?: string;
    method?: string;
    mpesaReceiptNumber?: string;
    createdAt?: string;
}

/** Raw meeting data from API */
interface ApiMeetingData {
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
}

/** Raw activity data from API */
interface ApiActivityData {
    id?: string;
    type?: string;
    description?: string;
    timestamp?: string;
    createdAt?: string;
}

/** Response wrapper types */
type ApiPaymentsResponse = ApiPaymentData[] | { payments: ApiPaymentData[] };
type ApiMeetingsResponse = ApiMeetingData[] | { data: ApiMeetingData[] };
type ApiActivityResponse = ApiActivityData[] | { data: ApiActivityData[] };

/**
 * Member Adapter
 * Normalizes inconsistent backend responses into standard frontend structures.
 */
export const memberAdapter = {
    /**
     * Normalizes profile data, handling variations in nesting and field names.
     */
    profile(apiData: ApiMemberProfileData): MemberProfile {
        if (!apiData) {
            throw new Error('Member adapter error: No profile data provided');
        }
        const source = apiData.props ?? apiData;
        return {
            ...mapIdentityFields(apiData, source),
            ...mapContactAndLocation(source),
            ...mapAttributes(source),
            ...mapMembershipFields(apiData, source),
            ...mapDates(apiData, source),
        };
    },

    /**
     * Normalizes payment data.
     */
    payments(apiData: ApiPaymentsResponse): Payment[] {
        const list: ApiPaymentData[] = Array.isArray(apiData)
            ? apiData
            : (apiData as { payments: ApiPaymentData[] })?.payments ?? [];

        return list.map((p) => ({
            id: p.id ?? '',
            amount: Number(p.amount) ?? 0,
            type: (p.type ?? 'DONATION') as Payment['type'],
            status: (p.status ?? 'PENDING') as Payment['status'],
            method: (p.method ?? 'MANUAL') as Payment['method'],
            mpesaReceiptNumber: p.mpesaReceiptNumber,
            createdAt: p.createdAt ?? '',
        }));
    },

    /**
     * Normalizes meeting data.
     */
    meetings(apiData: ApiMeetingsResponse): Meeting[] {
        const list: ApiMeetingData[] = Array.isArray(apiData)
            ? apiData
            : (apiData as { data: ApiMeetingData[] })?.data ?? [];

        return list.map((m) => ({
            id: m.id ?? '',
            title: m.title ?? '',
            description: m.description,
            date: m.date ?? '',
            time: m.time ?? '',
            location: m.location ?? '',
            type: (m.type ?? 'AGM') as Meeting['type'],
            status: (m.status ?? 'UPCOMING') as Meeting['status'],
            isRsvpd: m.isRsvpd,
            attendeesCount: m.attendeesCount,
        }));
    },

    /**
     * Normalizes activity data.
     */
    activity(apiData: ApiActivityResponse): Activity[] {
        const list: ApiActivityData[] = Array.isArray(apiData)
            ? apiData
            : (apiData as { data: ApiActivityData[] })?.data ?? [];

        return list.map((item) => ({
            id: item.id ?? '',
            type: item.type ?? '',
            description: item.description ?? '',
            createdAt: item.timestamp ?? item.createdAt ?? '',
        }));
    }
};

function mapIdentityFields(apiData: ApiMemberProfileData, source: ApiMemberProfileData) {
    return {
        id: apiData.id ?? source.id ?? '',
        memberNumber: apiData.memberNumber ?? source.memberNumber ?? '',
        firstName: source.firstName ?? '',
        lastName: source.lastName ?? '',
    };
}

function mapContactAndLocation(source: ApiMemberProfileData) {
    return {
        email: source.email ?? '',
        phone: source.phone ?? '',
        nationalId: source.nationalId,
        occupation: source.occupation,
        address: source.address,
        county: source.county,
        subcounty: source.subcounty,
        ward: source.ward,
    };
}

function mapAttributes(source: ApiMemberProfileData) {
    return {
        interests: source.interests ?? [],
        skills: source.skills ?? [],
    };
}

function mapMembershipFields(apiData: ApiMemberProfileData, source: ApiMemberProfileData) {
    return {
        status: (apiData.status ?? source.status ?? 'PENDING') as MemberProfile['status'],
        membershipType: (apiData.membershipType ?? source.membershipType) as MemberProfile['membershipType'],
        groupName: apiData.groupName ?? source.groupName,
        currentMemberCount: apiData.currentMemberCount ?? source.currentMemberCount,
        maxMemberCountReached: apiData.maxMemberCountReached ?? source.maxMemberCountReached,
    };
}

function mapDates(apiData: ApiMemberProfileData, source: ApiMemberProfileData) {
    return {
        joinedAt: apiData.joinDate ?? apiData.joinedAt ?? source.joinDate ?? source.joinedAt ?? '',
        membershipExpiresAt:
            apiData.expiryDate ??
            apiData.membershipExpiresAt ??
            source.expiryDate ??
            source.membershipExpiresAt,
        createdAt: apiData.createdAt ?? source.createdAt ?? '',
    };
}
