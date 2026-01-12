import type { MemberProfile, Payment, Meeting, Activity } from '../hooks/useMemberData';

/**
 * Member Adapter
 * Normalizes inconsistent backend responses into standard frontend structures.
 */
export const memberAdapter = {
    /**
     * Normalizes profile data, handling variations in nesting and field names.
     */
    profile(apiData: any): MemberProfile {
        if (!apiData) {
            throw new Error('Member adapter error: No profile data provided');
        }

        const source = apiData.props || apiData;

        return {
            id: apiData.id || source.id || '',
            memberNumber: apiData.memberNumber || source.memberNumber || '',
            firstName: source.firstName || '',
            lastName: source.lastName || '',
            email: source.email || '',
            phone: source.phone || '',
            nationalId: source.nationalId,
            occupation: source.occupation,
            address: source.address,
            county: source.county,
            subcounty: source.subcounty,
            ward: source.ward,
            interests: source.interests || [],
            skills: source.skills || [],
            status: apiData.status || source.status || 'PENDING',
            membershipType: apiData.membershipType || source.membershipType,
            groupName: apiData.groupName || source.groupName,
            currentMemberCount: apiData.currentMemberCount || source.currentMemberCount,
            maxMemberCountReached: apiData.maxMemberCountReached || source.maxMemberCountReached,
            joinedAt: apiData.joinDate || apiData.joinedAt || source.joinDate || source.joinedAt || '',
            membershipExpiresAt: apiData.expiryDate || apiData.membershipExpiresAt || source.expiryDate || source.membershipExpiresAt,
            createdAt: apiData.createdAt || source.createdAt || '',
        };
    },

    /**
     * Normalizes payment data.
     */
    payments(apiData: any): Payment[] {
        const list = Array.isArray(apiData) ? apiData : apiData?.payments || [];
        return list.map((p: any) => ({
            id: p.id || '',
            amount: Number(p.amount) || 0,
            type: p.type || 'DONATION',
            status: p.status || 'PENDING',
            method: p.method || 'MANUAL',
            mpesaReceiptNumber: p.mpesaReceiptNumber,
            createdAt: p.createdAt || '',
        }));
    },

    /**
     * Normalizes meeting data.
     */
    meetings(apiData: any): Meeting[] {
        const list = Array.isArray(apiData) ? apiData : apiData?.data || [];
        return list.map((m: any) => ({
            id: m.id || '',
            title: m.title || '',
            description: m.description,
            date: m.date || '',
            time: m.time || '',
            location: m.location || '',
            type: m.type || 'AGM',
            status: m.status || 'UPCOMING',
            isRsvpd: m.isRsvpd,
            attendeesCount: m.attendeesCount,
        }));
    },

    /**
     * Normalizes activity data.
     */
    activity(apiData: any): Activity[] {
        const list = Array.isArray(apiData) ? apiData : apiData?.data || [];
        return list.map((item: any) => ({
            id: item.id || '',
            type: item.type || '',
            description: item.description || '',
            createdAt: item.timestamp || item.createdAt || '',
        }));
    }
};
