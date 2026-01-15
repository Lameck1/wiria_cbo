import { useState, useDeferredValue } from 'react';

import { AdminPageHeader } from '@/features/admin/components/layout/AdminPageHeader';
import { MemberContent } from '@/features/admin/components/members/MemberContent';
import { MemberProvider } from '@/features/admin/context/MemberContext';
import { AdminMember } from '@/features/membership/api/members.api';

export default function MemberManagementPage() {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null);

  return (
    <div>
      <AdminPageHeader
        title="Member Management"
        description="View and manage member applications"
      />

      <MemberProvider filter={filter} search={deferredSearch}>
        <MemberContent
          filter={filter}
          search={search}
          onFilterChange={setFilter}
          onSearch={setSearch}
          selectedMember={selectedMember}
          onSelectMember={setSelectedMember}
        />
      </MemberProvider>
    </div>
  );
}
