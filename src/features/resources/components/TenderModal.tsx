/**
 * TenderModal Component
 * Full tender details view with download and submission info
 */

import { useState } from 'react';

import { Modal } from '@/shared/components/ui/Modal';
import { getFullFileUrl, hasValidFileUrl } from '@/shared/utils/getBackendUrl';

import { TenderFooter } from './tender-modal/TenderFooter';
import { TenderInfoGrid } from './tender-modal/TenderInfoGrid';
import { TenderPdfPreview } from './tender-modal/TenderPdfPreview';
import { TenderSubmissionInfo } from './tender-modal/TenderSubmissionInfo';


import type { Tender } from '../hooks/useTenders';

interface TenderModalProps {
  tender: Tender | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TenderModal({ tender, isOpen, onClose }: TenderModalProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(true);

  if (!isOpen || !tender) return null;

  const isPDF = true; // Tender documents are typically PDFs
  const hasDocument = hasValidFileUrl(tender.downloadUrl);
  const fullUrl = getFullFileUrl(tender.downloadUrl);

  const handleDownload = () => {
    if (!hasDocument) return;
    window.open(getFullFileUrl(tender.downloadUrl), '_blank');
  };

  const deadlineDate = new Date(tender.deadline);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" noPadding>
      {/* Header */}
      <div className="relative flex-shrink-0 bg-gradient-to-r from-wiria-blue-dark to-blue-700 p-6 text-white">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close modal"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Ref Number Badge */}
        <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 font-mono text-xs backdrop-blur-sm">
          {tender.refNo}
        </span>

        {/* Title */}
        <h2 className="pr-12 text-2xl font-bold">{tender.title}</h2>

        {/* Category & Status */}
        <div className="mt-2 flex items-center gap-3 text-sm text-white/80">
          <span>{tender.category}</span>
          <span>•</span>
          <span className={tender.status === 'OPEN' ? 'text-green-300' : 'text-gray-300'}>
            {tender.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* PDF Preview Toggle - Only show if document exists */}
        <TenderPdfPreview
          isPDF={isPDF}
          hasDocument={hasDocument}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          previewLoading={previewLoading}
          setPreviewLoading={setPreviewLoading}
          fullUrl={fullUrl}
          tenderTitle={tender.title}
        />

        {/* No Document Warning */}
        {!hasDocument && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <svg
              className="h-6 w-6 flex-shrink-0 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="font-semibold text-yellow-800">Document Pending Upload</p>
              <p className="text-sm text-yellow-600">
                The file for this tender has not been uploaded yet.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Key Info Grid */}
          <TenderInfoGrid tender={tender} deadlineDate={deadlineDate} />

          {/* Description */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-700">Description</h4>
            <p className="text-gray-600">{tender.description}</p>
          </div>

          {/* Eligibility */}
          {tender.eligibility && tender.eligibility.length > 0 && (
            <div>
              <h4 className="mb-2 font-semibold text-gray-700">Eligibility Requirements</h4>
              <ul className="space-y-2">
                {tender.eligibility.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-wiria-yellow"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Documents */}
          {tender.requiredDocuments && tender.requiredDocuments.length > 0 && (
            <div>
              <h4 className="mb-2 font-semibold text-gray-700">Required Documents</h4>
              <ul className="space-y-2">
                {tender.requiredDocuments.map((document_, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-wiria-blue-dark"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {document_}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Submission Info */}
          <TenderSubmissionInfo tender={tender} />
        </div>
      </div>

      {/* Footer */}
      <TenderFooter hasDocument={hasDocument} onDownload={handleDownload} onClose={onClose} />
    </Modal>
  );
}
