/**
 * Tests for API Utilities
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest';

import { extractArray, extractData, getErrorMessage, isObject } from '@/shared/utils/apiUtils';

describe('extractArray', () => {
  it('should return array when response is already an array', () => {
    const input = [{ id: '1' }, { id: '2' }];
    const result = extractArray<{ id: string }>(input);
    expect(result).toEqual(input);
  });

  it('should extract array from { data: T[] } wrapper', () => {
    const items = [{ id: '1' }, { id: '2' }];
    const input = { data: items };
    const result = extractArray<{ id: string }>(input);
    expect(result).toEqual(items);
  });

  it('should extract array from nested { data: { data: T[] } } wrapper', () => {
    const items = [{ id: '1' }, { id: '2' }];
    const input = { data: { data: items } };
    const result = extractArray<{ id: string }>(input);
    expect(result).toEqual(items);
  });

  it('should extract array using custom arrayKey', () => {
    const members = [{ name: 'Alice' }, { name: 'Bob' }];
    const input = { members };
    const result = extractArray<{ name: string }>(input, 'members');
    expect(result).toEqual(members);
  });

  it('should return empty array for null/undefined', () => {
    expect(extractArray(null)).toEqual([]);
    expect(extractArray(undefined)).toEqual([]);
  });

  it('should return empty array for invalid response', () => {
    expect(extractArray('string')).toEqual([]);
    expect(extractArray(123)).toEqual([]);
    expect(extractArray({})).toEqual([]);
  });
});

describe('extractData', () => {
  it('should return null for null/undefined input', () => {
    expect(extractData(null)).toBeNull();
    expect(extractData(undefined)).toBeNull();
  });

  it('should extract data from { data: T } wrapper', () => {
    const user = { id: '1', name: 'John' };
    const input = { data: user };
    const result = extractData<typeof user>(input);
    expect(result).toEqual(user);
  });

  it('should return response as-is if no data property', () => {
    const input = { id: '1', name: 'John' };
    const result = extractData<typeof input>(input);
    expect(result).toEqual(input);
  });
});

describe('getErrorMessage', () => {
  it('should extract message from Error instance', () => {
    const error = new Error('Test error');
    expect(getErrorMessage(error)).toBe('Test error');
  });

  it('should return string errors directly', () => {
    expect(getErrorMessage('Something went wrong')).toBe('Something went wrong');
  });

  it('should extract message from objects with message property', () => {
    const error = { message: 'API Error' };
    expect(getErrorMessage(error)).toBe('API Error');
  });

  it('should return fallback for unknown error types', () => {
    expect(getErrorMessage(null)).toBe('An error occurred');
    expect(getErrorMessage(undefined)).toBe('An error occurred');
    expect(getErrorMessage(123)).toBe('An error occurred');
  });

  it('should use custom fallback message', () => {
    expect(getErrorMessage(null, 'Custom error')).toBe('Custom error');
  });
});

describe('isObject', () => {
  it('should return true for plain objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ key: 'value' })).toBe(true);
  });

  it('should return false for arrays', () => {
    expect(isObject([])).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
  });

  it('should return false for null', () => {
    expect(isObject(null)).toBe(false);
  });

  it('should return false for primitives', () => {
    expect(isObject('string')).toBe(false);
    expect(isObject(123)).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(undefined)).toBe(false);
  });
});
