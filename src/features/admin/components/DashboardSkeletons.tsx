export function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border-t-4 border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-3 h-3 w-24 rounded bg-gray-200"></div>
      <div className="h-8 w-16 rounded bg-gray-200"></div>
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((index) => (
        <div key={index} className="animate-pulse rounded-lg bg-gray-50 p-3">
          <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-3 w-1/2 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}

export function DashboardTrendSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-6 h-6 w-48 rounded bg-gray-200"></div>
      <div className="h-64 rounded bg-gray-100"></div>
    </div>
  );
}
