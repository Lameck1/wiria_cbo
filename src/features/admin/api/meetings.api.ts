/**
 * Meetings API Service
 * Handles meeting management for admin
 */

import { apiClient } from '@/shared/services/api/client';
import { extractArray, extractData } from '@/shared/utils/apiUtils';

export interface Meeting {
  id: string;
  title: string;
  description: string;
  meetingType: 'AGM' | 'SGM' | 'COMMITTEE' | 'OTHER';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isVirtual: boolean;
  virtualLink?: string;
  agenda?: string;
  minutes?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  attendanceCount?: number;
  capacity?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingAttendance {
  id: string;
  meetingId: string;
  memberId: string;
  member?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  checkedInAt: string;
}

export interface CreateMeetingData {
  title: string;
  description: string;
  meetingType: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isVirtual: boolean;
  virtualLink?: string;
  agenda?: string;
  capacity?: number;
}

export const getMeetings = async (params?: {
  status?: string;
  upcoming?: boolean;
}): Promise<Meeting[]> => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.upcoming) searchParams.append('upcoming', 'true');
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const response = await apiClient.get(`/admin/meetings${queryString}`);
    return extractArray<Meeting>(response);
  } catch (error) {
    console.error('Failed to fetch meetings:', error);
    return [];
  }
};

export const getMeetingById = async (id: string): Promise<Meeting | null> => {
  try {
    const response = await apiClient.get(`/admin/meetings/${id}`);
    return extractData<Meeting>(response);
  } catch (error) {
    console.error('Failed to fetch meeting:', error);
    return null;
  }
};

export const createMeeting = async (data: CreateMeetingData): Promise<Meeting> => {
  const response = await apiClient.post('/admin/meetings', data);
  return extractData<Meeting>(response) as Meeting;
};

export const updateMeeting = async (
  id: string,
  data: Partial<CreateMeetingData>
): Promise<Meeting> => {
  const response = await apiClient.put(`/admin/meetings/${id}`, data);
  return extractData<Meeting>(response) as Meeting;
};

export const cancelMeeting = async (id: string): Promise<boolean> => {
  try {
    await apiClient.patch(`/admin/meetings/${id}`, { status: 'CANCELLED' });
    return true;
  } catch (error) {
    console.error('Failed to cancel meeting:', error);
    throw error;
  }
};

export const getMeetingAttendance = async (id: string): Promise<MeetingAttendance[]> => {
  try {
    const response = await apiClient.get(`/admin/meetings/${id}/attendance`);
    return extractArray<MeetingAttendance>(response, 'attendance');
  } catch (error) {
    console.error('Failed to fetch meeting attendance:', error);
    return [];
  }
};
