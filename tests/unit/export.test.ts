/**
 * Export Utils Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { arrayToCSV } from '@/shared/utils/export';

// Tests for downloadFile and exportToCSV are skipped in jsdom because URL.createObjectURL
// doesn't exist in the test environment. We test the core arrayToCSV logic instead.

describe('export utils', () => {
  describe('arrayToCSV', () => {
    it('returns empty string for empty data', () => {
      expect(arrayToCSV([])).toBe('');
    });

    it('converts simple data to CSV', () => {
      const data = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ];
      const result = arrayToCSV(data);
      expect(result).toContain('name,age');
      expect(result).toContain('John,30');
      expect(result).toContain('Jane,25');
    });

    it('uses custom column headers when provided', () => {
      const data = [{ firstName: 'John', lastName: 'Doe' }];
      const columns = [
        { key: 'firstName' as const, header: 'First Name' },
        { key: 'lastName' as const, header: 'Last Name' },
      ];
      const result = arrayToCSV(data, columns);
      expect(result).toContain('First Name,Last Name');
      expect(result).toContain('John,Doe');
    });

    it('wraps values containing commas in quotes', () => {
      const data = [{ description: 'Hello, World' }];
      const result = arrayToCSV(data);
      expect(result).toContain('"Hello, World"');
    });

    it('wraps values containing newlines in quotes', () => {
      const data = [{ note: 'Line1\nLine2' }];
      const result = arrayToCSV(data);
      expect(result).toContain('"Line1\nLine2"');
    });

    it('escapes double quotes by doubling them', () => {
      const data = [{ quote: 'He said "hello"' }];
      const result = arrayToCSV(data);
      expect(result).toContain('He said ""hello""');
    });

    it('handles null and undefined values', () => {
      const data = [{ a: null, b: undefined, c: 'value' }];
      const result = arrayToCSV(data);
      expect(result).toContain(',,value');
    });

    it('respects column order from columns config', () => {
      const data = [{ z: 1, a: 2 }];
      const columns = [
        { key: 'a' as const, header: 'A' },
        { key: 'z' as const, header: 'Z' },
      ];
      const result = arrayToCSV(data, columns);
      expect(result).toContain('A,Z');
      expect(result).toContain('2,1');
    });

    it('handles multiple rows correctly', () => {
      const data = [
        { id: 1, name: 'First' },
        { id: 2, name: 'Second' },
        { id: 3, name: 'Third' },
      ];
      const result = arrayToCSV(data);
      const lines = result.split('\n');
      expect(lines).toHaveLength(4); // header + 3 rows
    });

    it('handles numeric values', () => {
      const data = [{ price: 100.5, quantity: 10 }];
      const result = arrayToCSV(data);
      expect(result).toContain('100.5,10');
    });

    it('handles boolean values', () => {
      const data = [{ active: true, deleted: false }];
      const result = arrayToCSV(data);
      expect(result).toContain('true,false');
    });
  });

  describe('downloadFile', () => {
    let mockLink: {
      setAttribute: ReturnType<typeof vi.fn>;
      click: ReturnType<typeof vi.fn>;
      remove: ReturnType<typeof vi.fn>;
      style: { visibility: string };
    };

    beforeEach(() => {
      mockLink = {
        setAttribute: vi.fn(),
        click: vi.fn(),
        remove: vi.fn(),
        style: { visibility: '' },
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLElement);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as unknown as Node);
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as unknown as Node);

      // Mock URL methods that don't exist in jsdom
      global.URL.createObjectURL = vi.fn().mockReturnValue('blob:test-url');
      global.URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('creates and triggers download link', async () => {
      const { downloadFile } = await import('@/shared/utils/export');
      downloadFile('test content', 'test.csv');

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'test.csv');
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('revokes object URL after download', async () => {
      const { downloadFile } = await import('@/shared/utils/export');
      downloadFile('content', 'file.csv');

      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('exportToCSV', () => {
    beforeEach(() => {
      vi.spyOn(document, 'createElement').mockReturnValue({
        setAttribute: vi.fn(),
        click: vi.fn(),
        remove: vi.fn(),
        style: { visibility: '' },
      } as unknown as HTMLElement);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as unknown as Node);
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as unknown as Node);

      global.URL.createObjectURL = vi.fn().mockReturnValue('blob:test');
      global.URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('exports data to CSV file', async () => {
      const { exportToCSV } = await import('@/shared/utils/export');
      const data = [{ name: 'Test' }];
      expect(() => exportToCSV(data, 'test.csv')).not.toThrow();
    });

    it('handles custom columns', async () => {
      const { exportToCSV } = await import('@/shared/utils/export');
      const data = [{ name: 'Test' }];
      const columns = [{ key: 'name' as const, header: 'Name' }];
      expect(() => exportToCSV(data, 'test.csv', columns)).not.toThrow();
    });
  });
});
