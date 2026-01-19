import { AnimatePresence, motion } from 'framer-motion';

interface TenderPdfPreviewProps {
  isPDF: boolean;
  hasDocument: boolean;
  showPreview: boolean;
  setShowPreview: (value: boolean) => void;
  previewLoading: boolean;
  setPreviewLoading: (value: boolean) => void;
  fullUrl: string;
  tenderTitle: string;
}

export const TenderPdfPreview = ({
  isPDF,
  hasDocument,
  showPreview,
  setShowPreview,
  previewLoading,
  setPreviewLoading,
  fullUrl,
  tenderTitle,
}: TenderPdfPreviewProps) => {
  if (!isPDF || !hasDocument) return null;

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
          <span className="text-sm font-medium text-gray-700">Tender Document (PDF)</span>
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
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
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
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Preview PDF
            </>
          )}
        </button>
      </div>

      {/* PDF Preview Iframe */}
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
              title={`Preview of ${tenderTitle}`}
              onLoad={() => setPreviewLoading(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
