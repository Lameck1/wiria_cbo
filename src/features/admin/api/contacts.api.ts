/**
 * Contacts API Service
 * Handles contact message management for admin
 */

import { apiClient } from '@/shared/services/api/client';

export interface Contact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: 'NEW' | 'READ' | 'RESPONDED' | 'ARCHIVED';
    response?: string;
    respondedAt?: string;
    respondedBy?: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ContactStatistics {
    total: number;
    pending: number;
    responded: number;
    archived: number;
    unread: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractArray = (response: any): Contact[] => {
    if (Array.isArray(response)) return response;
    if (response?.data && Array.isArray(response.data)) return response.data;
    if (response?.contacts && Array.isArray(response.contacts)) return response.contacts;
    return [];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractData = (response: any) => {
    if (response?.data) return response.data;
    return response;
};

export const getContacts = async (params?: { status?: string }): Promise<Contact[]> => {
    try {
        const queryString = params?.status ? `?status=${params.status}` : '';
        const response = await apiClient.get(`/contact${queryString}`);
        return extractArray(response);
    } catch (error) {
        console.error('Failed to fetch contacts:', error);
        return [];
    }
};

export const getContactById = async (id: string): Promise<Contact | null> => {
    try {
        const response = await apiClient.get(`/contact/${id}`);
        return extractData(response);
    } catch (error) {
        console.error('Failed to fetch contact:', error);
        return null;
    }
};

export const respondToContact = async (id: string, response: string): Promise<boolean> => {
    try {
        await apiClient.post(`/contact/${id}/respond`, { response });
        return true;
    } catch (error) {
        console.error('Failed to respond to contact:', error);
        throw error;
    }
};

export const archiveContact = async (id: string): Promise<boolean> => {
    try {
        await apiClient.delete(`/contact/${id}`);
        return true;
    } catch (error) {
        console.error('Failed to archive contact:', error);
        throw error;
    }
};

export const getContactStatistics = async (): Promise<ContactStatistics> => {
    try {
        const response = await apiClient.get('/contact/statistics');
        return extractData(response);
    } catch (error) {
        console.error('Failed to fetch contact statistics:', error);
        return {
            total: 0,
            pending: 0,
            responded: 0,
            archived: 0,
            unread: 0,
        };
    }
};
