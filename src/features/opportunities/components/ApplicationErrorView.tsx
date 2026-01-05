/**
 * ApplicationErrorView Component
 * Single responsibility: Display error state after form submission failure
 */

interface ApplicationErrorViewProps {
    errorMessage: string;
    onRetry: () => void;
    onClose: () => void;
}

export function ApplicationErrorView({
    errorMessage,
    onRetry,
    onClose
}: ApplicationErrorViewProps) {
    return (
        <div className="text-center py-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Submission Failed</h3>
            <p className="text-gray-600 mb-8">{errorMessage}</p>
            <div className="flex gap-4 justify-center">
                <button
                    onClick={onRetry}
                    className="bg-wiria-blue-dark hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full transition-colors"
                >
                    Try Again
                </button>
                <button
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-full transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
