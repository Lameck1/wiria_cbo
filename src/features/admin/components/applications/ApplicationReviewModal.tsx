import { z } from 'zod';

import type { Application} from '@/features/admin/api/opportunities.api';
import { updateApplicationStatus } from '@/features/admin/api/opportunities.api';
import { Button } from '@/shared/components/ui/Button';
import { Form, FormSelectField, FormTextareaField } from '@/shared/components/ui/form';
import { Modal } from '@/shared/components/ui/Modal';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { notificationService } from '@/shared/services/notification/notificationService';

const reviewSchema = z.object({
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEWED', 'ACCEPTED', 'REJECTED']),
  notes: z.string().optional(),
});

type ReviewSchema = z.infer<typeof reviewSchema>;

interface ApplicationModalProps {
  application: Application;
  onClose: () => void;
  onSuccess: () => void;
}

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'INTERVIEWED', label: 'Interviewed' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'REJECTED', label: 'Rejected' },
];

const getFullUrl = (path?: string) => {
  if (!path) return '#';
  if (path.startsWith('http')) return path;
  const baseUrl = (import.meta.env['VITE_API_BASE_URL'] as string | undefined) ?? '';
  return `${baseUrl.replace('/api', '')}${path}`;
};

export function ApplicationReviewModal({ application, onClose, onSuccess }: ApplicationModalProps) {
  const handleUpdate = async (data: ReviewSchema) => {
    try {
      await updateApplicationStatus(application.id, data.status, data.notes ?? '');
      notificationService.success('Application status updated');
      onSuccess();
    } catch {
      notificationService.error('Failed to update status');
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Application Review" size="2xl">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 border-b border-gray-50 pb-4">
          <div>
            <p className="text-xs font-bold uppercase text-gray-400">Applicant</p>
            <p className="text-lg font-semibold text-wiria-blue-dark">
              {application.firstName} {application.lastName}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-400">Current Status</p>
            <div className="mt-1">
              <StatusBadge status={application.status} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-gray-400">Email</p>
            <p className="text-sm font-medium">{application.email}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-400">Phone</p>
            <p className="text-sm font-medium">{application.phone}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-gray-400">Applied For</p>
          <p className="text-sm font-semibold text-wiria-blue-dark">
            {application.career?.title ?? application.opportunity?.title ?? 'Unknown Position'}
          </p>
        </div>

        <div className="max-h-60 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/50 p-4">
          <p className="mb-2 text-xs font-bold uppercase text-gray-400">Cover Letter / Statement</p>
          <p className="whitespace-pre-wrap text-sm text-gray-700">
            {application.coverLetter ?? 'No cover letter provided.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <p className="mb-2 text-xs font-bold uppercase text-blue-600">Resume / CV</p>
            {application.resumeUrl ? (
              <a
                href={getFullUrl(application.resumeUrl)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-sm font-bold text-wiria-blue-dark hover:underline"
              >
                <span className="mr-2 text-base">📄</span> View CV
              </a>
            ) : (
              <p className="text-sm italic text-gray-400">No CV provided</p>
            )}
          </div>
          <div className="rounded-xl border border-green-100 bg-green-50/50 p-4">
            <p className="mb-2 text-xs font-bold uppercase text-green-600">Additional Documents</p>
            {application.additionalDocs && application.additionalDocs.length > 0 ? (
              <div className="space-y-1">
                {application.additionalDocs.map((document_, index) => (
                  <a
                    key={index}
                    href={getFullUrl(document_)}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm font-semibold text-wiria-blue-dark hover:underline"
                  >
                    🔗 Document {index + 1}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-gray-400">None</p>
            )}
          </div>
        </div>

        <Form
          schema={reviewSchema}
          defaultValues={{
            status: application.status,
            notes: application.notes ?? '',
          }}
          onSubmit={handleUpdate}
          className="border-t border-gray-100 pt-6"
        >
          {({ formState: { isSubmitting } }) => (
            <div className="space-y-4">
              <FormTextareaField
                name="notes"
                label="Reviewer Notes"
                placeholder="Add private notes about this applicant..."
                rows={3}
                disabled={isSubmitting}
              />

              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <FormSelectField
                    name="status"
                    label="Application Status"
                    options={STATUS_OPTIONS}
                    disabled={isSubmitting}
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="h-[42px] px-8">
                  {isSubmitting ? 'Updating...' : 'Update Review'}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    </Modal>
  );
}
