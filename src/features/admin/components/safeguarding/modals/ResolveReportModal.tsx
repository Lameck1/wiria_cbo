import type { SafeguardingReport } from '@/features/admin/api/safeguarding.api';
import { Button } from '@/shared/components/ui/Button';

interface ResolveReportModalProps {
  report: SafeguardingReport;
  resolution: string;
  isSubmitting: boolean;
  setResolution: (value: string) => void;
  onResolve: () => void;
  onCancel: () => void;
}

export function ResolveReportModal({
  report,
  resolution,
  isSubmitting,
  setResolution,
  onResolve,
  onCancel,
}: ResolveReportModalProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="border-b p-6">
          <h3 className="text-xl font-bold">Resolve Report</h3>
          <p className="mt-1 font-mono text-sm text-gray-500">Ref: {report.referenceNumber}</p>
        </div>
        <div className="p-6">
          <label
            htmlFor="resolution-details"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Resolution Details *
          </label>
          <textarea
            id="resolution-details"
            value={resolution}
            onChange={(event) => setResolution(event.target.value)}
            className="h-40 w-full rounded-xl border border-gray-200 p-4 outline-none transition-all focus:ring-2 focus:ring-wiria-blue-dark"
            placeholder="Please describe how this concern was investigated and resolved in detail..."
            required
          />
          <p className="mt-2 text-[10px] font-medium italic text-gray-400">
            This resolution will be permanently stored and used for audit purposes.
          </p>
        </div>
        <div className="flex gap-3 border-t p-6">
          <Button
            onClick={onResolve}
            disabled={isSubmitting || !resolution.trim()}
            className="flex-1"
          >
            {isSubmitting ? 'Saving Resolution...' : 'Confirm Resolution'}
          </Button>
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
