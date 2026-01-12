/**
 * DirectContactCard Component
 * Contact information for the safeguarding team
 */

export function DirectContactCard() {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
      <h3 className="mb-4 text-xl font-bold text-red-800">Prefer to Speak Directly?</h3>
      <p className="mb-4 text-red-700">You can contact our Safeguarding Team directly:</p>
      <div className="space-y-3">
        <p className="flex items-center gap-2 text-gray-700">
          <svg
            className="h-5 w-5 flex-shrink-0 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <a href="mailto:safeguarding@wiria.org" className="transition-colors hover:text-red-600">
            safeguarding@wiria.org
          </a>
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <svg
            className="h-5 w-5 flex-shrink-0 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <a href="tel:+254700000000" className="transition-colors hover:text-red-600">
            +254 700 000 000
          </a>
        </p>
      </div>
    </div>
  );
}
