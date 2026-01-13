/**
 * OpportunitiesTab Component
 * Displays volunteer/program opportunities with actions
 */

import { memo, useMemo } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { DataTable, Column } from '@/shared/components/ui/DataTable';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { OpportunitiesTabProps, Opportunity, Application } from './types';

export const OpportunitiesTab = memo(function OpportunitiesTab({
  opportunities,
  applications,
  onEdit,
  onDelete,
  onCreate,
}: OpportunitiesTabProps) {
  // Memoize application counts by opportunity ID
  const applicationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach((app: Application) => {
      if (app.opportunityId) {
        counts[app.opportunityId] = (counts[app.opportunityId] || 0) + 1;
      }
    });
    return counts;
  }, [applications]);

  const columns: Column<Opportunity>[] = [
    { header: 'Title', key: 'title', className: 'font-semibold text-gray-900' },
    {
      header: 'Type',
      key: 'type',
      render: (o) => <StatusBadge status={o.type} />,
    },
    {
      header: 'Category',
      key: 'category',
      render: (o) => <span className="text-sm text-gray-600">{o.category}</span>,
    },
    {
      header: 'Applications',
      key: 'applications',
      align: 'center',
      render: (o) => (
        <span className="font-bold text-wiria-blue-dark">{applicationCounts[o.id] || 0}</span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (o) => (
        <>
          <button
            onClick={() => onEdit(o)}
            className="mr-4 text-sm font-bold text-wiria-blue-dark transition-colors hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(o.id)}
            className="text-sm font-bold text-red-500 transition-colors hover:text-red-700"
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 p-6">
        <h3 className="text-lg font-bold text-gray-800">Active Opportunities</h3>
        <Button onClick={onCreate} size="sm">
          + New Opportunity
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={opportunities}
        rowKey="id"
        emptyMessage="No opportunities found."
        className="rounded-none border-none shadow-none"
      />
    </div>
  );
});
