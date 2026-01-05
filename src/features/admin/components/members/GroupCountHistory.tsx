import { useEffect, useState } from 'react';
import { apiClient } from '@/shared/services/api/client';
import { Spinner } from '@/shared/components/ui/Spinner';
import { formatRelativeTime } from '@/shared/utils/dateFormat';

interface HistoryItem {
    id: string;
    oldCount: number;
    newCount: number;
    reason: string | null;
    createdAt: string;
}

interface GroupCountHistoryProps {
    memberId: string;
}

export function GroupCountHistory({ memberId }: GroupCountHistoryProps) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await apiClient.get<{ data: HistoryItem[] }>(`/admin/members/${memberId}/history`);
                setHistory(response.data || []);
            } catch (error) {
                console.error('Failed to fetch group history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [memberId]);

    if (isLoading) {
        return (
            <div className="flex justify-center py-4">
                <Spinner size="sm" />
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500 text-sm italic">
                No group size history recorded.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {history.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="bg-blue-100 text-blue-700 p-2 rounded-full text-xs font-bold">
                        {item.newCount > item.oldCount ? '↑' : '↓'}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-gray-900">
                                {item.oldCount} → {item.newCount} Members
                            </span>
                            <span className="text-[10px] text-gray-500">
                                {formatRelativeTime(item.createdAt)}
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-1">{item.reason || 'Manual Update'}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
