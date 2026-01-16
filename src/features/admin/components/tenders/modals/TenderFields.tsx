import type React from 'react';

import type { Tender } from '@/features/admin/api/tenders.api';

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

export interface TenderBasicInfoFieldsProps {
  tender: Tender | null;
}

export function TenderBasicInfoFields({ tender }: TenderBasicInfoFieldsProps) {
  return (
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
  );
}

export interface TenderSubmissionFieldsProps {
  tender: Tender | null;
}

export function TenderSubmissionFields({ tender }: TenderSubmissionFieldsProps) {
  return (
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
  );
}

export interface TenderCriteriaFieldsProps {
  eligibility: string[];
  requiredDocuments: string[];
  setEligibility: React.Dispatch<React.SetStateAction<string[]>>;
  setRequiredDocuments: React.Dispatch<React.SetStateAction<string[]>>;
}

export function TenderCriteriaFields({
  eligibility,
  requiredDocuments,
  setEligibility,
  setRequiredDocuments,
}: TenderCriteriaFieldsProps) {
  return (
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
        {requiredDocuments.map((item: string, index: number) => (
          <div key={index} className="mb-2 flex gap-2">
            <input
              aria-label={`Required document ${index + 1}`}
              value={item}
              onChange={(event) => handleArrayChange(setRequiredDocuments, index, event.target.value)}
              className="flex-1 rounded-lg border p-2 text-sm"
              required
            />
            <button
              type="button"
              onClick={() => removeArrayItem(setRequiredDocuments, index)}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem(setRequiredDocuments)}
          className="text-xs font-bold text-blue-600"
        >
          + Add Document
        </button>
      </div>
    </div>
  );
}
