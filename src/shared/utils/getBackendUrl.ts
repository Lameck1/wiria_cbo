/**
 * Backend URL Utility
 * Centralized helper for constructing full backend URLs for uploaded files
 */

/**
 * Get the backend base URL (without /api path)
 * Uses VITE_API_BASE_URL environment variable or falls back to localhost:5001
 */
export function getBackendBaseUrl(): string {
  const apiUrl = (import.meta.env['VITE_API_BASE_URL'] as string | undefined) ?? 'http://localhost:5001/api';
  return apiUrl.replace('/api', '');
}

/**
 * Convert a relative file path to a full backend URL
 * @param path - Relative path like /uploads/tenders/file.pdf
 * @returns Full URL like http://localhost:5001/uploads/tenders/file.pdf
 */
export function getFullFileUrl(path: string | undefined | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${getBackendBaseUrl()}${path}`;
}

/**
 * Check if a file URL is available (non-empty and valid)
 * @param url - The URL to check
 * @returns true if URL exists and is non-empty
 */
export function hasValidFileUrl(url: string | undefined | null): boolean {
  return Boolean(url && url.trim().length > 0);
}
