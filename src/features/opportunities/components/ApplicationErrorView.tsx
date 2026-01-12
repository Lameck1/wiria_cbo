/**
 * ApplicationErrorView Component

 */

interface ApplicationErrorViewProps {
  errorMessage: string;
  onRetry: () => void;
  onClose: () => void;
}

export function ApplicationErrorView({
  errorMessage,
  onRetry,
  onClose,
}: ApplicationErrorViewProps) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-12 w-12 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h3 className="mb-4 text-2xl font-bold text-gray-800">Submission Failed</h3>
      <p className="mb-8 text-gray-600">{errorMessage}</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onRetry}
          className="rounded-full bg-wiria-blue-dark px-8 py-3 font-bold text-white transition-colors hover:bg-blue-800"
        >
          Try Again
        </button>
        <button
          onClick={onClose}
          className="rounded-full bg-gray-200 px-8 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}
