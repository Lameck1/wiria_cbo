import { useMutation, useQueryClient, UseMutationOptions, QueryKey } from '@tanstack/react-query';
import { useCallback } from 'react';

interface UseOptimisticMutationOptions<TData, TVariables> extends Omit<UseMutationOptions<TData, Error, TVariables>, 'onMutate' | 'onError' | 'onSuccess'> {
  queryKey: QueryKey;
  updateFn: (oldData: any, newData: TVariables) => any;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for optimistic UI updates
 * Immediately updates the UI before server confirmation
 * Automatically rolls back on error
 */
export function useOptimisticMutation<TData = unknown, TVariables = unknown>({
  mutationFn,
  queryKey,
  updateFn,
  onSuccess,
  onError,
  ...options
}: UseOptimisticMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  const mutation = useMutation<TData, Error, TVariables>({
    mutationFn,
    ...options,

    // Optimistic update
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to new value
      queryClient.setQueryData(queryKey, (old: any) => {
        return updateFn(old, variables);
      });

      // Return context with snapshot
      return { previousData };
    },

    // Rollback on error
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      onError?.(error);
    },

    // Refetch on success
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey });
      onSuccess?.(data);
    },
  });

  return mutation;
}

/**
 * Example usage:
 * 
 * const updateTodoMutation = useOptimisticMutation({
 *   mutationFn: updateTodo,
 *   queryKey: ['todos'],
 *   updateFn: (oldTodos, updatedTodo) => {
 *     return oldTodos.map(todo =>
 *       todo.id === updatedTodo.id ? updatedTodo : todo
 *     );
 *   },
 *   onSuccess: () => {
 *     toast.success('Todo updated');
 *   },
 *   onError: (error) => {
 *     toast.error('Failed to update todo');
 *   },
 * });
 */
