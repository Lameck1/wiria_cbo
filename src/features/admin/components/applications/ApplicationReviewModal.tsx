import { useState } from 'react';
import { Application, updateApplicationStatus } from '@/features/admin/api/opportunities.api';
import { Button } from '@/shared/components/ui/Button';
import { notificationService } from '@/shared/services/notification/notificationService';
import { Modal } from '@/shared/components/ui/Modal';

interface ApplicationModalProps {
  application: Application;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApplicationReviewModal({ application, onClose, onSuccess }: ApplicationModalProps) {
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      await updateApplicationStatus(application.id, status, notes);
      notificationService.success('Application status updated');
      onSuccess();
    } catch (_error) {
      notificationService.error('Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFullUrl = (path?: string) => {
    if (!path) return '#';
    if (path.startsWith('http')) return path;
    return `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}${path}`;
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Application Review" size="2xl">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-gray-500">Applicant</p>
            <p className="text-lg font-semibold">
              {application.firstName} {application.lastName}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-500">Current Status</p>
            <StatusBadge status={application.status} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-gray-500">Email</p>
            <p className="text-sm">{application.email}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-500">Phone</p>
            <p className="text-sm">{application.phone}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-gray-500">Applied For</p>
          <p className="text-sm font-semibold">
            {application.career?.title || application.opportunity?.title || 'Unknown Position'}
          </p>
        </div>

        <div className="max-h-60 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="mb-2 text-xs font-bold uppercase text-gray-500">Cover Letter / Statement</p>
          <p className="whitespace-pre-wrap text-sm text-gray-700">
            {application.coverLetter || 'No cover letter provided.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="mb-2 text-xs font-bold uppercase text-blue-600">Resume / CV</p>
            {application.resumeUrl ? (
              <a
                href={getFullUrl(application.resumeUrl)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center font-bold text-wiria-blue-dark hover:underline"
              >
                <span className="mr-2">📄</span> View CV
              </a>
            ) : (
              <p className="text-sm italic text-gray-500">No CV provided</p>
            )}
          </div>
          <div className="rounded-xl border border-green-100 bg-green-50 p-4">
            <p className="mb-2 text-xs font-bold uppercase text-green-600">Additional Documents</p>
            {application.additionalDocs && application.additionalDocs.length > 0 ? (
              <div className="space-y-1">
                {application.additionalDocs.map((doc, i) => (
                  <a
                    key={i}
                    href={getFullUrl(doc)}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm font-semibold text-wiria-blue-dark hover:underline"
                  >
                    🔗 Document {i + 1}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-gray-500">None</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="mb-2 text-xs font-bold uppercase text-gray-500">Reviewer Notes</p>
          <textarea
            className="h-24 w-full rounded-lg border p-3 text-sm"
            placeholder="Add private notes about this applicant..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex gap-4 border-t pt-4">
          <label htmlFor="application-status" className="sr-only">
            Application status
          </label>
          <select
            id="application-status"
            className="flex-1 rounded-lg border bg-white p-2 font-semibold"
            value={status}
            onChange={(e) => setStatus(e.target.value as Application['status'])}
          >
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEWED">Interviewed</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <Button onClick={handleReviewUpdate} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Review'}
          </Button>
        </div>
      </div>
    </Modal>
  );

  async function handleReviewUpdate() {
    await handleUpdate();
  }
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    UNDER_REVIEW: 'bg-blue-100 text-blue-700',
    ACCEPTED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    SHORTLISTED: 'bg-purple-100 text-purple-700',
    INTERVIEWED: 'bg-indigo-100 text-indigo-700',
  };
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
}
