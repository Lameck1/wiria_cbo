export function AdminErrorFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-red-600">Admin Module Error</h2>
        <p className="mb-4 text-gray-700">
          An error occurred while loading the admin dashboard. Please refresh the page or contact
          support.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

export function MemberErrorFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-red-600">Member Portal Error</h2>
        <p className="mb-4 text-gray-700">
          An error occurred while loading your member portal. Please refresh the page or contact
          support.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

export function PublicErrorFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-red-600">Something went wrong</h2>
        <p className="mb-4 text-gray-700">
          We encountered an error loading this page. Please try refreshing.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-wiria-blue-dark px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
