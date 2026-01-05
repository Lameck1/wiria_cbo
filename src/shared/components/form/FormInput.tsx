/**
 * FormInput Component
 * Single responsibility: Render a styled text/email/tel/url input field
 * Open/Closed: Extensible via props without modification
 */

import React from 'react';
import { useId } from 'react';

interface FormInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: 'text' | 'email' | 'tel' | 'url';
    required?: boolean;
    placeholder?: string;
    id?: string;
}

export function FormInput({
    label,
    name,
    value,
    onChange,
    type = 'text',
    required = false,
    placeholder,
    id,
}: FormInputProps) {
    const autoId = useId();
    const inputId = id ?? `${name}-${autoId}`;

    return (
        <div>
            <label htmlFor={inputId} className="block text-sm font-semibold text-gray-700 mb-2">
                {label} {required && '*'}
            </label>
            <input
                id={inputId}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wiria-yellow focus:border-transparent"
            />
        </div>
    );
}
