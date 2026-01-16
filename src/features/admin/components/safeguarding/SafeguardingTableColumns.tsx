import { SafeguardingReport } from '@/features/admin/api/safeguarding.api';
import { Column } from '@/shared/components/ui/DataTable';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { formatDate } from '@/shared/utils/helpers';

import { INCIDENT_TYPES, PRIORITY_COLORS } from './constants';

export const getSafeguardingColumns = (
  onView: (report: SafeguardingReport) => void,
  onResolve: (report: SafeguardingReport) => void
): Column<SafeguardingReport>[] => [
  { header: 'Reference', key: 'referenceNumber', className: 'font-mono text-xs font-bold' },
  {
    header: 'Type',
    key: 'incidentType',
    render: (r) => (
      <span className="text-sm">{INCIDENT_TYPES[r.incidentType] ?? r.incidentType}</span>
    ),
  },
  {
    header: 'Priority',
    key: 'priority',
    render: (r) => (
      <span
        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${PRIORITY_COLORS[r.priority]}`}
      >
        {r.priority}
      </span>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (r) => <StatusBadge status={r.status} />,
  },
  {
    header: 'Date',
    key: 'createdAt',
    render: (r) => <span className="text-sm text-gray-500">{formatDate(r.createdAt)}</span>,
  },
  {
    header: 'Actions',
    key: 'actions',
    align: 'right',
    render: (r) => (
      <div className="flex justify-end gap-3">
        <button
          onClick={() => onView(r)}
          className="text-sm font-bold text-wiria-blue-dark hover:underline"
        >
          View
        </button>
        {r.status !== 'RESOLVED' && r.status !== 'CLOSED' && (
          <button
            onClick={() => onResolve(r)}
            className="text-sm font-bold text-green-600 hover:underline"
          >
            Resolve
          </button>
        )}
      </div>
    ),
  },
];
