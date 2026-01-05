import { apiClient as client } from '@/shared/services/api/client';

export interface Resource {
    id: string;
    title: string;
    category: string;
    fileType: string;
    fileSize: string;
    isPublic: boolean;
    downloadUrl?: string | null;
    description: string;
    summary?: string;
    keyPoints?: string[];
    downloads: number;
    createdAt: string;
}

export interface CreateResourcePayload {
    title: string;
    category: string;
    fileType: string;
    fileSize: string;
    isPublic: boolean;
    downloadUrl?: string | null;
    description: string;
    summary?: string;
    keyPoints?: string[];
}

export const getAdminResources = async () => {
    return client.get<{ data: Resource[] }>('/resources');
};

export const createResource = async (data: CreateResourcePayload) => {
    return client.post<Resource>('/resources', data);
};

export const updateResource = async (id: string, data: Partial<CreateResourcePayload>) => {
    return client.patch<Resource>(`/resources/${id}`, data);
};

export const deleteResource = async (id: string) => {
    return client.delete(`/resources/${id}`);
};

export const uploadFile = async (file: File, folder: string = 'resources') => {
    // Client-side validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        throw new Error(`File size exceeds 10MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB. Please choose a smaller file.`);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const token = localStorage.getItem('wiria_auth_token');

    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/uploads`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);

            // Handle specific error cases
            if (response.status === 413 || errorData?.error?.message?.includes('too large')) {
                throw new Error(`File is too large. Maximum size is 10MB. Please compress your file or choose a smaller one.`);
            }

            if (response.status === 401) {
                throw new Error('Authentication failed. Please log in again.');
            }

            if (response.status === 403) {
                throw new Error('You do not have permission to upload files.');
            }

            // Generic error with status
            throw new Error(errorData?.error?.message || `Upload failed (${response.status}). Please try again.`);
        }

        return response.json();
    } catch (error: unknown) {
        const err = error as { message?: string; name?: string };
        // Re-throw our custom errors
        if (err.message?.includes('10MB') || err.message?.includes('Authentication') || err.message?.includes('permission')) {
            throw error;
        }

        // Network or other errors
        if (err.name === 'TypeError' && err.message?.includes('fetch')) {
            throw new Error('Network error. Please check your connection and try again.');
        }

        throw new Error(err.message || 'File upload failed. Please try again.');
    }
};
