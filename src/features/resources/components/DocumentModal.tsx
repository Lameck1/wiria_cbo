/**
 * DocumentModal Component
 * Full document details view with PDF preview and download functionality
 */

import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { Modal } from '@/shared/components/ui/Modal';
import { getFullFileUrl, hasValidFileUrl } from '@/shared/utils/getBackendUrl';

import type { Resource } from '../hooks/useResources';

interface DocumentModalProps {
  document: Resource | null;
  isOpen: boolean;
  onClose: () => void;
}

interface DocumentHeaderProps {
  document: Resource;
  formattedDate: string;
  onClose: () => void;
}

interface DocumentPreviewSectionProps {
  isPDF: boolean;
  hasDocument: boolean;
  fullUrl: string;
  title: string;
}

interface DocumentDetailsSectionProps {
  document: Resource;
}

interface DocumentFooterProps {
  hasDocument: boolean;
  onDownload: () => void;
  onClose: () => void;
}

const DocumentHeader = ({ document, formattedDate, onClose }: DocumentHeaderProps) => (
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
    <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
      {document.category}
    </span>
    <h2 className="pr-12 text-2xl font-bold">{document.title}</h2>
    <div className="mt-2 flex items-center gap-3 text-sm text-white/80">
      <span>{document.fileType}</span>
      <span>•</span>
      <span>{document.fileSize}</span>
      <span>•</span>
      <span>Updated {formattedDate}</span>
    </div>
  </div>
);

const DocumentPreviewSection = ({
  isPDF,
  hasDocument,
  fullUrl,
  title,
}: DocumentPreviewSectionProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(true);

  if (!(isPDF && hasDocument)) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">PDF Document</span>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 text-sm font-semibold text-wiria-blue-dark transition-colors hover:text-wiria-yellow"
        >
          {showPreview ? (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
              Hide Preview
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Preview PDF
            </>
          )}
        </button>
      </div>
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 400 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative mt-4 overflow-hidden rounded-lg border border-gray-200"
          >
            {previewLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-wiria-blue-dark/20 border-t-wiria-blue-dark" />
                  <p className="text-sm text-gray-500">Loading preview...</p>
                </div>
              </div>
            )}
            <iframe
              src={`${fullUrl}#view=FitH`}
              className="h-full w-full"
              title={`Preview of ${title}`}
              onLoad={() => setPreviewLoading(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DocumentDetailsSection = ({ document }: DocumentDetailsSectionProps) => (
  <div className="space-y-6">
    <div>
      <h4 className="mb-2 font-semibold text-gray-700">Description</h4>
      <p className="text-gray-600">{document.description}</p>
    </div>
    <div>
      <h4 className="mb-2 font-semibold text-gray-700">Summary</h4>
      <p className="text-gray-600">{document.summary}</p>
    </div>
    {document.keyPoints && document.keyPoints.length > 0 && (
      <div>
        <h4 className="mb-2 font-semibold text-gray-700">Key Points</h4>
        <ul className="space-y-2">
          {document.keyPoints.map((point, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 text-gray-600"
            >
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
              {point}
            </motion.li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const DocumentFooter = ({ hasDocument, onDownload, onClose }: DocumentFooterProps) => (
  <div className="flex flex-col gap-3 border-t px-6 py-6 sm:flex-row">
    {hasDocument ? (
      <motion.button
        onClick={onDownload}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-wiria-blue-dark px-6 py-3 font-bold text-white transition-colors hover:bg-wiria-yellow"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Download Document
      </motion.button>
    ) : (
      <div className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-full bg-gray-100 px-6 py-3 font-semibold text-gray-500">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        No File Available
      </div>
    )}
    <button
      onClick={onClose}
      className="flex-1 rounded-full bg-gray-200 px-6 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-300"
    >
      Close
    </button>
  </div>
);

export function DocumentModal({ document, isOpen, onClose }: DocumentModalProps) {
  if (!isOpen || !document) {
    return null;
  }

  const isPDF = document.fileType?.toUpperCase() === 'PDF';
  const hasDocument = hasValidFileUrl(document.downloadUrl);
  const fullUrl = getFullFileUrl(document.downloadUrl);

  const handleDownload = () => {
    if (!hasDocument) {
      return;
    }
    window.open(fullUrl, '_blank');
  };

  const uploadDate = new Date(document.uploadedAt || document.createdAt);
  const formattedDate = uploadDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" noPadding>
      <DocumentHeader document={document} formattedDate={formattedDate} onClose={onClose} />
      <div className="p-6">
        <DocumentPreviewSection
          isPDF={isPDF}
          hasDocument={hasDocument}
          fullUrl={fullUrl}
          title={document.title}
        />
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
                The file for this document has not been uploaded yet.
              </p>
            </div>
          </div>
        )}
        <DocumentDetailsSection document={document} />
      </div>
      <DocumentFooter hasDocument={hasDocument} onDownload={handleDownload} onClose={onClose} />
    </Modal>
  );
}
