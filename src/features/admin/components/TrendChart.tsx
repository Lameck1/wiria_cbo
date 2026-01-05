/**
 * Simple Trend Chart Component
 * CSS-only bar chart for displaying trends
 */

import { formatMonth } from '@/shared/utils/dateFormat';

interface TrendData {
    month: string;
    value: number;
    label?: string;
}

interface TrendChartProps {
    data: TrendData[];
    title: string;
    color?: string;
    formatValue?: (value: number) => string;
    height?: number;
}

export function TrendChart({
    data,
    title,
    color = 'bg-blue-500',
    formatValue = (v) => v.toString(),
    height = 120,
}: TrendChartProps) {
    if (data.length === 0) {
        return (
            <div className="bg-white rounded-xl p-4 shadow">
                <h3 className="text-sm font-bold text-gray-700 mb-2">{title}</h3>
                <div className="text-center text-gray-400 py-8">No data available</div>
            </div>
        );
    }

    const maxValue = Math.max(...data.map((d) => d.value), 1);

    return (
        <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-sm font-bold text-gray-700 mb-4">{title}</h3>
            <div className="flex items-end gap-2" style={{ height }}>
                {data.map((item, index) => {
                    const barHeight = (item.value / maxValue) * 100;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="w-full flex flex-col items-center justify-end" style={{ height: height - 30 }}>
                                <span className="text-xs font-semibold text-gray-600 mb-1">
                                    {formatValue(item.value)}
                                </span>
                                <div
                                    className={`w-full ${color} rounded-t transition-all duration-300`}
                                    style={{ height: `${Math.max(barHeight, 5)}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-500 mt-1 truncate w-full text-center">
                                {item.label || formatMonth(item.month)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

interface DualTrendChartProps {
    donationData: { month: string; amount: number }[];
    memberData: { month: string; count: number }[];
}

export function DashboardTrendCharts({ donationData, memberData }: DualTrendChartProps) {
    const formatCurrency = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v.toString();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <TrendChart
                data={donationData.map((d) => ({ month: d.month, value: d.amount }))}
                title="📈 Donations Trend (Last 6 Months)"
                color="bg-green-500"
                formatValue={formatCurrency}
            />
            <TrendChart
                data={memberData.map((d) => ({ month: d.month, value: d.count }))}
                title="👥 New Members (Last 6 Months)"
                color="bg-blue-500"
            />
        </div>
    );
}
