import { apiClient as client } from '@/shared/services/api/client';
import { UserRole } from '@/shared/types';

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  createdAt: string;
}

export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  inviter?: { email: string };
  expiresAt: string;
  createdAt: string;
}

export interface InviteUserPayload {
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}

export const getUsers = async () => {
  return client.get<AdminUser[]>('/admin/users');
};

export const inviteUser = async (data: InviteUserPayload) => {
  return client.post<UserInvitation>('/admin/users/invite', data);
};

export const getInvitations = async (status = 'PENDING') => {
  return client.get<UserInvitation[]>(`/admin/users/invitations?status=${status}`);
};

export const cancelInvitation = async (id: string) => {
  return client.delete(`/admin/users/invitations/${id}`);
};

export const updateUserStatus = async (email: string, status: string) => {
  return client.patch(`/admin/users/${email}/status`, { status });
};

export const updateUser = async (email: string, data: Partial<AdminUser>) => {
  return client.patch(`/admin/users/${email}`, data);
};
