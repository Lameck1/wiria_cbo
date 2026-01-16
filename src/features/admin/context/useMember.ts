import { useContext } from 'react';

import { MemberContext } from './MemberContextBase';

export function useMember() {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMember must be used within a MemberProvider');
  }
  return context;
}
