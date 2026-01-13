/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import apiClient, { ApiError } from '@/shared/services/api/client';

describe('apiClient', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    apiClient.setAuthToken(null);
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('setAuthToken', () => {
    it('uses token in Authorization header after setAuthToken', async () => {
      const fetchMock = vi.mocked(fetch);
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ ok: true }),
      } as any);

      apiClient.setAuthToken('new-token');
      await apiClient.get('/test');

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer new-token',
          }),
        })
      );
    });

    it('removes Authorization header when null is passed', async () => {
      const fetchMock = vi.mocked(fetch);
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ ok: true }),
      } as any);

      // Set token then clear it
      apiClient.setAuthToken('existing-token');
      apiClient.setAuthToken(null);
      await apiClient.get('/test');

      // Should not have Authorization header
      const lastCall = fetchMock.mock.calls[fetchMock.mock.calls.length - 1];
      expect(lastCall).toBeDefined();
      const headers = (lastCall![1] as RequestInit).headers as Record<string, string>;
      expect(headers['Authorization']).toBeUndefined();
    });
  });

  describe('request', () => {
    it('makes successful request and parses JSON from text()', async () => {
      const mockResponse = { success: true, data: { id: 1 } };
      const fetchMock = vi.mocked(fetch);

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockResponse),
      } as any);

      const result = await apiClient.request('/test', { method: 'GET' });
      expect(result).toEqual(mockResponse);
    });

    it('includes Authorization header when token exists', async () => {
      apiClient.setAuthToken('test-token');
      const fetchMock = vi.mocked(fetch);

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ ok: true }),
      } as any);

      await apiClient.get('/test');

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('throws ApiError for failed requests', async () => {
      const fetchMock = vi.mocked(fetch);
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => JSON.stringify({ error: { message: 'Bad request' } }),
      } as any);

      await expect(apiClient.request('/test')).rejects.toBeInstanceOf(ApiError);
    });

    it('wraps network errors as ApiError(status=0)', async () => {
      const fetchMock = vi.mocked(fetch);
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiClient.request('/test')).rejects.toEqual(
        expect.objectContaining({ status: 0 })
      );
    });
  });

  describe('get', () => {
    it('adds query params', async () => {
      const fetchMock = vi.mocked(fetch);
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ data: [] }),
      } as any);

      await apiClient.get('/test', { page: '1', limit: '10' });

      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('page=1'), expect.any(Object));
    });
  });

  describe('post', () => {
    it('sends JSON body', async () => {
      const body = { name: 'Test' };
      const fetchMock = vi.mocked(fetch);

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true }),
      } as any);

      await apiClient.post('/test', body);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body),
        })
      );
    });
  });
});

describe('ApiError', () => {
  it('identifies network errors', () => {
    const error = new ApiError('Network error', 0);
    expect(error.isNetworkError).toBe(true);
  });

  it('identifies client errors', () => {
    const error = new ApiError('Bad request', 400);
    expect(error.isClientError).toBe(true);
    expect(error.isServerError).toBe(false);
  });

  it('identifies server errors', () => {
    const error = new ApiError('Server error', 500);
    expect(error.isServerError).toBe(true);
    expect(error.isClientError).toBe(false);
  });

  it('provides user-friendly messages', () => {
    const networkError = new ApiError('', 0);
    expect(networkError.userMessage).toContain('Network');

    const notFoundError = new ApiError('', 404);
    expect(notFoundError.userMessage.toLowerCase()).toContain('not found');

    const rateLimitError = new ApiError('', 429);
    expect(rateLimitError.userMessage).toContain('Too many');

    const serverError = new ApiError('', 500);
    expect(serverError.userMessage).toContain('Server');
  });
});
