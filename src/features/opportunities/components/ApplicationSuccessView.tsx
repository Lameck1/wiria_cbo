/**
 * ApplicationSuccessView Component

 */

interface ApplicationSuccessViewProps {
  opportunityTitle: string;
  email: string;
  onClose: () => void;
}

export function ApplicationSuccessView({
  opportunityTitle,
  email,
  onClose,
}: ApplicationSuccessViewProps) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-12 w-12 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="mb-4 text-2xl font-bold text-gray-800">Application Submitted!</h3>
      <p className="mb-2 text-gray-600">
        Thank you for applying to <strong>{opportunityTitle}</strong>.
      </p>
      <p className="mb-8 text-sm text-gray-500">
        You will receive a confirmation email at <strong>{email}</strong> within 24 hours.
      </p>
      <button
        onClick={onClose}
        className="rounded-full bg-wiria-blue-dark px-8 py-3 font-bold text-white transition-colors hover:bg-blue-800"
      >
        Close
      </button>
    </div>
  );
}
