/**
 * DocumentCardSkeleton Component
 * Loading skeleton placeholder for document cards
 */

export function DocumentCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-1">
                    <div className="w-20 h-5 bg-gray-200 rounded-full mb-2" />
                    <div className="w-3/4 h-6 bg-gray-200 rounded" />
                </div>
            </div>

            {/* Summary */}
            <div className="space-y-2 mb-4">
                <div className="w-full h-4 bg-gray-200 rounded" />
                <div className="w-2/3 h-4 bg-gray-200 rounded" />
            </div>

            {/* Key Points */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-200 rounded-full" />
                    <div className="w-1/2 h-3 bg-gray-200 rounded" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-200 rounded-full" />
                    <div className="w-2/3 h-3 bg-gray-200 rounded" />
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                    <div className="w-12 h-6 bg-gray-200 rounded" />
                    <div className="w-16 h-6 bg-gray-200 rounded" />
                </div>
                <div className="w-24 h-5 bg-gray-200 rounded" />
            </div>
        </div>
    );
}
