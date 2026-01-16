import type { Donation } from '@/features/admin/api/donations.api';
import type { Column } from '@/shared/components/ui/DataTable';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { formatDateTime } from '@/shared/utils/dateUtils';
import { formatCurrency } from '@/shared/utils/helpers';

export const getDonationColumns = (
  onViewDetails: (donation: Donation) => void
): Column<Donation>[] => [
  {
    header: 'Donor',
    key: 'donorName',
    render: (d) => (
      <div>
        <div className="font-semibold">{d.isAnonymous ? 'Anonymous' : d.donorName}</div>
        {!d.isAnonymous && <div className="text-xs text-gray-500">{d.donorEmail}</div>}
      </div>
    ),
  },
  {
    header: 'Amount',
    key: 'amount',
    render: (d) => (
      <span className="font-bold text-green-600">{formatCurrency(d.amount)}</span>
    ),
  },
  {
    header: 'Method',
    key: 'paymentMethod',
    render: (d) => (
      <span className="text-sm capitalize">{d.paymentMethod.replace('_', ' ').toLowerCase()}</span>
    ),
  },
  {
    header: 'Date',
    key: 'createdAt',
    render: (d) => <span className="text-sm">{formatDateTime(d.createdAt)}</span>,
  },
  {
    header: 'Status',
    key: 'status',
    render: (d) => <StatusBadge status={d.status} />,
  },
  {
    header: 'Actions',
    key: 'actions',
    align: 'right',
    render: (d) => (
      <button
        onClick={() => onViewDetails(d)}
        className="text-sm font-bold text-wiria-blue-dark hover:underline"
      >
        View Details
      </button>
    ),
  },
];
