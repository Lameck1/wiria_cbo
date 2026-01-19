import { apiClient as client } from '@/shared/services/api/client';

export interface Tender {
  id: string;
  refNo: string;
  title: string;
  category: string;
  deadline: string;
  status: 'OPEN' | 'CLOSED' | 'AWARDED' | 'CANCELLED';
  estimatedValue?: string;
  submissionMethod: 'ONLINE' | 'PHYSICAL' | 'BOTH';
  submissionEmail: string;
  contactPerson: string;
  contactPhone: string;
  downloadUrl?: string;
  description: string;
  eligibility: string[];
  requiredDocuments: string[];
  createdAt: string;
}

interface CreateTenderPayload {
  refNo: string;
  title: string;
  category: string;
  deadline: string;
  status: 'OPEN' | 'CLOSED' | 'AWARDED' | 'CANCELLED';
  estimatedValue?: string;
  submissionMethod: 'ONLINE' | 'PHYSICAL' | 'BOTH';
  submissionEmail: string;
  contactPerson: string;
  contactPhone: string;
  downloadUrl?: string;
  description: string;
  eligibility: string[];
  requiredDocuments: string[];
}

export const getTenders = async (
  options: { status?: string; category?: string; all?: boolean } = {}
) => {
  const params = new URLSearchParams();
  if (options.status) params.append('status', options.status);
  if (options.category) params.append('category', options.category);
  if (options.all) params.append('all', 'true');

  const queryString = params.toString();
  const url = queryString ? `/tenders?${queryString}` : '/tenders';

  return client.get<{ data: Tender[] }>(url);
};

export const createTender = async (data: CreateTenderPayload) => {
  return client.post<Tender>('/tenders', data);
};

export const updateTender = async (id: string, data: Partial<CreateTenderPayload>) => {
  return client.patch<Tender>(`/tenders/${id}`, data);
};

export const deleteTender = async (id: string) => {
  return client.delete(`/tenders/${id}`);
};
