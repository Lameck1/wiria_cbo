import { useState } from 'react';

import {
  Opportunity,
  createOpportunity,
  updateOpportunity,
} from '@/features/admin/api/opportunities.api';
import { Button } from '@/shared/components/ui/Button';
import { notificationService } from '@/shared/services/notification/notificationService';

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function OpportunityModal({ opportunity, onClose, onSuccess }: OpportunityModalProps) {
  const [responsibilities, setResponsibilities] = useState<string[]>(
    opportunity?.responsibilities ?? ['', '', '']
  );
  const [requirements, setRequirements] = useState<string[]>(
    opportunity?.requirements ?? ['', '', '']
  );
  const [benefits, setBenefits] = useState<string[]>(opportunity?.benefits ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleArrayChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((previous: string[]) => {
      const newArray = [...previous];
      newArray[index] = value;
      return newArray;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    const data = {
      ...rawData,
      responsibilities: responsibilities.filter((r) => r.trim()),
      requirements: requirements.filter((r) => r.trim()),
      benefits: benefits.filter((r) => r.trim()),
    };

    try {
      await (opportunity ? updateOpportunity(opportunity.id, data) : createOpportunity(data));
      notificationService.success('Success');
      onSuccess();
    } catch {
      notificationService.error('Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="animate-in zoom-in-95 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl duration-200">
        <div className="flex items-center justify-between border-b p-8">
          <h3 className="text-2xl font-bold text-gray-800">
            {opportunity ? 'Edit Opportunity' : 'New Opportunity'}
          </h3>
          <button
            onClick={onClose}
            className="text-4xl leading-none text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700" htmlFor="opportunity-title">
                  Title *
                </label>
                <input
                  id="opportunity-title"
                  name="title"
                  defaultValue={opportunity?.title}
                  className="w-full rounded-xl border-gray-200 p-3"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700" htmlFor="opportunity-type">
                  Type *
                </label>
                <select
                  id="opportunity-type"
                  name="type"
                  defaultValue={opportunity?.type}
                  className="w-full rounded-xl border-gray-200 p-3"
                  required
                >
                  <option value="INTERNSHIP">Internship</option>
                  <option value="VOLUNTEER">Volunteer</option>
                  <option value="FELLOWSHIP">Fellowship</option>
                  <option value="ATTACHMENT">Industrial Attachment</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700" htmlFor="opportunity-category">
                  Category *
                </label>
                <input
                  id="opportunity-category"
                  name="category"
                  defaultValue={opportunity?.category}
                  className="w-full rounded-xl border-gray-200 p-3"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700" htmlFor="opportunity-location">
                  Location *
                </label>
                <input
                  id="opportunity-location"
                  name="location"
                  defaultValue={opportunity?.location}
                  className="w-full rounded-xl border-gray-200 p-3"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-700">
                  Responsibilities (One per line) *
                </h4>
                {responsibilities.map((r, index) => (
                  <input
                    key={index}
                    aria-label={`Opportunity responsibility ${index + 1}`}
                    value={r}
                    onChange={(event) => handleArrayChange(setResponsibilities, index, event.target.value)}
                    className="mb-2 w-full rounded-xl border-gray-200 p-3"
                  />
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-700">
                  Requirements (One per line) *
                </h4>
                {requirements.map((r, index) => (
                  <input
                    key={index}
                    aria-label={`Opportunity requirement ${index + 1}`}
                    value={r}
                    onChange={(event) => handleArrayChange(setRequirements, index, event.target.value)}
                    className="mb-2 w-full rounded-xl border-gray-200 p-3"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-700">Benefits (One per line)</h4>
              {benefits.map((b, index) => (
                <input
                  key={index}
                  aria-label={`Benefit ${index + 1}`}
                  value={b}
                  onChange={(event) => handleArrayChange(setBenefits, index, event.target.value)}
                  className="mb-2 w-full rounded-xl border-gray-200 p-3"
                />
              ))}
            </div>

            <div className="flex justify-end gap-4 border-t pt-8">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Publish Opportunity'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
