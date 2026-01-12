/**
 * Storage Service
 * Type-safe localStorage wrapper
 */

export class StorageService {
  private prefix: string;

  constructor(prefix: string = 'wiria_') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set<T>(key: string, value: T): void {
    try {
      if (value === undefined) {
        return;
      }
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serialized);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
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
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  has(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null;
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
