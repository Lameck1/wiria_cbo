import type { ReactNode } from 'react';

import type { AdminMember} from '@/features/membership/api/members.api';
import { getMembers } from '@/features/membership/api/members.api';
import { useAdminData } from '@/shared/hooks/useAdminData';

import { MemberContext } from './MemberContextBase';

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

export default MemberProvider;
