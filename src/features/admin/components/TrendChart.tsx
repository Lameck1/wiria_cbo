/**
 * Simple Trend Chart Component
 * CSS-only bar chart for displaying trends
 */

import { formatMonth } from '@/shared/utils/dateUtils';

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
      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-2 text-sm font-bold text-gray-700">{title}</h3>
        <div className="py-8 text-center text-gray-400">No data available</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h3 className="mb-4 text-sm font-bold text-gray-700">{title}</h3>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          return (
            <div key={item.month + '-' + index} className="flex flex-1 flex-col items-center">
              <div
                className="flex w-full flex-col items-center justify-end"
                style={{ height: height - 30 }}
              >
                <span className="mb-1 text-xs font-semibold text-gray-600">
                  {formatValue(item.value)}
                </span>
                <div
                  className={`w-full ${color} rounded-t transition-all duration-300`}
                  style={{ height: `${Math.max(barHeight, 5)}%` }}
                />
              </div>
              <span className="mt-1 w-full truncate text-center text-xs text-gray-500">
                {item.label ?? formatMonth(item.month)}
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

export function DashboardTrendCharts({ donationData = [], memberData = [] }: DualTrendChartProps) {
  const formatCurrency = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v.toString());

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <TrendChart
        data={(donationData || []).map((d) => ({ month: d.month, value: d.amount }))}
        title="📈 Donations Trend (Last 6 Months)"
        color="bg-green-500"
        formatValue={formatCurrency}
      />
      <TrendChart
        data={(memberData || []).map((d) => ({ month: d.month, value: d.count }))}
        title="👥 New Members (Last 6 Months)"
        color="bg-blue-500"
      />
    </div>
  );
}
