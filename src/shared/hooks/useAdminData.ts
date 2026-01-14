import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';

import { notificationService } from '@/shared/services/notification/notificationService';
import { extractArray } from '@/shared/utils/apiUtils';

/**
 * Generic hook for fetching admin data with standardized extraction and error handling
 */
export function useAdminData<T>(
  queryKey: QueryKey,
  fetchFunction: () => Promise<unknown>,
  options: {
    arrayKey?: string;
    onError?: (error: unknown) => void;
    staleTime?: number;
    enabled?: boolean;
  } = {}
) {
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const response = await fetchFunction();
        return extractArray<T>(response, options.arrayKey);
      } catch (error) {
        if (options.onError) {
          options.onError(error);
        } else {
          console.error(`Error fetching ${queryKey.join('/')}:`, error);
          notificationService.error('Failed to load data. Please try again.');
        }
        throw error;
      }
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
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (data: TResponse) => void;
  } = {}
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: actionFunction,
    onSuccess: (data) => {
      queriesToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      if (options.successMessage) {
        notificationService.success(options.successMessage);
      }

      options.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Action failed:', error);
      notificationService.error(options.errorMessage ?? 'Operation failed');
    },
  });
}
