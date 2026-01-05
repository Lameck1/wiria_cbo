/**
 * ApplicationSuccessView Component
 * Single responsibility: Display success state after form submission
 */

interface ApplicationSuccessViewProps {
    opportunityTitle: string;
    email: string;
    onClose: () => void;
}

export function ApplicationSuccessView({
    opportunityTitle,
    email,
    onClose
}: ApplicationSuccessViewProps) {
    return (
        <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Application Submitted!</h3>
            <p className="text-gray-600 mb-2">
                Thank you for applying to <strong>{opportunityTitle}</strong>.
            </p>
            <p className="text-sm text-gray-500 mb-8">
                You will receive a confirmation email at <strong>{email}</strong> within 24 hours.
            </p>
            <button
                onClick={onClose}
                className="bg-wiria-blue-dark hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
                Close
            </button>
        </div>
    );
}
