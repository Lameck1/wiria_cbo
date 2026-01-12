/**
 * TenderCardSkeleton Component
 * Loading skeleton placeholder for tender cards
 */

export function TenderCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-5 shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="h-5 w-24 rounded bg-gray-200" />
        <div className="h-5 w-16 rounded bg-gray-200" />
      </div>

      {/* Title */}
      <div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />

      {/* Category & Value */}
      <div className="mb-3 flex gap-2">
        <div className="h-6 w-20 rounded bg-gray-200" />
        <div className="h-6 w-24 rounded bg-gray-200" />
      </div>

      {/* Deadline */}
      <div className="mb-4 h-4 w-40 rounded bg-gray-200" />

      {/* Button */}
      <div className="h-10 w-full rounded-lg bg-gray-200" />
    </div>
  );
}

/**
 * TenderTableRowSkeleton Component
 * Loading skeleton for tender table rows
 */
export function TenderTableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-4">
        <div className="h-5 w-28 rounded bg-gray-200" />
      </td>
      <td className="px-4 py-4">
        <div className="mb-1 h-5 w-48 rounded bg-gray-200" />
        <div className="h-4 w-32 rounded bg-gray-200" />
      </td>
      <td className="px-4 py-4">
        <div className="mb-1 h-5 w-24 rounded bg-gray-200" />
        <div className="h-4 w-20 rounded bg-gray-200" />
      </td>
      <td className="px-4 py-4 text-center">
        <div className="mx-auto h-8 w-24 rounded-lg bg-gray-200" />
      </td>
    </tr>
  );
}
