/**
 * Contacts API Service
 * Handles contact message management for admin
 */

import { apiClient } from '@/shared/services/api/client';
import { logger } from '@/shared/services/logger';
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
    logger.error('Failed to fetch contacts:', error);
    throw new Error('Failed to load contacts. Please try again.');
  }
};

export const getContactById = async (id: string): Promise<Contact | null> => {
  try {
    const response = await apiClient.get(`/contact/${id}`);
    return extractData(response);
  } catch (error) {
    logger.error('Failed to fetch contact:', error);
    return null;
  }
};

export const respondToContact = async (id: string, response: string): Promise<boolean> => {
  try {
    await apiClient.post(`/contact/${id}/respond`, { response });
    return true;
  } catch (error) {
    logger.error('Failed to respond to contact:', error);
    throw error;
  }
};

export const archiveContact = async (id: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/contact/${id}`);
    return true;
  } catch (error) {
    logger.error('Failed to archive contact:', error);
    throw error;
  }
};

export const getContactStatistics = async (): Promise<ContactStatistics> => {
  try {
    const response = await apiClient.get('/contact/statistics');
    const data = extractData<ContactStatistics>(response);
    if (!data) {
      throw new Error('Invalid statistics data received');
    }
    return data;
  } catch (error) {
    logger.error('Failed to fetch contact statistics:', error);
    throw new Error('Failed to load contact statistics. Please try again.');
  }
};
