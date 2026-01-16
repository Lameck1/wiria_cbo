/**
 * Helpers Utils Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  cn,
  formatCurrency,
  formatPhoneNumber,
  truncate,
  debounce,
  sleep,
} from '@/shared/utils/helpers';

describe('helpers', () => {
  describe('cn (classnames)', () => {
    it('merges class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('handles conditional classes', () => {
      expect(cn('base', 'active', '')).toBe('base active');
    });

    it('filters falsy values', () => {
      expect(cn('a', null, undefined, 'b')).toBe('a b');
    });

    it('handles empty input', () => {
      expect(cn()).toBe('');
    });
  });

  describe('formatCurrency', () => {
    it('formats positive number as KES', () => {
      const result = formatCurrency(1000);
      // en-KE locale may use "KES" or "Ksh"
      expect(result).toMatch(/KES|Ksh/);
      expect(result).toMatch(/1,?000/);
    });

    it('formats zero', () => {
      const result = formatCurrency(0);
      expect(result).toMatch(/KES|Ksh/);
      expect(result).toMatch(/0/);
    });

    it('handles large numbers with comma separators', () => {
      const result = formatCurrency(1000000);
      expect(result).toMatch(/1,?000,?000/);
    });
  });

  describe('formatPhoneNumber', () => {
    it('converts 0-prefix to international format', () => {
      expect(formatPhoneNumber('0712345678')).toBe('+254712345678');
    });

    it('adds + to 254 prefix', () => {
      expect(formatPhoneNumber('254712345678')).toBe('+254712345678');
    });

    it('converts 7-starting number to international', () => {
      expect(formatPhoneNumber('712345678')).toBe('+254712345678');
    });

    it('returns original for already formatted numbers', () => {
      expect(formatPhoneNumber('+254712345678')).toBe('+254712345678');
    });

    it('returns original for non-Kenyan format', () => {
      expect(formatPhoneNumber('+1234567890')).toBe('+1234567890');
    });

    it('handles 01X prefix numbers', () => {
      expect(formatPhoneNumber('0112345678')).toBe('+254112345678');
    });
  });

  describe('truncate', () => {
    it('returns original string if shorter than maxLength', () => {
      expect(truncate('short', 10)).toBe('short');
    });

    it('truncates and adds ellipsis', () => {
      expect(truncate('this is a long string', 10)).toBe('this is a ...');
    });

    it('handles exact length', () => {
      expect(truncate('exact', 5)).toBe('exact');
    });

    it('handles empty string', () => {
      expect(truncate('', 5)).toBe('');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('delays function execution', () => {
      const function_ = vi.fn();
      const debounced = debounce(function_, 100);

      debounced();
      expect(function_).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(function_).toHaveBeenCalledTimes(1);
    });

    it('only calls once for rapid calls', () => {
      const function_ = vi.fn();
      const debounced = debounce(function_, 100);

      debounced();
      debounced();
      debounced();

      vi.advanceTimersByTime(100);
      expect(function_).toHaveBeenCalledTimes(1);
    });

    it('passes arguments to debounced function', () => {
      const function_ = vi.fn();
      const debounced = debounce(function_, 100);

      debounced('arg1', 'arg2');
      vi.advanceTimersByTime(100);

      expect(function_).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('resets timer on subsequent calls', () => {
      const function_ = vi.fn();
      const debounced = debounce(function_, 100);

      debounced();
      vi.advanceTimersByTime(50);
      debounced();
      vi.advanceTimersByTime(50);

      expect(function_).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(function_).toHaveBeenCalledTimes(1);
    });
  });

  describe('sleep', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('resolves after specified time', async () => {
      const promise = sleep(100);
      let resolved = false;

      promise.then(() => {
        resolved = true;
      });

      expect(resolved).toBe(false);

      await vi.advanceTimersByTimeAsync(100);

      expect(resolved).toBe(true);
    });

    it('returns a promise', () => {
      expect(sleep(100)).toBeInstanceOf(Promise);
    });
  });
});
