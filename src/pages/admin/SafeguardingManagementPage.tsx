import { useState } from 'react';

import {
  getSafeguardingReports,
  updateSafeguardingReport as updateReport,
  resolveSafeguardingReport as resolveReport,
  SafeguardingReport,
} from '@/features/admin/api/safeguarding.api';
import { AdminPageHeader } from '@/features/admin/components/layout/AdminPageHeader';
import { INCIDENT_TYPES, PRIORITY_COLORS, STATUS_COLORS } from '@/features/admin/components/safeguarding/constants';
import { ReportDetailsModal } from '@/features/admin/components/safeguarding/modals/ReportDetailsModal';
import { ResolveReportModal } from '@/features/admin/components/safeguarding/modals/ResolveReportModal';
import { SafeguardingFilters } from '@/features/admin/components/safeguarding/SafeguardingFilters';
import { getSafeguardingColumns } from '@/features/admin/components/safeguarding/SafeguardingTableColumns';
import { DataTable } from '@/shared/components/ui/DataTable';
import { useAdminData, useAdminAction } from '@/shared/hooks/useAdminData';

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

  const columns = getSafeguardingColumns(
    (r) => setSelectedReport(r),
    (r) => {
      setSelectedReport(r);
      setShowResolveModal(true);
    }
  );

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

      <SafeguardingFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

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
