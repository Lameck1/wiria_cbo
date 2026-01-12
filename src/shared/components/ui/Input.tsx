/**
 * Input Component
 * Form input with label, error display, and validation
 */

import { InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react';
import { cn } from '@/shared/utils/helpers';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = props.id ?? generatedId;

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
              'block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400',
              'focus:border-wiria-yellow focus:ring-2 focus:ring-wiria-yellow focus:ring-opacity-50',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              'transition-colors duration-200',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
            id={inputId}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
