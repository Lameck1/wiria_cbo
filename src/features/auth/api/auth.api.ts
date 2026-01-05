import { apiClient as client } from '@/shared/services/api/client';

export interface VerifyInviteResponse {
    success: boolean;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
}

export const verifyInvitation = async (token: string) => {
    return client.post<VerifyInviteResponse>('/auth/verify-invite', { token });
};

export const acceptInvitation = async (token: string, password: string) => {
    return client.post('/auth/accept-invite', { token, password });
};
