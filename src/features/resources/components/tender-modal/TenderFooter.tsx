interface TenderFooterProps {
  hasDocument: boolean;
  onDownload: () => void;
  onClose: () => void;
}

export const TenderFooter = ({ hasDocument, onDownload, onClose }: TenderFooterProps) => (
  <div className="flex flex-col gap-3 border-t p-6 sm:flex-row">
    {hasDocument ? (
      <button
        onClick={onDownload}
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
        Download Tender Documents
      </button>
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
        No Document Uploaded Yet
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
