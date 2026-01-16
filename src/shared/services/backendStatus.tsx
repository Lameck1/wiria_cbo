/**
 * Backend Status Service
 * Detects if the backend API is available and provides a React hook for components
 */

import { createContext, ReactNode, useEffect, useState } from 'react';

const DISABLE_BACKEND_HEALTHCHECK =
  String(import.meta.env['VITE_DISABLE_BACKEND_HEALTHCHECK'] ?? 'false') === 'true';

export interface BackendStatusContextType {
  isBackendConnected: boolean;
  isChecking: boolean;
}

export const BackendStatusContext = createContext<BackendStatusContextType>({
  isBackendConnected: false,
  isChecking: true,
});

// Cache the status to avoid repeated checks
let cachedStatus: boolean | null = null;
let checkPromise: Promise<boolean> | null = null;

async function checkBackendHealth(): Promise<boolean> {
  if (DISABLE_BACKEND_HEALTHCHECK) {
    cachedStatus = false;
    return false;
  }

  // Return cached result if available
  if (cachedStatus !== null) {
    return cachedStatus;
  }

  // Return existing promise if check is in progress
  if (checkPromise) {
    return checkPromise;
  }

  checkPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch('/api/health', {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      cachedStatus = response.ok;
      return cachedStatus;
    } catch {
      // Network error, timeout, or API unavailable
      cachedStatus = false;
      return false;
    } finally {
      checkPromise = null;
    }
  })();

  return checkPromise;
}

/**
 * Provider component that checks backend status on mount
 */
export function BackendStatusProvider({ children }: { children: ReactNode }) {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    void checkBackendHealth().then((connected) => {
      setIsBackendConnected(connected);
      setIsChecking(false);
    });
  }, []);

  return (
    <BackendStatusContext value={{ isBackendConnected, isChecking }}>
      {children}
    </BackendStatusContext>
  );
}

/**
 * Hook to access backend connection status
 */
export async function recheckBackendStatus(): Promise<boolean> {
  cachedStatus = null;
  checkPromise = null;
  return checkBackendHealth();
}
