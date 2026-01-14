import { MemberTable } from './MemberTable';
import { MemberFilters } from './MemberFilters';
import { MemberDetailsModal } from './MemberDetailsModal';
import { AdminMember } from '@/features/membership/api/members.api';
import { useMember } from '@/features/admin/context/MemberContext';

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
        onStatusChange={refetch}
      />
    </>
  );
}
