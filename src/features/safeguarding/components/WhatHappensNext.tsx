/**
 * WhatHappensNext Component
 * Explains the investigation process steps
 */

export function WhatHappensNext() {
    const steps = [
        'Your report is received and logged securely',
        'A safeguarding officer reviews within 24-48 hours',
        'Investigation is conducted as appropriate',
        'Action is taken and you may be notified of outcome',
    ];

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-wiria-blue-dark mb-4">What Happens Next?</h3>
            <ol className="space-y-4">
                {steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                        </span>
                        <span className="text-gray-700">{step}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
}
