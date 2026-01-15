import { DataTable, Column } from '@/shared/components/ui/DataTable';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';

import { ApplicationsListProps, Application } from './types';

export function ApplicationsList({ applications, onReview }: ApplicationsListProps) {
  const columns: Column<Application>[] = [
    {
      header: 'Applicant',
      key: 'applicant',
      render: (app) => (
        <>
          <div className="font-bold text-gray-900">
            {app.firstName} {app.lastName}
          </div>
          <div className="text-xs text-gray-500">{app.email}</div>
        </>
      ),
    },
    {
      header: 'Position',
      key: 'position',
      render: (app) => (
        <span className="font-medium text-gray-700">
          {app.career?.title ?? app.opportunity?.title ?? 'Unknown'}
        </span>
      ),
    },
    {
      header: 'Applied Date',
      key: 'createdAt',
      render: (app) => (
        <span className="text-gray-500">
          {new Date(app.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (app) => <StatusBadge status={app.status} />,
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (app) => (
        <button
          onClick={() => onReview(app)}
          className="rounded-lg bg-wiria-blue-dark px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-800"
        >
          Review
        </button>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <DataTable
        columns={columns}
        data={applications}
        rowKey="id"
        emptyMessage="No applications found in this category."
        className="rounded-none border-none shadow-none"
      />
    </div>
  );
}
