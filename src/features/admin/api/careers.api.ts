import { apiClient as client } from '@/shared/services/api/client';

export interface Career {
    id: string;
    title: string;
    employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'CONSULTANCY';
    location: string;
    deadline: string;
    salary?: string;
    summary: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    desirable?: string[];
    status: 'ACTIVE' | 'DRAFT' | 'CLOSED' | 'ARCHIVED';
    createdAt: string;
}

export const getAdminCareers = async () => {
    return client.get<{ data: Career[] }>('/admin/careers');
};

export const createCareer = async (data: Partial<Career>) => {
    return client.post<Career>('/admin/careers', data);
};

export const updateCareer = async (id: string, data: Partial<Career>) => {
    return client.patch<Career>(`/admin/careers/${id}`, data);
};

export const deleteCareer = async (id: string) => {
    return client.delete(`/admin/careers/${id}`);
};
