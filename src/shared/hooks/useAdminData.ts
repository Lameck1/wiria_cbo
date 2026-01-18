import { useMutation, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';

import { extractArray } from '@/shared/utils/apiUtils';

/**
 * Generic hook for fetching admin data with standardized extraction
 */
export function useAdminData<T>(
  queryKey: QueryKey,
  fetchFunction: () => Promise<unknown>,
  options: {
    arrayKey?: string;
    staleTime?: number;
    enabled?: boolean;
  } = {}
) {
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetchFunction();
      return extractArray<T>(response, options.arrayKey);
    },
    staleTime: options.staleTime ?? 1000 * 60 * 5, // 5 minutes default
    enabled: options.enabled,
  });

  return {
    items: data ?? [],
    ...rest,
  };
}

/**
 * Generic hook for admin CRUD operations with automatic cache invalidation
 */
export function useAdminAction<TInput, TResponse>(
  actionFunction: (input: TInput) => Promise<TResponse>,
  queriesToInvalidate: string[][],
  options: {
    onSuccess?: (data: TResponse) => void;
    onError?: (error: unknown) => void;
  } = {}
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: actionFunction,
    onSuccess: (data) => {
      queriesToInvalidate.forEach((key) => {
        void queryClient.invalidateQueries({ queryKey: key });
      });

      options.onSuccess?.(data);
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
}
