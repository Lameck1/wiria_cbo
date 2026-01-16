import { QueryClient } from '@tanstack/react-query';

import { TIMING } from '@/shared/constants/config';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: TIMING.QUERY_DEFAULT_STALE_TIME,
    },
  },
});
