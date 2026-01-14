import { useState } from 'react';

import {
  getSafeguardingReports,
  updateSafeguardingReport as updateReport,
  resolveSafeguardingReport as resolveReport,
  SafeguardingReport,
} from '@/features/admin/api/safeguarding.api';
import { AdminPageHeader } from '@/features/admin/components/layout/AdminPageHeader';
import { ReportDetailsModal } from '@/features/admin/components/safeguarding/modals/ReportDetailsModal';
import { ResolveReportModal } from '@/features/admin/components/safeguarding/modals/ResolveReportModal';
import { DataTable, Column } from '@/shared/components/ui/DataTable';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { useAdminData, useAdminAction } from '@/shared/hooks/useAdminData';
import { formatDate } from '@/shared/utils/helpers';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700',
  INVESTIGATING: 'bg-orange-100 text-orange-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-500',
};

const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL: 'bg-red-600 text-white',
  HIGH: 'bg-orange-500 text-white',
  MEDIUM: 'bg-yellow-500 text-white',
  LOW: 'bg-green-500 text-white',
};

const INCIDENT_TYPES: Record<string, string> = {
  CHILD_PROTECTION: 'Child Protection',
  SEXUAL_EXPLOITATION: 'Sexual Exploitation',
  HARASSMENT: 'Harassment',
  DISCRIMINATION: 'Discrimination',
  FRAUD: 'Fraud',
  OTHER: 'Other',
};


export default function SafeguardingManagementPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const queryParams = {
    ...(statusFilter && { status: statusFilter }),
    ...(priorityFilter && { priority: priorityFilter }),
  };

  const { items: reports, isLoading } = useAdminData<SafeguardingReport>(
    ['safeguarding', queryParams],
    () => getSafeguardingReports(Object.keys(queryParams).length > 0 ? queryParams : undefined)
  );

  const updateStatusAction = useAdminAction(
    ({ id, status }: { id: string; status: SafeguardingReport['status'] }) =>
      updateReport(id, { status }),
    [['safeguarding']],
    { successMessage: 'Report status updated' }
  );

  const resolveAction = useAdminAction(
    ({ id, resolution }: { id: string; resolution: string }) => resolveReport(id, resolution),
    [['safeguarding']],
    { successMessage: 'Report resolved successfully' }
  );

  const [selectedReport, setSelectedReport] = useState<SafeguardingReport | null>(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolution, setResolution] = useState('');

  const handleResolve = () => {
    if (!selectedReport || !resolution.trim()) return;
    resolveAction.mutate(
      { id: selectedReport.id, resolution },
      {
        onSuccess: () => {
          setShowResolveModal(false);
          setResolution('');
          setSelectedReport(null);
        },
      }
    );
  };

  const columns: Column<SafeguardingReport>[] = [
    { header: 'Reference', key: 'referenceNumber', className: 'font-mono text-xs font-bold' },
    {
      header: 'Type',
      key: 'incidentType',
      render: (r) => (
        <span className="text-sm">{INCIDENT_TYPES[r.incidentType] || r.incidentType}</span>
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
            onClick={() => setSelectedReport(r)}
            className="text-sm font-bold text-wiria-blue-dark hover:underline"
          >
            View
          </button>
          {r.status !== 'RESOLVED' && r.status !== 'CLOSED' && (
            <button
              onClick={() => {
                setSelectedReport(r);
                setShowResolveModal(true);
              }}
              className="text-sm font-bold text-green-600 hover:underline"
            >
              Resolve
            </button>
          )}
        </div>
      ),
    },
  ];

  const criticalCount = reports.filter(
    (r) => r.priority === 'CRITICAL' && r.status !== 'RESOLVED' && r.status !== 'CLOSED'
  ).length;
  const openCount = reports.filter((r) => r.status !== 'RESOLVED' && r.status !== 'CLOSED').length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Safeguarding Reports"
        description="Manage and respond to safeguarding concerns within the community."
      >
        <div className="flex gap-3">
          {criticalCount > 0 && (
            <div className="flex animate-pulse items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              <span className="text-sm font-bold text-red-700">{criticalCount} critical</span>
            </div>
          )}
          {openCount > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-yellow-100 bg-yellow-50 px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-yellow-600" />
              <span className="text-sm font-bold text-yellow-700">
                {openCount} active case{openCount > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </AdminPageHeader>

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <span className="px-2 text-xs font-bold uppercase tracking-widest text-gray-400">
          Filters:
        </span>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border-none bg-gray-50 px-4 py-2 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-wiria-blue-dark"
          aria-label="Filter by Status"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="INVESTIGATING">Investigating</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
          className="rounded-lg border-none bg-gray-50 px-4 py-2 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-wiria-blue-dark"
          aria-label="Filter by Priority"
        >
          <option value="">All Priorities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={reports}
        rowKey="id"
        isLoading={isLoading}
        emptyMessage="No safeguarding reports found matching your criteria."
        rowClassName={(r) => (r.priority === 'CRITICAL' ? 'bg-red-50/50 hover:bg-red-50' : '')}
      />

      {selectedReport && !showResolveModal && (
        <ReportDetailsModal
          report={selectedReport}
          statusColors={STATUS_COLORS}
          priorityColors={PRIORITY_COLORS}
          incidentTypes={INCIDENT_TYPES}
          onClose={() => setSelectedReport(null)}
          onResolve={() => setShowResolveModal(true)}
          onStatusChange={(status) => updateStatusAction.mutate({ id: selectedReport.id, status })}
        />
      )}

      {showResolveModal && selectedReport && (
        <ResolveReportModal
          report={selectedReport}
          resolution={resolution}
          isSubmitting={resolveAction.isPending}
          setResolution={setResolution}
          onResolve={handleResolve}
          onCancel={() => {
            setShowResolveModal(false);
            setResolution('');
          }}
        />
      )}
    </div>
  );
}
