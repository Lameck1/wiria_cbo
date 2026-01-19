import type { TextareaHTMLAttributes } from 'react';
import { useId } from 'react';

import { cn } from '@/shared/utils/helpers';

/**
 * Props for the Textarea component.
 */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text displayed above the textarea. */
  label?: string;
  /** Error message displayed below the textarea. */
  error?: string;
  /** Helper text displayed below the textarea (if no error). */
  helperText?: string;
  /** Ref for the textarea element. */
  ref?: React.Ref<HTMLTextAreaElement>;
}

/**
 * Form textarea component with label and error handling.
 */
export function Textarea({
  label,
  error,
  helperText,
  className,
  id: providedId,
  ref,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const inputId = providedId ?? generatedId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        ref={ref}
        className={cn(
          'block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400',
          'focus:border-wiria-yellow focus:ring-2 focus:ring-wiria-yellow focus:ring-opacity-50',
          'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
          'transition-colors duration-200',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert" aria-live="assertive">
          {error}
        </p>
      )}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
}
