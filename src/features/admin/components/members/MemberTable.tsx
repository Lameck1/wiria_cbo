import { DataTable, Column } from '@/shared/components/ui/DataTable';
import { AdminMember } from '@/features/membership/api/members.api';
import { Button } from '@/shared/components/ui/Button';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';

interface MemberTableProps {
  members: AdminMember[];
  isLoading: boolean;
  onViewDetails: (member: AdminMember) => void;
}

export function MemberTable({ members = [], isLoading, onViewDetails }: MemberTableProps) {
  const columns: Column<AdminMember>[] = [
    {
      header: 'Member #',
      key: 'memberNumber',
      className: 'font-mono font-semibold',
    },
    {
      header: 'Name',
      key: 'name',
      render: (m) => `${m.firstName} ${m.lastName}`,
    },
    {
      header: 'Type',
      key: 'membershipType',
      render: (m) => (
        <>
          <span
            className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${m.membershipType === 'GROUP' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }`}
          >
            {m.membershipType}
          </span>
          {m.membershipType === 'GROUP' && (
            <div className="mt-1 text-[10px] font-medium text-gray-500">{m.groupName}</div>
          )}
        </>
      ),
    },
    {
      header: 'Contact',
      key: 'contact',
      render: (m) => (
        <>
          <div>{m.email}</div>
          <div className="text-xs text-gray-500">{m.phone}</div>
        </>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (m) => <StatusBadge status={m.status} />,
    },
    {
      header: 'Payment',
      key: 'payment',
      render: (m) => <PaymentInfo payments={m.payments} />,
    },
    {
      header: 'Join Date',
      key: 'joinDate',
      render: (m) => new Date(m.joinDate).toLocaleDateString(),
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (m) => (
        <Button size="sm" onClick={() => onViewDetails(m)}>
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
      <DataTable
        columns={columns}
        data={members}
        isLoading={isLoading}
        rowKey="id"
        emptyMessage="No members found matching your criteria."
        className="rounded-none border-none shadow-none"
      />
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
