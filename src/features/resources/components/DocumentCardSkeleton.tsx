/**
 * DocumentCardSkeleton Component
 * Loading skeleton placeholder for document cards
 */

export function DocumentCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6">
      {/* Header */}
      <div className="mb-4 flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-gray-200" />
        <div className="flex-1">
          <div className="mb-2 h-5 w-20 rounded-full bg-gray-200" />
          <div className="h-6 w-3/4 rounded bg-gray-200" />
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
      </div>

      {/* Key Points */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gray-200" />
          <div className="h-3 w-1/2 rounded bg-gray-200" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gray-200" />
          <div className="h-3 w-2/3 rounded bg-gray-200" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex gap-2">
          <div className="h-6 w-12 rounded bg-gray-200" />
          <div className="h-6 w-16 rounded bg-gray-200" />
        </div>
        <div className="h-5 w-24 rounded bg-gray-200" />
      </div>
    </div>
  );
}
