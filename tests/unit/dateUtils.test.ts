/**
 * Date Utils Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  formatDate,
  formatDateShort,
  getDaysRemaining,
  formatRelativeTime,
  formatMonth,
  formatDateTime,
} from '@/shared/utils/dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('returns "Ongoing" unchanged', () => {
      expect(formatDate('Ongoing')).toBe('Ongoing');
    });

    it('returns "Rolling basis" unchanged', () => {
      expect(formatDate('Rolling basis')).toBe('Rolling basis');
    });

    it('formats ISO date string to readable format', () => {
      const result = formatDate('2024-01-15');
      // en-KE locale uses "day month year" format
      expect(result).toMatch(/15.*January.*2024|January.*15.*2024/);
    });

    it('formats Date object to readable format', () => {
      const result = formatDate(new Date('2024-06-20'));
      expect(result).toMatch(/20.*June.*2024|June.*20.*2024/);
    });

    it('returns string representation for invalid date', () => {
      const result = formatDate('invalid-date');
      // Invalid dates return "Invalid Date" string or the original
      expect(typeof result).toBe('string');
    });
  });

  describe('formatDateShort', () => {
    it('returns "Ongoing" unchanged', () => {
      expect(formatDateShort('Ongoing')).toBe('Ongoing');
    });

    it('returns "Rolling basis" unchanged', () => {
      expect(formatDateShort('Rolling basis')).toBe('Rolling basis');
    });

    it('formats date to short format', () => {
      const result = formatDateShort('2024-01-15');
      expect(result).toMatch(/Jan\s+15,\s+2024/);
    });

    it('returns Invalid Date or original for invalid input', () => {
      const result = formatDateShort('invalid');
      expect(typeof result).toBe('string');
    });
  });

  describe('getDaysRemaining', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns null for "Ongoing"', () => {
      expect(getDaysRemaining('Ongoing')).toBeNull();
    });

    it('returns null for "Rolling basis"', () => {
      expect(getDaysRemaining('Rolling basis')).toBeNull();
    });

    it('calculates positive days remaining', () => {
      const result = getDaysRemaining('2024-01-20');
      expect(result).toBe(5);
    });

    it('calculates negative days for past dates', () => {
      const result = getDaysRemaining('2024-01-10');
      expect(result).toBe(-5);
    });

    it('returns 0 for today', () => {
      const result = getDaysRemaining('2024-01-15');
      expect(result).toBe(0);
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns "Just now" for very recent times', () => {
      const result = formatRelativeTime('2024-01-15T11:59:30');
      expect(result).toBe('Just now');
    });

    it('returns minutes ago', () => {
      const result = formatRelativeTime('2024-01-15T11:30:00');
      expect(result).toBe('30 minutes ago');
    });

    it('returns singular minute', () => {
      const result = formatRelativeTime('2024-01-15T11:59:00');
      expect(result).toBe('1 minute ago');
    });

    it('returns hours ago', () => {
      const result = formatRelativeTime('2024-01-15T09:00:00');
      expect(result).toBe('3 hours ago');
    });

    it('returns singular hour', () => {
      const result = formatRelativeTime('2024-01-15T11:00:00');
      expect(result).toBe('1 hour ago');
    });

    it('returns "Yesterday" for yesterday', () => {
      const result = formatRelativeTime('2024-01-14T12:00:00');
      expect(result).toBe('Yesterday');
    });

    it('returns days ago for recent days', () => {
      const result = formatRelativeTime('2024-01-12T12:00:00');
      expect(result).toBe('3 days ago');
    });

    it('returns weeks ago', () => {
      const result = formatRelativeTime('2024-01-01T12:00:00');
      expect(result).toBe('2 weeks ago');
    });

    it('returns months ago', () => {
      const result = formatRelativeTime('2023-11-15T12:00:00');
      expect(result).toBe('2 months ago');
    });

    it('returns formatted date for old dates', () => {
      const result = formatRelativeTime('2022-01-15T12:00:00');
      expect(result).toMatch(/15.*Jan.*2022|Jan.*15.*2022/);
    });
  });

  describe('formatMonth', () => {
    it('formats YYYY-MM to readable month', () => {
      const result = formatMonth('2024-01');
      expect(result).toMatch(/Jan.*2024/);
    });

    it('formats different months correctly', () => {
      const result = formatMonth('2024-06');
      expect(result).toMatch(/Jun.*2024/);
    });

    it('handles edge case with missing parts', () => {
      const result = formatMonth('2024');
      // Should not throw, returns some formatted output
      expect(typeof result).toBe('string');
    });
  });

  describe('formatDateTime', () => {
    it('formats date string with time', () => {
      const result = formatDateTime('2024-01-15T14:30:00');
      expect(result).toMatch(/Jan/);
      expect(result).toMatch(/15/);
      expect(result).toMatch(/2024/);
    });

    it('formats Date object with time', () => {
      const result = formatDateTime(new Date('2024-06-20T09:15:00'));
      expect(result).toMatch(/Jun/);
      expect(result).toMatch(/20/);
    });

    it('returns string for invalid date', () => {
      const result = formatDateTime('invalid');
      expect(typeof result).toBe('string');
    });
  });
});
