import { apiClient as client } from '@/shared/services/api/client';

export interface Opportunity {
  id: string;
  title: string;
  type: 'INTERNSHIP' | 'VOLUNTEER' | 'FELLOWSHIP' | 'ATTACHMENT';
  category: string;
  location: string;
  duration: string;
  deadline: string; // ISO date or "Ongoing"
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  status: 'ACTIVE' | 'DRAFT' | 'CLOSED' | 'ARCHIVED';
  createdAt: string;
}

export interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resumeUrl?: string;
  additionalDocs?: string[];
  status: 'PENDING' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEWED' | 'ACCEPTED' | 'REJECTED';
  notes?: string;
  createdAt: string;
  opportunityId?: string;
  careerId?: string;
  opportunity?: { title: string };
  career?: { title: string };
}

export const getAdminOpportunities = async () => {
  return client.get<{ data: Opportunity[] }>('/admin/opportunities');
};

export const createOpportunity = async (data: Partial<Opportunity>) => {
  return client.post<Opportunity>('/admin/opportunities', data);
};

export const updateOpportunity = async (id: string, data: Partial<Opportunity>) => {
  return client.patch<Opportunity>(`/admin/opportunities/${id}`, data);
};

export const deleteOpportunity = async (id: string) => {
  return client.delete(`/admin/opportunities/${id}`);
};

export const getApplications = async () => {
  return client.get<{ data: Application[] }>('/admin/applications');
};

export const updateApplicationStatus = async (id: string, status: string, notes?: string) => {
  return client.patch(`/admin/applications/${id}/status`, { status, notes });
};
