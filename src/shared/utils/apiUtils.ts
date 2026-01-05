/**
 * API Response Utilities
 * Shared typed utilities for handling varying API response structures
 */

/**
 * Extracts an array from varying API response structures.
 * Handles:
 * - Direct array response
 * - { data: T[] } wrapper
 * - { data: { data: T[] } } nested wrapper
 * - Named arrays like { items: T[] } or { members: T[] }
 * 
 * @example
 * const items = extractArray<Item>(apiResponse);
 */
export function extractArray<T>(response: unknown, arrayKey?: string): T[] {
    // Direct array
    if (Array.isArray(response)) {
        return response as T[];
    }

    // Handle object responses
    if (response && typeof response === 'object') {
        const obj = response as Record<string, unknown>;

        // Check for specific key if provided (e.g., 'members', 'items')
        if (arrayKey && Array.isArray(obj[arrayKey])) {
            return obj[arrayKey] as T[];
        }

        // Standard { data: T[] } wrapper
        if (Array.isArray(obj['data'])) {
            return obj['data'] as T[];
        }

        // Nested { data: { data: T[] } } wrapper
        if (obj['data'] && typeof obj['data'] === 'object') {
            const nested = obj['data'] as Record<string, unknown>;
            if (Array.isArray(nested['data'])) {
                return nested['data'] as T[];
            }
            // Check for named arrays in nested data
            if (arrayKey && Array.isArray(nested[arrayKey])) {
                return nested[arrayKey] as T[];
            }
        }
    }

    return [];
}

/**
 * Extracts a single data object from API response.
 * Handles:
 * - Direct object response
 * - { data: T } wrapper
 * 
 * @example
 * const item = extractData<Item>(apiResponse);
 */
export function extractData<T>(response: unknown): T | null {
    if (!response) {
        return null;
    }

    if (typeof response === 'object') {
        const obj = response as Record<string, unknown>;

        // If response has 'data' property, use it
        if ('data' in obj && obj['data'] !== undefined) {
            return obj['data'] as T;
        }

        // Otherwise return the response itself
        return response as T;
    }

    return null;
}

/**
 * Type-safe error message extractor
 * Handles unknown catch block errors
 * 
 * @example
 * catch (error: unknown) {
 *   const message = getErrorMessage(error);
 * }
 */
export function getErrorMessage(error: unknown, fallback = 'An error occurred'): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    if (error && typeof error === 'object' && 'message' in error) {
        return String((error as { message: unknown }).message);
    }
    return fallback;
}

/**
 * Type guard to check if value is a non-null object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
