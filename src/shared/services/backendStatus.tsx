/**
 * Backend Status Service
 * Detects if the backend API is available and provides a React hook for components
 */

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface BackendStatusContextType {
  isBackendConnected: boolean;
  isChecking: boolean;
}

const BackendStatusContext = createContext<BackendStatusContextType>({
  isBackendConnected: false,
  isChecking: true,
});

// Cache the status to avoid repeated checks
let cachedStatus: boolean | null = null;
let checkPromise: Promise<boolean> | null = null;

async function checkBackendHealth(): Promise<boolean> {
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
    checkBackendHealth().then((connected) => {
      setIsBackendConnected(connected);
      setIsChecking(false);
    });
  }, []);

  return (
    <BackendStatusContext.Provider value={{ isBackendConnected, isChecking }}>
      {children}
    </BackendStatusContext.Provider>
  );
}

/**
 * Hook to access backend connection status
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useBackendStatus(): BackendStatusContextType {
  return useContext(BackendStatusContext);
}

/**
 * Utility to manually recheck backend status (useful for retry logic)
 */
// eslint-disable-next-line react-refresh/only-export-components
export async function recheckBackendStatus(): Promise<boolean> {
  cachedStatus = null;
  checkPromise = null;
  return checkBackendHealth();
}
