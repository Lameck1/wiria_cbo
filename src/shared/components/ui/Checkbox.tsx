import type { InputHTMLAttributes} from 'react';
import { useId } from 'react';

import { cn } from '@/shared/utils/helpers';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string;
    error?: string;
    ref?: React.Ref<HTMLInputElement>;
}

export function Checkbox({
    label,
    error,
    className,
    id: providedId,
    ref,
    ...props
}: CheckboxProps) {
    const generatedId = useId();
    const inputId = providedId ?? generatedId;

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id={inputId}
                    ref={ref}
                    className={cn(
                        'h-4 w-4 rounded border-gray-300 text-wiria-yellow focus:ring-wiria-yellow',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-red-500',
                        className
                    )}
                    {...props}
                />
                <label
                    htmlFor={inputId}
                    className={cn(
                        'text-sm font-medium text-gray-700',
                        props.disabled && 'opacity-50'
                    )}
                >
                    {label}
                    {props.required && <span className="ml-1 text-red-500">*</span>}
                </label>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
