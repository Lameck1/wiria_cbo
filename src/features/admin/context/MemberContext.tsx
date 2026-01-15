import { createContext, useContext, ReactNode } from 'react';

import { AdminMember, getMembers } from '@/features/membership/api/members.api';
import { useAdminData } from '@/shared/hooks/useAdminData';

interface MemberContextValue {
  members: AdminMember[];
  isLoading: boolean;
  refetch: () => Promise<void>;
  filter: string;
  search: string;
}

const MemberContext = createContext<MemberContextValue | undefined>(undefined);

interface MemberProviderProps {
  children: ReactNode;
  filter: string;
  search: string;
}

export function MemberProvider({ children, filter, search }: MemberProviderProps) {
  const { items: members, isLoading, refetch } = useAdminData<AdminMember>(
    ['admin', 'members', filter, search],
    () => getMembers({ status: filter, search }),
    { arrayKey: 'members' }
  );

  return (
    <MemberContext.Provider
      value={{
        members,
        isLoading,
        refetch: async () => { await refetch(); },
        filter,
        search,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMember must be used within a MemberProvider');
  }
  return context;
}
