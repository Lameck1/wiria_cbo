/**
 * ConsentCheckbox Component
 * Reusable checkbox for terms, policies, and consent agreements
 */

import { InputHTMLAttributes, useId } from 'react';
import { cn } from '@/shared/utils/helpers';

export interface ConsentCheckboxProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    /** Label text for the consent */
    label: string;
    /** Whether the field is required */
    required?: boolean;
    /** Error message to display */
    error?: string;
    /** Ref for the checkbox element */
    ref?: React.Ref<HTMLInputElement>;
}

export function ConsentCheckbox({
    label,
    required,
    error,
    className,
    id: providedId,
    ref,
    ...props
}: ConsentCheckboxProps) {
    const generatedId = useId();
    const inputId = providedId ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
        <div className="space-y-1">
            <div className="flex items-start gap-3">
                <input
                    ref={ref}
                    type="checkbox"
                    id={inputId}
                    className={cn(
                        'mt-1 h-5 w-5 rounded border-gray-300',
                        'text-wiria-blue-dark focus:ring-wiria-blue-dark',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-red-500',
                        className
                    )}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    {...props}
                />
                <label
                    htmlFor={inputId}
                    className={cn(
                        'text-sm leading-tight text-gray-700',
                        props.disabled && 'opacity-50'
                    )}
                >
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            </div>
            {error && (
                <p id={errorId} className="ml-8 text-sm text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
