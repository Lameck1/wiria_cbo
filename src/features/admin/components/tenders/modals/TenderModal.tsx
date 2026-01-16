import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { uploadFile } from '@/features/admin/api/resources.api';
import type { Tender } from '@/features/admin/api/tenders.api';
import { createTender, updateTender } from '@/features/admin/api/tenders.api';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { notificationService } from '@/shared/services/notification/notificationService';
import { getErrorMessage } from '@/shared/utils/apiUtils';

import {
  TenderBasicInfoFields,
  TenderCriteriaFields,
  TenderSubmissionFields,
} from './TenderFields';

interface TenderModalProps {
  tender: Tender | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface TenderSubmitConfig {
  tender: Tender | null;
  eligibility: string[];
  requiredDocuments: string[];
  queryClient: ReturnType<typeof useQueryClient>;
  onSuccess: () => void;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

function createTenderSubmitHandler({
  tender,
  eligibility,
  requiredDocuments,
  queryClient,
  onSuccess,
  setIsSubmitting,
}: TenderSubmitConfig) {
  return async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());

    const fileInput = form.querySelector<HTMLInputElement>('#tender-file-input');
    let downloadUrl = (rawData['downloadUrl'] as string) || '';

    try {
      if (fileInput?.files && fileInput.files.length > 0) {
        notificationService.info('Uploading document...');
        const file = fileInput.files[0];
        if (file) {
          const uploadResult = await uploadFile(file, 'tenders');
          downloadUrl = uploadResult.data.url;
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
        requiredDocuments: requiredDocuments.filter((item: string) => item.trim()),
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
}

export function TenderModal({ tender, onClose, onSuccess }: TenderModalProps) {
  const queryClient = useQueryClient();
  const [eligibility, setEligibility] = useState<string[]>(
    tender?.eligibility ?? ['Legal registration in Kenya', 'Tax compliance']
  );
  const [requiredDocuments, setRequiredDocuments] = useState<string[]>(
    tender?.requiredDocuments ?? ['Certificate of Incorporation', 'KRA PIN/Tax Compliance']
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = createTenderSubmitHandler({
    tender,
    eligibility,
    requiredDocuments,
    queryClient,
    onSuccess,
    setIsSubmitting,
  });

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={tender ? 'Edit Tender' : 'Advertise New Tender'}
      size="3xl"
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <TenderBasicInfoFields tender={tender} />
          <TenderSubmissionFields tender={tender} />
        </div>

        <TenderCriteriaFields
          eligibility={eligibility}
          requiredDocuments={requiredDocuments}
          setEligibility={setEligibility}
          setRequiredDocuments={setRequiredDocuments}
        />

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
