import { AdminMember } from '@/features/membership/api/members.api';
import { Button } from '@/shared/components/ui/Button';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';

interface MemberTableProps {
  members: AdminMember[];
  isLoading: boolean;
  onViewDetails: (member: AdminMember) => void;
}

export function MemberTable({ members = [], isLoading, onViewDetails }: MemberTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-xl">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-wiria-blue-dark/20 border-t-wiria-blue-dark" />
        <p className="mt-4 text-gray-600">Loading members...</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center text-gray-500 shadow-xl">
        <p className="text-lg font-semibold">No members found</p>
        <p className="mt-2 text-sm">Try changing your filter or search criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Member #
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Join Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member) => (
              <tr key={member.id} className="transition-colors hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 font-mono text-sm font-semibold text-gray-900">
                  {member.memberNumber}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                  {member.firstName} {member.lastName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${member.membershipType === 'GROUP' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}
                  >
                    {member.membershipType}
                  </span>
                  {member.membershipType === 'GROUP' && (
                    <div className="mt-1 text-[10px] font-medium text-gray-500">
                      {member.groupName}
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  <div>{member.email}</div>
                  <div className="text-xs">{member.phone}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <StatusBadge status={member.status} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <PaymentInfo payments={member.payments} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {new Date(member.joinDate).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <Button size="sm" onClick={() => onViewDetails(member)}>
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentInfo({ payments }: { payments: AdminMember['payments'] }) {
  if (!payments || payments.length === 0) {
    return <span className="text-xs text-gray-400">No payments</span>;
  }

  const latest = payments[0];
  if (!latest) return <span className="text-xs text-gray-400">No payments</span>;

  const statusColor =
    latest.status === 'COMPLETED'
      ? 'text-green-600'
      : latest.status === 'FAILED'
        ? 'text-red-600'
        : 'text-yellow-600';

  return (
    <div>
      <div className="font-semibold text-gray-900">KES {(latest.amount || 0).toLocaleString()}</div>
      <div className={`text-xs ${statusColor}`}>{latest.status}</div>
    </div>
  );
}
