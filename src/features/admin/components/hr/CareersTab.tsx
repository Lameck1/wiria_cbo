import { memo, useMemo } from 'react';

import { Button } from '@/shared/components/ui/Button';
import { DataTable, Column } from '@/shared/components/ui/DataTable';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';

import { CareersTabProps, Career, Application } from './types';

export const CareersTab = memo(function CareersTab({
  careers,
  applications,
  onEdit,
  onDelete,
  onCreate,
}: CareersTabProps) {
  // Memoize application counts by career ID
  const applicationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach((app: Application) => {
      if (app.careerId) {
        counts[app.careerId] = (counts[app.careerId] || 0) + 1;
      }
    });
    return counts;
  }, [applications]);

  const columns: Column<Career>[] = [
    { header: 'Title', key: 'title', className: 'font-semibold text-gray-900' },
    {
      header: 'Type',
      key: 'employmentType',
      render: (c) => <StatusBadge status={c.employmentType} />,
    },
    {
      header: 'Applications',
      key: 'applications',
      align: 'center',
      render: (c) => (
        <span className="font-bold text-wiria-blue-dark">{applicationCounts[c.id] || 0}</span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (c) => <StatusBadge status={c.status} />,
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (c) => (
        <>
          <button
            onClick={() => onEdit(c)}
            className="mr-4 text-sm font-bold text-wiria-blue-dark transition-colors hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(c.id)}
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
        <h3 className="text-lg font-bold text-gray-800">Active Job Postings</h3>
        <Button onClick={onCreate} size="sm">
          + Post New Job
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={careers}
        rowKey="id"
        emptyMessage="No job postings found."
        className="rounded-none border-none shadow-none"
      />
    </div>
  );
});
