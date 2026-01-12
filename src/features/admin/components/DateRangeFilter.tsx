/**
 * Date Range Filter Component
 */

interface DateRangeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const DATE_RANGES = {
  all: { label: 'All Time', days: null },
  today: { label: 'Today', days: 1 },
  week: { label: 'Last 7 Days', days: 7 },
  month: { label: 'Last 30 Days', days: 30 },
  year: { label: 'This Year', days: 365 },
};

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(DATE_RANGES).map(([key, { label }]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            value === key
              ? 'bg-wiria-blue-dark text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/**
 * Filter data by date range
 */
// eslint-disable-next-line react-refresh/only-export-components
export function filterByDateRange<T extends { createdAt: string }>(data: T[], range: string): T[] {
  const config = DATE_RANGES[range as keyof typeof DATE_RANGES];
  if (!config || !config.days) return data;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - config.days);

  return data.filter((item) => new Date(item.createdAt) >= cutoff);
}
