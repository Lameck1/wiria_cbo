import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

/**
 * Hook that wraps react-query's useQuery with automatic request cancellation
 * when the component unmounts or the query key changes.
 */
export function useCancellableQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
    queryKey: TQueryKey;
    queryFn: (signal: AbortSignal) => Promise<TQueryFnData>;
  }
) {
  const abortControllerRef = useRef<AbortController | null>(null);

  // Wrap the query function to pass the abort signal
  const wrappedQueryFn = async () => {
    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    
    try {
      return await options.queryFn(abortControllerRef.current.signal);
    } catch (error) {
      // Don't throw if the request was cancelled
      if (error instanceof Error && error.name === 'AbortError') {
        return Promise.reject(new Error('Request cancelled'));
      }
      throw error;
    }
  };

  const query = useQuery({
    ...options,
    queryFn: wrappedQueryFn,
  });

  // Cleanup: abort ongoing requests on unmount or query key change
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [options.queryKey]);

  return query;
}

/**
 * Utility to create a cancellable fetch function
 * Usage: const fetchData = createCancellableFetch(async (signal) => { ... })
 */
export function createCancellableFetch<T>(
  fetchFn: (signal: AbortSignal) => Promise<T>
) {
  return async (signal: AbortSignal): Promise<T> => {
    return fetchFn(signal);
  };
}

/**
 * Example fetch function with cancellation support
 */
export async function fetchWithCancellation<T>(
  url: string,
  signal: AbortSignal,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
