/**
 * Input Component
 * Form input with label, error display, and validation
 */

import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';

import { cn } from '@/shared/utils/helpers';

/**
 * Props for the Input component.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above the input. */
  label?: string;
  /** Error message displayed below the input. Triggers error styling and ARIA attributes. */
  error?: string;
  /** Helper text displayed below the input (if no error). */
  helperText?: string;
  /** Icon displayed on the left side of the input. */
  leftIcon?: ReactNode;
  /** Icon displayed on the right side of the input. */
  rightIcon?: ReactNode;
  /** Ref for the input element. */
  ref?: React.Ref<HTMLInputElement>;
}

/**
 * Form input component with built-in label, error handling, and icon support.
 * Automatically handles accessibility attributes like aria-invalid and aria-describedby.
 */
export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  ref,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = props.id ?? generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const hasError = !!error;
  const describedBy =
    [hasError ? errorId : undefined, helperText ? helperId : undefined].filter(Boolean).join(' ') ||
    undefined;

  const baseInputStyles =
    'block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 transition-colors duration-200';
  const focusStyles =
    'focus:border-wiria-yellow focus:ring-2 focus:ring-wiria-yellow focus:ring-opacity-50';
  const disabledStyles = 'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500';
  const errorStyles = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
  const paddingStyles = cn(leftIcon && 'pl-10', rightIcon && 'pr-10');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</div>
        )}

        <input
          ref={ref}
          className={cn(
            baseInputStyles,
            focusStyles,
            disabledStyles,
            errorStyles,
            paddingStyles,
            className
          )}
          {...props}
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          aria-required={props.required}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{rightIcon}</div>
        )}
      </div>

      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert" aria-live="assertive" aria-atomic="true">
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
