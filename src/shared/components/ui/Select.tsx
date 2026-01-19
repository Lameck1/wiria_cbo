import type { SelectHTMLAttributes } from 'react';
import { useId } from 'react';

import { cn } from '@/shared/utils/helpers';

/**
 * Option for the Select component.
 */
export interface SelectOption {
  /** The value of the option. */
  value: string;
  /** The label to display for the option. */
  label: string;
}

/**
 * Props for the Select component.
 */
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Label text displayed above the select. */
  label?: string;
  /** Error message displayed below the select. */
  error?: string;
  /** Helper text displayed below the select (if no error). */
  helperText?: string;
  /** Array of options to display. Alternatively, use children. */
  options?: readonly SelectOption[];
  /** Custom option elements. */
  children?: React.ReactNode;
  /** Ref for the select element. */
  ref?: React.Ref<HTMLSelectElement>;
}

/**
 * Form select component with label, error handling, and option support.
 */
export function Select({
  label,
  error,
  helperText,
  options,
  className,
  id: providedId,
  ref,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = providedId ?? generatedId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;
  const hasError = !!error;
  const describedBy =
    [hasError ? errorId : null, helperText && !hasError ? helperId : null]
      .filter(Boolean)
      .join(' ') ?? undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        className={cn(
          'block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900',
          'focus:border-wiria-yellow focus:ring-2 focus:ring-wiria-yellow focus:ring-opacity-50',
          'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
          'transition-colors duration-200',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        aria-required={props.required}
        {...props}
      >
        {children ??
          options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert" aria-live="assertive">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
