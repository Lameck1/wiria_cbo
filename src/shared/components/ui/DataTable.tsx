import type { ReactNode } from 'react';

import { cn } from '@/shared/utils/helpers';

/**
 * Column definition for the DataTable component.
 */
export interface Column<T> {
  /** The header text to display for the column. */
  header: string;
  /** The key in the data object to access the value. */
  key: string;
  /** Optional custom render function for the cell content. */
  render?: (item: T) => ReactNode;
  /** Optional class name for the cell (th and td). */
  className?: string;
  /** Text alignment for the column. Defaults to 'left'. */
  align?: 'left' | 'center' | 'right';
}

/**
 * Props for the DataTable component.
 */
interface DataTableProps<T> {
  /** Array of column definitions. */
  columns: Column<T>[];
  /** Array of data items to display. */
  data: T[];
  /** If true, shows a loading state. */
  isLoading?: boolean;
  /** Callback function when a row is clicked. */
  onRowClick?: (item: T) => void;
  /** Message to display when there is no data. Defaults to 'No data found.'. */
  emptyMessage?: string;
  /** Optional class name for the table container. */
  className?: string;
  /** Key to use as the unique identifier for each row. Can be a property name or a function. */
  rowKey: keyof T | ((item: T) => string);
  /** Function to determine the class name for a specific row. */
  rowClassName?: (item: T) => string;
}

/**
 * A reusable table component with support for custom rendering, loading states, and row interactions.
 */
export function DataTable<T>({
  columns,
  data,
  isLoading,
  onRowClick,
  emptyMessage = 'No data found.',
  className,
  rowKey,
  rowClassName,
}: DataTableProps<T>) {
  const getRowKey = (item: T): string => {
    if (typeof rowKey === 'function') return rowKey(item);
    return String(item[rowKey]);
  };

  const getRowClassName = (item: T): string => {
    if (typeof rowClassName === 'function') return rowClassName(item);
    return '';
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="border-wiria-blue mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="font-medium text-gray-500">Loading data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm">
        <span className="mb-4 block text-4xl">📂</span>
        <p className="text-lg font-medium text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm',
        className
      )}
    >
      <table className="w-full border-collapse text-left">
        <thead className="border-b border-gray-100 bg-gray-50/50">
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                className={cn(
                  'px-6 py-4 text-sm font-bold uppercase tracking-wider text-gray-700',
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-right',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((item) => (
            <tr
              key={getRowKey(item)}
              onClick={() => onRowClick?.(item)}
              className={cn(
                'group transition-colors',
                onRowClick ? 'hover:bg-wiria-blue/5 cursor-pointer' : 'hover:bg-gray-50/50',
                getRowClassName(item)
              )}
            >
              {columns.map((col, index) => (
                <td
                  key={col.key || index}
                  className={cn(
                    'px-6 py-4 text-sm text-gray-600',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.className
                  )}
                >
                  {col.render ? col.render(item) : (item[col.key as keyof T] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
