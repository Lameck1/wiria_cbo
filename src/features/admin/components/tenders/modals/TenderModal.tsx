import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { uploadFile } from '@/features/admin/api/resources.api';
import { Tender, createTender, updateTender } from '@/features/admin/api/tenders.api';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { notificationService } from '@/shared/services/notification/notificationService';
import { getErrorMessage } from '@/shared/utils/apiUtils';

interface TenderModalProps {
  tender: Tender | null;
  onClose: () => void;
  onSuccess: () => void;
}

function handleArrayChange(
  setter: React.Dispatch<React.SetStateAction<string[]>>,
  index: number,
  value: string
) {
  setter((previous) => {
    const newArray = [...previous];
    newArray[index] = value;
    return newArray;
  });
}

function addArrayItem(setter: React.Dispatch<React.SetStateAction<string[]>>) {
  setter((previous) => [...previous, '']);
}

function removeArrayItem(setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) {
  setter((previous) => previous.filter((_, index_) => index_ !== index));
}

export function TenderModal({ tender, onClose, onSuccess }: TenderModalProps) {
  const queryClient = useQueryClient();
  const [eligibility, setEligibility] = useState<string[]>(
    tender?.eligibility ?? ['Legal registration in Kenya', 'Tax compliance']
  );
  const [docs, setDocs] = useState<string[]>(
    tender?.requiredDocuments ?? ['Certificate of Incorporation', 'KRA PIN/Tax Compliance']
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());

    const fileInput = form.querySelector('#tender-file-input') as HTMLInputElement | null;
    let downloadUrl = (rawData['downloadUrl'] as string) || '';

    try {
      if (fileInput?.files && fileInput.files.length > 0) {
        notificationService.info('Uploading document...');
        const file = fileInput.files[0];
        if (file) {
          const uploadRes = await uploadFile(file, 'tenders');
          downloadUrl = uploadRes.data.url;
        }
      }

      const data = {
        title: rawData['title'] as string,
        refNo: rawData['refNo'] as string,
        category: rawData['category'] as string,
        estimatedValue: rawData['estimatedValue'] as string,
        deadline: new Date(rawData['deadline'] as string).toISOString(),
        status: rawData['status'] as 'OPEN' | 'CLOSED' | 'AWARDED' | 'CANCELLED',
        submissionMethod: rawData['submissionMethod'] as 'ONLINE' | 'PHYSICAL' | 'BOTH',
        submissionEmail: rawData['submissionEmail'] as string,
        contactPerson: rawData['contactPerson'] as string,
        contactPhone: rawData['contactPhone'] as string,
        description: rawData['description'] as string,
        eligibility: eligibility.filter((item: string) => item.trim()),
        requiredDocuments: docs.filter((item: string) => item.trim()),
        downloadUrl,
      };

      if (tender) {
        await updateTender(tender.id, data);
        notificationService.success('Tender updated');
      } else {
        await createTender(data);
        notificationService.success('Tender advertised');
      }
      void queryClient.invalidateQueries({ queryKey: ['tenders'] });
      onSuccess();
    } catch (error: unknown) {
      notificationService.error(getErrorMessage(error, 'Operation failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={tender ? 'Edit Tender' : 'Advertise New Tender'}
      size="3xl"
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="border-b pb-1 font-bold text-wiria-blue-dark">Basic Information</h4>
            <div>
              <label className="mb-1 block text-sm font-bold" htmlFor="tender-title">
                Tender Title *
              </label>
              <input
                id="tender-title"
                name="title"
                defaultValue={tender?.title}
                className="w-full rounded-lg border p-2.5"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-bold" htmlFor="tender-refNo">
                  Reference No *
                </label>
                <input
                  id="tender-refNo"
                  name="refNo"
                  defaultValue={tender?.refNo}
                  className="w-full rounded-lg border p-2.5"
                  required
                  placeholder="WIRIA/2025/..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold" htmlFor="tender-category">
                  Category *
                </label>
                <input
                  id="tender-category"
                  name="category"
                  defaultValue={tender?.category}
                  className="w-full rounded-lg border p-2.5"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-bold" htmlFor="tender-deadline">
                  Deadline *
                </label>
                <input
                  id="tender-deadline"
                  type="datetime-local"
                  name="deadline"
                  defaultValue={
                    tender?.deadline ? new Date(tender.deadline).toISOString().slice(0, 16) : ''
                  }
                  className="w-full rounded-lg border p-2.5"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold" htmlFor="tender-estimatedValue">
                  Est. Value
                </label>
                <input
                  id="tender-estimatedValue"
                  name="estimatedValue"
                  defaultValue={tender?.estimatedValue}
                  className="w-full rounded-lg border p-2.5"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold" htmlFor="tender-status">
                Status
              </label>
              <select
                id="tender-status"
                name="status"
                defaultValue={tender?.status ?? 'OPEN'}
                className="w-full rounded-lg border p-2.5"
              >
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
                <option value="AWARDED">Awarded</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="border-b pb-1 font-bold text-wiria-blue-dark">Submission & Contact</h4>
            <div>
              <label className="mb-1 block text-sm font-bold" htmlFor="tender-submissionMethod">
                Submission Method *
              </label>
              <select
                id="tender-submissionMethod"
                name="submissionMethod"
                defaultValue={tender?.submissionMethod ?? 'ONLINE'}
                className="w-full rounded-lg border p-2.5"
              >
                <option value="ONLINE">Online (Email)</option>
                <option value="PHYSICAL">Physical (Seal Box)</option>
                <option value="BOTH">Both</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold" htmlFor="tender-submissionEmail">
                Submission Email *
              </label>
              <input
                id="tender-submissionEmail"
                type="email"
                name="submissionEmail"
                defaultValue={tender?.submissionEmail ?? 'tenders@wiria.org'}
                className="w-full rounded-lg border p-2.5"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-bold" htmlFor="tender-contactPerson">
                  Contact Person *
                </label>
                <input
                  id="tender-contactPerson"
                  name="contactPerson"
                  defaultValue={tender?.contactPerson}
                  className="w-full rounded-lg border p-2.5"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold" htmlFor="tender-contactPhone">
                  Contact Phone *
                </label>
                <input
                  id="tender-contactPhone"
                  name="contactPhone"
                  defaultValue={tender?.contactPhone}
                  className="w-full rounded-lg border p-2.5"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold" htmlFor="tender-file-input">
                Tender Document (PDF)
              </label>
              <input
                type="file"
                id="tender-file-input"
                className="w-full rounded-lg border p-2 text-sm"
                accept=".pdf,.doc,.docx"
              />
              <input type="hidden" name="downloadUrl" defaultValue={tender?.downloadUrl} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-2 block text-sm font-bold">Eligibility Criteria</h4>
            {eligibility.map((item: string, index: number) => (
              <div key={index} className="mb-2 flex gap-2">
                <input
                  aria-label={`Eligibility criteria ${index + 1}`}
                  value={item}
                  onChange={(event) => handleArrayChange(setEligibility, index, event.target.value)}
                  className="flex-1 rounded-lg border p-2 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(setEligibility, index)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem(setEligibility)}
              className="text-xs font-bold text-blue-600"
            >
              + Add Criteria
            </button>
          </div>
          <div>
            <h4 className="mb-2 block text-sm font-bold">Required Documents</h4>
            {docs.map((item: string, index: number) => (
              <div key={index} className="mb-2 flex gap-2">
                <input
                  aria-label={`Required document ${index + 1}`}
                  value={item}
                  onChange={(event) => handleArrayChange(setDocs, index, event.target.value)}
                  className="flex-1 rounded-lg border p-2 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(setDocs, index)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem(setDocs)}
              className="text-xs font-bold text-blue-600"
            >
              + Add Document
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold" htmlFor="tender-description">
            Full Description *
          </label>
          <textarea
            id="tender-description"
            name="description"
            defaultValue={tender?.description}
            className="h-24 w-full rounded-lg border p-3 text-sm"
            required
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : tender ? 'Update Tender' : 'Advertise Tender'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
