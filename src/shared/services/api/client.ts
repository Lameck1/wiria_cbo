import { logger } from '@/shared/services/logger';

const API_BASE_URL: string =
  (import.meta.env['VITE_API_BASE_URL'] as string | undefined) ?? 'http://localhost:5001/api';

type TokenResolver = () => string | null;

class ApiClient {
  private baseURL: string;
  private tokenResolver?: TokenResolver;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Registers a function to resolve the current auth token.
   * This decouples the client from specific storage implementations.
   */
  setTokenResolver(resolver: TokenResolver) {
    this.tokenResolver = resolver;
  }

  /**
   * Deprecated: Use setTokenResolver instead for better decoupling.
   * Keeping for backward compatibility during migration.
   */
  setAuthToken(token: string | null) {
    this.tokenResolver = token ? () => token : undefined;
  }

  private onUnauthorizedCallback?: () => void;

  setUnauthorizedCallback(callback: () => void) {
    this.onUnauthorizedCallback = callback;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = this.tokenResolver?.();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private handleError(response: Response, data: unknown, endpoint: string): never {
    if (response.status === 401) {
      logger.warn('[ApiClient] Unauthorized access detected');

      // Only trigger callback if we're not currently attempting to login
      // to avoid redirecting while the user is typing credentials
      const isLoginEndpoint = endpoint.includes('/login');
      if (!isLoginEndpoint && this.onUnauthorizedCallback) {
        this.onUnauthorizedCallback();
      }
    }

    const dataObject = data as Record<string, unknown>;
    const errorMessage =
      (dataObject['message'] as string) ??
      ((dataObject['error'] as Record<string, unknown>)?.['message'] as string) ??
      (typeof dataObject['error'] === 'string' ? dataObject['error'] : null) ??
      (response.status === 401
        ? 'Session expired or unauthorized'
        : 'An unexpected error occurred');

    throw new ApiError(errorMessage, response.status, data);
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Check if response is empty (e.g. 204 No Content or logout)
      const text = await response.text();
      const data: unknown = text ? JSON.parse(text) : {};

      if (!response.ok) {
        this.handleError(response, data, endpoint);
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error occurred', 0, error);
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request<T>(`${endpoint}${queryString}`, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  get userMessage(): string {
    if (this.isNetworkError) {
      return 'Network error: Please check your internet connection and try again.';
    }

    if (this.status === 404) {
      return 'Not found: The requested resource could not be found.';
    }

    if (this.status === 429) {
      return 'Too many requests: Please slow down and try again.';
    }

    if (this.isServerError) {
      return 'Server error: Please try again later.';
    }

    return this.message || 'An unexpected error occurred.';
  }
}

export const apiClient = new ApiClient();
export default apiClient;
