import {
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/utils/helpers';

interface FormFieldProps {
  label: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  children: ReactNode;
  className?: string;
  helpText?: string;
}

export function FormField({
  label,
  error,
  touched,
  required,
  children,
  className,
  helpText,
}: FormFieldProps) {
  const hasError = !!(error && touched);

  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-sm font-bold tracking-tight text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">{children}</div>

      <AnimatePresence mode="wait">
        {hasError ? (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-red-500"
          >
            <span className="rounded-full bg-red-100 p-0.5">
              <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            {error}
          </motion.p>
        ) : helpText ? (
          <p className="mt-1 text-[11px] font-medium text-gray-400">{helpText}</p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  isValid?: boolean;
}

export function Input({ hasError, isValid, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
        !hasError &&
          !isValid &&
          'focus:border-wiria-blue focus:ring-wiria-blue/5 border-gray-200 focus:ring-4',
        hasError &&
          'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10',
        isValid && 'border-green-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10',
        className
      )}
      {...props}
    />
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
  isValid?: boolean;
}

export function TextArea({ hasError, isValid, className, ...props }: TextAreaProps) {
  return (
    <textarea
      className={cn(
        'w-full resize-none rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
        !hasError &&
          !isValid &&
          'focus:border-wiria-blue focus:ring-wiria-blue/5 border-gray-200 focus:ring-4',
        hasError &&
          'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10',
        isValid && 'border-green-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10',
        className
      )}
      {...props}
    />
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  isValid?: boolean;
}

export function Select({ hasError, isValid, className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'w-full appearance-none rounded-xl border bg-no-repeat px-4 py-3 text-gray-900 outline-none transition-all duration-300',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
        !hasError &&
          !isValid &&
          'focus:border-wiria-blue focus:ring-wiria-blue/5 border-gray-200 focus:ring-4',
        hasError &&
          'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10',
        isValid && 'border-green-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10',
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
        backgroundPosition: 'right 1rem center',
        backgroundSize: '1.25rem',
      }}
      {...props}
    >
      {children}
    </select>
  );
}
