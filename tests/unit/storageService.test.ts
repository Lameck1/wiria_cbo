/**
 * Storage Service Tests
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { StorageService, storageService, STORAGE_KEYS } from '@/shared/services/storage/storageService';

describe('StorageService', () => {
    let storage: StorageService;

    beforeEach(() => {
        localStorage.clear();
        storage = new StorageService('test_');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('uses default prefix', () => {
            const defaultStorage = new StorageService();
            defaultStorage.set('key', 'value');
            expect(localStorage.getItem('wiria_key')).toBe('"value"');
        });

        it('uses custom prefix', () => {
            storage.set('key', 'value');
            expect(localStorage.getItem('test_key')).toBe('"value"');
        });
    });

    describe('set', () => {
        it('stores string value', () => {
            storage.set('string', 'hello');
            expect(localStorage.getItem('test_string')).toBe('"hello"');
        });

        it('stores number value', () => {
            storage.set('number', 42);
            expect(localStorage.getItem('test_number')).toBe('42');
        });

        it('stores object value', () => {
            storage.set('object', { name: 'test' });
            expect(localStorage.getItem('test_object')).toBe('{"name":"test"}');
        });

        it('stores array value', () => {
            storage.set('array', [1, 2, 3]);
            expect(localStorage.getItem('test_array')).toBe('[1,2,3]');
        });

        it('stores boolean value', () => {
            storage.set('bool', true);
            expect(localStorage.getItem('test_bool')).toBe('true');
        });

        it('does not store undefined', () => {
            storage.set('undefined', undefined);
            expect(localStorage.getItem('test_undefined')).toBeNull();
        });

        it('stores null', () => {
            storage.set('null', null);
            expect(localStorage.getItem('test_null')).toBe('null');
        });
    });

    describe('get', () => {
        it('retrieves string value', () => {
            storage.set('string', 'hello');
            expect(storage.get<string>('string')).toBe('hello');
        });

        it('retrieves number value', () => {
            storage.set('number', 42);
            expect(storage.get<number>('number')).toBe(42);
        });

        it('retrieves object value', () => {
            storage.set('object', { name: 'test' });
            const result = storage.get<{ name: string }>('object');
            expect(result).toEqual({ name: 'test' });
        });

        it('retrieves array value', () => {
            storage.set('array', [1, 2, 3]);
            expect(storage.get<number[]>('array')).toEqual([1, 2, 3]);
        });

        it('returns null for non-existent key', () => {
            expect(storage.get('nonexistent')).toBeNull();
        });

        it('returns null for "undefined" string value', () => {
            localStorage.setItem('test_undefined', 'undefined');
            expect(storage.get('undefined')).toBeNull();
        });

        it('handles raw string stored without JSON.stringify', () => {
            localStorage.setItem('test_raw', 'raw-string-value');
            expect(storage.get<string>('raw')).toBe('raw-string-value');
        });
    });

    describe('remove', () => {
        it('removes item from storage', () => {
            storage.set('key', 'value');
            expect(storage.get('key')).toBe('value');

            storage.remove('key');
            expect(storage.get('key')).toBeNull();
        });

        it('handles non-existent key gracefully', () => {
            expect(() => storage.remove('nonexistent')).not.toThrow();
        });
    });

    describe('clear', () => {
        it('removes keys with the storage prefix', () => {
            // Set some test data
            storage.set('key1', 'value1');
            storage.set('key2', 'value2');
            
            // Verify they exist
            expect(storage.has('key1')).toBe(true);
            expect(storage.has('key2')).toBe(true);
            
            // Clear all prefixed keys
            storage.clear();
            
            // Verify they're removed
            expect(storage.has('key1')).toBe(false);
            expect(storage.has('key2')).toBe(false);
            
            // Verify the actual localStorage keys are gone
            expect(localStorage.getItem('wiria_key1')).toBeNull();
            expect(localStorage.getItem('wiria_key2')).toBeNull();
        });

        it('handles empty storage', () => {
            expect(() => storage.clear()).not.toThrow();
        });
    });

    describe('has', () => {
        it('returns true for existing key', () => {
            storage.set('key', 'value');
            expect(storage.has('key')).toBe(true);
        });

        it('returns false for non-existent key', () => {
            expect(storage.has('nonexistent')).toBe(false);
        });

        it('returns true for null value', () => {
            storage.set('null', null);
            expect(storage.has('null')).toBe(true);
        });
    });
});

describe('storageService singleton', () => {
    it('is an instance of StorageService', () => {
        expect(storageService).toBeInstanceOf(StorageService);
    });
});

describe('STORAGE_KEYS', () => {
    it('contains expected keys', () => {
        expect(STORAGE_KEYS.AUTH_TOKEN).toBe('auth_token');
        expect(STORAGE_KEYS.REFRESH_TOKEN).toBe('refresh_token');
        expect(STORAGE_KEYS.USER_ROLE).toBe('user_role');
        expect(STORAGE_KEYS.USER_DATA).toBe('user_data');
    });
});
