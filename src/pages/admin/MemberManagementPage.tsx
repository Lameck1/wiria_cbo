import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MemberTable } from '@/features/admin/components/members/MemberTable';
import { MemberFilters } from '@/features/admin/components/members/MemberFilters';
import { MemberDetailsModal } from '@/features/admin/components/members/MemberDetailsModal';
import { AdminMember, getMembers } from '@/features/membership/api/members.api';
import { notificationService } from '@/shared/services/notification/notificationService';
import { extractArray } from '@/shared/utils/apiUtils';

export default function MemberManagementPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [members, setMembers] = useState<AdminMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null);
    const highlightId = searchParams.get('highlight');

    const loadMembers = async () => {
        setIsLoading(true);
        try {
            const data = await getMembers({ status: filter, search });
            // Use shared utility with 'members' fallback key
            const membersList = extractArray<AdminMember>(data, 'members');
            setMembers(membersList);

            // If there's a highlight ID, find and select that member
            if (highlightId) {
                const targetMember = membersList.find((m: AdminMember) => m.id === highlightId);
                if (targetMember) {
                    setSelectedMember(targetMember);
                    // Clear the highlight param after opening
                    searchParams.delete('highlight');
                    setSearchParams(searchParams, { replace: true });
                }
            }
        } catch (error) {
            console.error(error);
            notificationService.error('Failed to load members');
        } finally {
            setIsLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        // Debounce search
        const timeout = setTimeout(() => {
            loadMembers();
        }, 500);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, search]);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-wiria-blue-dark">Member Management</h1>
                <p className="text-gray-600">View and manage member applications</p>
            </div>

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
                // Reload list on status change (approve/reject)
                onStatusChange={loadMembers}
            />
        </div>
    );
}
