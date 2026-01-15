import { useMember } from '@/features/admin/context/MemberContext';
import { AdminMember } from '@/features/membership/api/members.api';

import { MemberDetailsModal } from './MemberDetailsModal';
import { MemberFilters } from './MemberFilters';
import { MemberTable } from './MemberTable';


interface MemberContentProps {
  filter: string;
  search: string;
  onFilterChange: (filter: string) => void;
  onSearch: (search: string) => void;
  selectedMember: AdminMember | null;
  onSelectMember: (member: AdminMember | null) => void;
}

export function MemberContent({
  filter,
  search: _search,
  onFilterChange,
  onSearch,
  selectedMember,
  onSelectMember,
}: MemberContentProps) {
  const { members, isLoading, refetch } = useMember();

  return (
    <>
      <MemberFilters
        currentFilter={filter}
        onFilterChange={onFilterChange}
        onSearch={onSearch}
      />

      <MemberTable
        members={members}
        isLoading={isLoading}
        onViewDetails={onSelectMember}
      />

      <MemberDetailsModal
        member={selectedMember}
        onClose={() => onSelectMember(null)}
        onStatusChange={() => { void refetch(); }}
      />
    </>
  );
}
