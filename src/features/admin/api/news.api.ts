import { apiClient as client } from '@/shared/services/api/client';

export interface NewsUpdate {
  id: string;
  title: string;
  imageUrl?: string;
  category: 'GENERAL' | 'EVENT' | 'ANNOUNCEMENT' | 'STORY';
  status: 'PUBLISHED' | 'DRAFT';
  fullContent: string;
  excerpt?: string;
  createdAt: string;
}

interface CreateNewsPayload {
  title: string;
  imageUrl?: string;
  category: string;
  status: string;
  fullContent: string;
  excerpt?: string;
}

export const getAdminUpdates = async () => {
  // For admin, fetch all updates (including drafts) with includeAll=true
  return client.get<{ data: NewsUpdate[] }>('/updates?limit=100&includeAll=true');
};

export const createUpdate = async (data: CreateNewsPayload) => {
  return client.post<NewsUpdate>('/updates', data);
};

export const updateUpdate = async (id: string, data: Partial<CreateNewsPayload>) => {
  return client.patch<NewsUpdate>(`/updates/${id}`, data);
};

export const deleteUpdate = async (id: string) => {
  return client.delete(`/updates/${id}`);
};
