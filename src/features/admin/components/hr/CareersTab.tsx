import { memo, useMemo } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { DataTable, Column } from '@/shared/components/ui/DataTable';
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
      render: (c) => (
        <span className="rounded bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
          {c.employmentType.replace('_', ' ')}
        </span>
      ),
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
      render: (c) => (
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-bold ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
        >
          {c.status}
        </span>
      ),
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
