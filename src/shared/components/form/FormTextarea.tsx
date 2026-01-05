/**
 * FormTextarea Component
 * Single responsibility: Render a styled textarea with optional character count
 * Open/Closed: Extensible via props without modification
 */

import React from 'react';
import { useId } from 'react';

interface FormTextareaProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
    minLength?: number;
    rows?: number;
    placeholder?: string;
    showCharCount?: boolean;
    minCharMessage?: string;
    id?: string;
}

export function FormTextarea({
    label,
    name,
    value,
    onChange,
    required = false,
    minLength,
    rows = 4,
    placeholder,
    showCharCount = false,
    minCharMessage,
    id,
}: FormTextareaProps) {
    const charCount = value.length;
    const isBelowMin = minLength ? charCount < minLength : false;

    const autoId = useId();
    const textareaId = id ?? `${name}-${autoId}`;

    return (
        <div>
            <label htmlFor={textareaId} className="block text-sm font-semibold text-gray-700 mb-2">
                {label} {required && '*'}
            </label>
            <textarea
                id={textareaId}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                minLength={minLength}
                rows={rows}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wiria-yellow focus:border-transparent"
            />
            {showCharCount && minLength && (
                <div className={`text-xs mt-1 ${isBelowMin ? 'text-red-500' : 'text-green-600'}`}>
                    {minCharMessage || `Character count: ${charCount} / ${minLength} minimum`}
                </div>
            )}
        </div>
    );
}
