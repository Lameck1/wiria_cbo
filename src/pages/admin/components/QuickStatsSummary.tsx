/**
 * Quick Stats Summary Component
 * Compact summary statistics card for dashboard sidebar
 */

import { DashboardStats } from '@/features/admin/api/dashboard.api';

interface QuickStatsSummaryProps {
    stats: DashboardStats | null;
    isLoading?: boolean;
}

export function QuickStatsSummary({ stats, isLoading = false }: QuickStatsSummaryProps) {
    return (
        <div className="rounded-2xl bg-gradient-to-br from-wiria-blue-dark to-blue-900 p-6 text-white shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Quick Stats</h2>
            {isLoading ? (
                <div className="animate-pulse space-y-3">
                    <div className="h-4 w-3/4 rounded bg-white bg-opacity-20" />
                    <div className="h-4 w-1/2 rounded bg-white bg-opacity-20" />
                    <div className="h-4 w-2/3 rounded bg-white bg-opacity-20" />
                </div>
            ) : stats ? (
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="opacity-80">Total Members</span>
                        <span className="font-bold">{stats.members.total}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="opacity-80">Total Applications</span>
                        <span className="font-bold">{stats.applications.total}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="opacity-80">Published News</span>
                        <span className="font-bold">{stats.news.published}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="opacity-80">Total Tenders</span>
                        <span className="font-bold">{stats.tenders.total}</span>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
