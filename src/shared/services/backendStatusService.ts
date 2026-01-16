import { TIMING } from '@/shared/constants/config';

const DISABLE_BACKEND_HEALTHCHECK =
  String(import.meta.env['VITE_DISABLE_BACKEND_HEALTHCHECK'] ?? 'false') === 'true';

let cachedStatus: boolean | null = null;
let checkPromise: Promise<boolean> | null = null;

async function checkBackendHealth(): Promise<boolean> {
  if (DISABLE_BACKEND_HEALTHCHECK) {
    cachedStatus = false;
    return false;
  }

  if (cachedStatus !== null) {
    return cachedStatus;
  }

  if (checkPromise) {
    return checkPromise;
  }

  checkPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMING.HEALTH_CHECK_TIMEOUT);

      const response = await fetch('/api/health', {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      cachedStatus = response.ok;
      return cachedStatus;
    } catch {
      cachedStatus = false;
      return false;
    } finally {
      checkPromise = null;
    }
  })();

  return checkPromise;
}

export async function recheckBackendStatus(): Promise<boolean> {
  cachedStatus = null;
  checkPromise = null;
  return checkBackendHealth();
}

export async function getBackendStatus(): Promise<boolean> {
  return checkBackendHealth();
}

