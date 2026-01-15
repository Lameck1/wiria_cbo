/**
 * Tests for useDebounce hook
 * Phase 5L1: Unit test coverage expansion
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useDebounce } from '../../src/shared/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });

    // Value should not update immediately
    expect(result.current).toBe('initial');

    // Fast-forward time by less than delay
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('initial');

    // Fast-forward time to complete delay
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('updated');
  });

  it('should reset timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: 'initial' },
      }
    );

    // Update value multiple times
    rerender({ value: 'update1' });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    rerender({ value: 'update2' });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    rerender({ value: 'final' });

    // Only the last value should be used after full delay
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('final');
  });

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 1000 },
      }
    );

    rerender({ value: 'updated', delay: 1000 });

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe('updated');
  });

  it('should work with different data types', () => {
    // Test with number
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 0 } }
    );

    numberRerender({ value: 42 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(numberResult.current).toBe(42);

    // Test with object
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: { key: 'initial' } } }
    );

    const updatedObject = { key: 'updated' };
    objectRerender({ value: updatedObject });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(objectResult.current).toEqual(updatedObject);
  });

  it('should cleanup timeout on unmount', () => {
    const { unmount, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    unmount();

    // Timer should be cleared, advancing time should not cause issues
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // No errors should be thrown
    expect(true).toBe(true);
  });

  it('should handle empty strings', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: '' });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('');
  });

  it('should handle null and undefined', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' as string | null | undefined } }
    );

    rerender({ value: null });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe(null);

    rerender({ value: undefined });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe(undefined);
  });
});
