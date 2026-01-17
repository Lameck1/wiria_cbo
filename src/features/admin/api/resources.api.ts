import { apiClient as client } from '@/shared/services/api/client';
import { STORAGE_KEYS, storageService } from '@/shared/services/storage/storageService';

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

function validateFileSize(file: File) {
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    throw new Error(
      `File size exceeds 10MB limit. Your file is ${sizeMb}MB. Please choose a smaller file.`
    );
  }
}

function getAuthTokenOrThrow(): string {
  const token = storageService.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) {
    throw new Error('Authentication required. Please log in to upload files.');
  }
  return token;
}

function buildFormData(file: File, folder: string): FormData {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  return formData;
}

function getApiBaseUrl(): string {
  const envValue = String(import.meta.env['VITE_API_BASE_URL'] ?? '');
  const base = envValue.length > 0 ? envValue : 'http://localhost:5001/api';
  return `${base}/uploads`;
}

async function parseErrorMessage(response: Response): Promise<string> {
  const data = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
  if (response.status === 413 || data?.error?.message?.includes('too large')) {
    return 'File is too large. Maximum size is 10MB. Please compress your file or choose a smaller one.';
  }
  if (response.status === 401) {
    return 'Authentication failed. Please log in again.';
  }
  if (response.status === 403) {
    return 'You do not have permission to upload files.';
  }
  return data?.error?.message ?? `Upload failed (${response.status}). Please try again.`;
}

function isNetworkFetchError(error: { message?: string; name?: string }): boolean {
  return error.name === 'TypeError' && (error.message?.includes('fetch') ?? false);
}

export const uploadFile = async (
  file: File,
  folder = 'resources'
): Promise<{ data: { url: string } }> => {
  validateFileSize(file);
  const token = getAuthTokenOrThrow();
  const formData = buildFormData(file, folder);
  const url = getApiBaseUrl();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response);
      throw new Error(message);
    }

    const result = (await response.json()) as { url: string };
    return { data: result };
  } catch (error: unknown) {
    const error_ = error as { message?: string; name?: string };
    if (
      (error_.message?.includes('10MB') ?? false) ||
      (error_.message?.includes('Authentication') ?? false) ||
      (error_.message?.includes('permission') ?? false)
    ) {
      throw error;
    }
    if (isNetworkFetchError(error_)) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw new Error(error_.message ?? 'File upload failed. Please try again.');
  }
};
