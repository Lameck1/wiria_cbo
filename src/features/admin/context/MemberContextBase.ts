import { createContext } from 'react';

import type { AdminMember } from '@/features/membership/api/members.api';

interface MemberContextValue {
  members: AdminMember[];
  isLoading: boolean;
  refetch: () => Promise<void>;
  filter: string;
  search: string;
}

export const MemberContext = createContext<MemberContextValue | undefined>(undefined);
