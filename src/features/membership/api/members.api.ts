import { apiClient as client } from '@/shared/services/api/client';
import { MembershipStatus } from '@/shared/types';

export interface AdminMember {
  id: string;
  memberNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: MembershipStatus;
  joinDate: string;
  payments: Array<{
    amount: number;
    status: string;
    date: string;
  }>;
  occupation?: string;
  gender?: string;
  nationalId?: string;
  dateOfBirth?: string;
  address?: string;
  county?: string;
  subcounty?: string;
  ward?: string;
  skills?: string[];
  interests?: string[];
  membershipType: 'INDIVIDUAL' | 'GROUP';
  groupName?: string;
  currentMemberCount?: number;
  maxMemberCountReached?: number;
  updatedAt: string;
}

interface MemberFilters {
  status?: string;
  search?: string;
}

interface MemberResponse {
  members: AdminMember[];
}

export const getMembers = async (filters: MemberFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);

  const response = await client.get<MemberResponse>(`/admin/members?${params.toString()}`);
  return response;
};

/** Response structure for member status update operations */
interface MemberStatusUpdateResponse {
  message: string;
  member?: AdminMember;
}

export const approveMember = async (id: string) => {
  const response = await client.patch<MemberStatusUpdateResponse>(`/admin/members/${id}/approve`);
  return response;
};

export const rejectMember = async (id: string, reason: string) => {
  const response = await client.patch<MemberStatusUpdateResponse>(`/admin/members/${id}/reject`, { reason });
  return response;
};
