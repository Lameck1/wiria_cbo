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
    <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <h3 className="mb-4 text-xl font-bold text-wiria-blue-dark">What Happens Next?</h3>
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
              {index + 1}
            </span>
            <span className="text-gray-700">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
