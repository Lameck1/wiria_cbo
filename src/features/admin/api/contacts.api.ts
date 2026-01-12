/**
 * Contacts API Service
 * Handles contact message management for admin
 */

import { apiClient } from '@/shared/services/api/client';
import { extractArray, extractData } from '@/shared/utils/apiUtils';

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
    return (
      extractData<ContactStatistics>(response) ?? {
        total: 0,
        pending: 0,
        responded: 0,
        archived: 0,
        unread: 0,
      }
    );
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
