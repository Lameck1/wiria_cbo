import { useState, useDeferredValue } from 'react';
import { MemberTable } from '@/features/admin/components/members/MemberTable';
import { MemberFilters } from '@/features/admin/components/members/MemberFilters';
import { MemberDetailsModal } from '@/features/admin/components/members/MemberDetailsModal';
import { AdminMember, getMembers } from '@/features/membership/api/members.api';
import { useAdminData } from '@/shared/hooks/useAdminData';
import { AdminPageHeader } from '@/features/admin/components/layout/AdminPageHeader';

export default function MemberManagementPage() {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null);

  const { items: members, isLoading, refetch } = useAdminData<AdminMember>(
    ['admin', 'members', filter, deferredSearch],
    () => getMembers({ status: filter, search: deferredSearch }),
    { arrayKey: 'members' }
  );

  return (
    <div>
      <AdminPageHeader
        title="Member Management"
        description="View and manage member applications"
      />

      <MemberFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        onSearch={setSearch}
      />

      <MemberTable
        members={members}
        isLoading={isLoading}
        onViewDetails={setSelectedMember}
      />

      <MemberDetailsModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onStatusChange={refetch}
      />
    </div>
  );
}
