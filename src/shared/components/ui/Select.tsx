import { SelectHTMLAttributes, useId } from 'react';

import { cn } from '@/shared/utils/helpers';

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options?: readonly SelectOption[];
    children?: React.ReactNode;
    ref?: React.Ref<HTMLSelectElement>;
}

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
    const describedBy = [hasError ? errorId : null, helperText && !hasError ? helperId : null]
        .filter(Boolean)
        .join(' ') || undefined;

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
                {...props}
            >
                {children ? children : options?.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">{error}</p>}
            {helperText && !error && (
                <p id={helperId} className="mt-1 text-sm text-gray-500">
                    {helperText}
                </p>
            )}
        </div>
    );
}
