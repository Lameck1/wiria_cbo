import { SafeguardingReport } from '@/features/admin/api/safeguarding.api';
import { Button } from '@/shared/components/ui/Button';

interface ReportDetailsModalProps {
  report: SafeguardingReport;
  statusColors: Record<string, string>;
  priorityColors: Record<string, string>;
  incidentTypes: Record<string, string>;
  onClose: () => void;
  onResolve: () => void;
  onStatusChange: (status: SafeguardingReport['status']) => void;
}

export function ReportDetailsModal({
  report,
  statusColors,
  priorityColors,
  incidentTypes,
  onClose,
  onResolve,
  onStatusChange,
}: ReportDetailsModalProps) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h3 className="font-mono text-xl font-bold">Report: {report.referenceNumber}</h3>
            <div className="mt-1 flex gap-2">
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${priorityColors[report.priority]}`}
              >
                {report.priority}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusColors[report.status]}`}
              >
                {report.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InfoItem
              label="Incident Type"
              value={incidentTypes[report.incidentType] || report.incidentType}
            />
            <InfoItem label="Incident Date" value={formatDate(report.incidentDate)} />
            <InfoItem label="Location" value={report.incidentLocation} />
            <InfoItem label="Reported On" value={formatDate(report.createdAt)} />
            {!report.isAnonymous && (
              <>
                <InfoItem label="Reporter Name" value={report.reporterName} />
                <InfoItem
                  label="Reporter Contact"
                  value={report.reporterEmail || report.reporterPhone || 'N/A'}
                />
              </>
            )}
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Description
            </p>
            <div className="whitespace-pre-wrap rounded-xl border border-gray-100 bg-gray-50 p-4 leading-relaxed text-gray-700">
              {report.description}
            </div>
          </div>
          {report.personsInvolved && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Persons Involved
              </p>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-700">
                {report.personsInvolved}
              </div>
            </div>
          )}
          {report.resolution && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-green-600">
                Final Resolution
              </p>
              <div className="rounded-xl border border-green-100 bg-green-50 p-4 font-medium text-green-800">
                {report.resolution}
              </div>
            </div>
          )}

          {/* Status Update */}
          {report.status !== 'RESOLVED' && report.status !== 'CLOSED' && (
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Update Status
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  ['PENDING', 'UNDER_REVIEW', 'INVESTIGATING'] as SafeguardingReport['status'][]
                ).map((status) => (
                  <button
                    key={status}
                    onClick={() => onStatusChange(status)}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold shadow-sm transition-all ${report.status === status ? statusColors[status] : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50'}`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3 border-t p-6">
          {report.status !== 'RESOLVED' && report.status !== 'CLOSED' && (
            <Button onClick={onResolve}>Mark as Resolved</Button>
          )}
          <Button variant="secondary" onClick={onClose} className="ml-auto">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className="font-semibold text-gray-900">{value || 'N/A'}</p>
    </div>
  );
}
