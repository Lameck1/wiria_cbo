import { logger } from '@/shared/services/logger';

export class StorageService {
  private prefix: string;
  private trackedKeys: Set<string>;

  constructor(prefix = 'wiria_') {
    this.prefix = prefix;
    this.trackedKeys = new Set<string>();

    if (typeof window !== 'undefined' && window.localStorage) {
      const storage = window.localStorage as unknown as { length?: number; key?: (index: number) => string | null };
      if (typeof storage.key === 'function' && typeof storage.length === 'number') {
        for (let index = 0; index < storage.length; index += 1) {
          const key = storage.key(index);
          if (key?.startsWith(this.prefix)) {
            this.trackedKeys.add(key);
          }
        }
      }
    }
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set<T>(key: string, value: T): void {
    try {
      if (value === undefined) {
        return;
      }
      const storageKey = this.getKey(key);
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(storageKey, serialized);
      this.trackedKeys.add(storageKey);
    } catch (error) {
      logger.error('Error saving to localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = window.localStorage.getItem(this.getKey(key));
      if (!item || item === 'undefined') return null;

      // Try to parse as JSON first
      try {
        return JSON.parse(item) as T;
      } catch {
        // If parsing fails, return the raw string if T is string
        // This handles cases where raw strings were stored without stringification
        return item as unknown as T;
      }
    } catch (error) {
      logger.error('Error reading from localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    const storageKey = this.getKey(key);
    window.localStorage.removeItem(storageKey);
    this.trackedKeys.delete(storageKey);
  }

  clear(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    for (const key of this.trackedKeys) {
      window.localStorage.removeItem(key);
    }
    this.trackedKeys.clear();
  }

  has(key: string): boolean {
    return window.localStorage.getItem(this.getKey(key)) !== null;
  }
}

export const storageService = new StorageService();

// Specific storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ROLE: 'user_role',
  USER_DATA: 'user_data',
} as const;
