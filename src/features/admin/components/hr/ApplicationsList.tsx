import { DataTable, Column } from '@/shared/components/ui/DataTable';
import { ApplicationsListProps, Application } from './types';

function getStatusClass(status: string) {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    UNDER_REVIEW: 'bg-blue-100 text-blue-700',
    ACCEPTED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    SHORTLISTED: 'bg-purple-100 text-purple-700',
    INTERVIEWED: 'bg-indigo-100 text-indigo-700',
  };
  return styles[status] || 'bg-gray-100 text-gray-700';
}

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
          {app.career?.title || app.opportunity?.title || 'Unknown'}
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
      render: (app) => (
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusClass(app.status)}`}
        >
          {app.status}
        </span>
      ),
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
