/**
 * Admin News (Updates) API Tests
 */
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockUpdate = {
  id: '1',
  title: 'New Partnership Announced',
  imageUrl: 'https://example.com/image.jpg',
  category: 'ANNOUNCEMENT' as const,
  status: 'PUBLISHED' as const,
  fullContent: 'We are excited to announce...',
  excerpt: 'New partnership details',
  createdAt: '2024-01-15T10:00:00Z',
};

const server = setupServer();

beforeEach(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
  server.close();
});

describe('news.api', () => {
  describe('getAdminUpdates', () => {
    it('fetches all news updates', async () => {
      server.use(
        http.get('*/updates', () => {
          return HttpResponse.json({ data: [mockUpdate] });
        })
      );

      const { getAdminUpdates } = await import('@/features/admin/api/news.api');
      const result = await getAdminUpdates();
      expect(result).toBeTruthy();
    });
  });

  describe('createUpdate', () => {
    it('creates a news update', async () => {
      server.use(
        http.post('*/updates', () => {
          return HttpResponse.json(mockUpdate);
        })
      );

      const { createUpdate } = await import('@/features/admin/api/news.api');
      const result = await createUpdate({
        title: 'New Article',
        fullContent: 'Content here',
        category: 'GENERAL',
        status: 'DRAFT',
      });
      expect(result).toBeTruthy();
    });
  });

  describe('updateUpdate', () => {
    it('updates a news article', async () => {
      server.use(
        http.patch('*/updates/1', () => {
          return HttpResponse.json({ ...mockUpdate, title: 'Updated Title' });
        })
      );

      const { updateUpdate } = await import('@/features/admin/api/news.api');
      const result = await updateUpdate('1', { title: 'Updated Title' });
      expect(result).toBeTruthy();
    });
  });

  describe('deleteUpdate', () => {
    it('deletes a news article', async () => {
      server.use(
        http.delete('*/updates/1', () => {
          return HttpResponse.json({ success: true });
        })
      );

      const { deleteUpdate } = await import('@/features/admin/api/news.api');
      await expect(deleteUpdate('1')).resolves.not.toThrow();
    });
  });
});
