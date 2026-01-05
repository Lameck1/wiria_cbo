/**
 * TenderCardSkeleton Component
 * Loading skeleton placeholder for tender cards
 */

export function TenderCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="w-24 h-5 bg-gray-200 rounded" />
                <div className="w-16 h-5 bg-gray-200 rounded" />
            </div>

            {/* Title */}
            <div className="w-3/4 h-6 bg-gray-200 rounded mb-2" />

            {/* Category & Value */}
            <div className="flex gap-2 mb-3">
                <div className="w-20 h-6 bg-gray-200 rounded" />
                <div className="w-24 h-6 bg-gray-200 rounded" />
            </div>

            {/* Deadline */}
            <div className="w-40 h-4 bg-gray-200 rounded mb-4" />

            {/* Button */}
            <div className="w-full h-10 bg-gray-200 rounded-lg" />
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
            <td className="py-4 px-4">
                <div className="w-28 h-5 bg-gray-200 rounded" />
            </td>
            <td className="py-4 px-4">
                <div className="w-48 h-5 bg-gray-200 rounded mb-1" />
                <div className="w-32 h-4 bg-gray-200 rounded" />
            </td>
            <td className="py-4 px-4">
                <div className="w-24 h-5 bg-gray-200 rounded mb-1" />
                <div className="w-20 h-4 bg-gray-200 rounded" />
            </td>
            <td className="py-4 px-4 text-center">
                <div className="w-24 h-8 bg-gray-200 rounded-lg mx-auto" />
            </td>
        </tr>
    );
}
