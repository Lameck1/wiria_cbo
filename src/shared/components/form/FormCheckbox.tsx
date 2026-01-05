/**
 * FormCheckbox Component
 * Single responsibility: Render a styled checkbox with label
 */

import React from 'react';
import { useId } from 'react';

interface FormCheckboxProps {
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: React.ReactNode;
    required?: boolean;
    id?: string;
}

export function FormCheckbox({
    name,
    checked,
    onChange,
    label,
    required = false,
    id,
}: FormCheckboxProps) {
    const autoId = useId();
    const checkboxId = id ?? `${name}-${autoId}`;

    return (
        <div className="flex items-start">
            <input
                id={checkboxId}
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                required={required}
                className="mt-1 mr-3 w-4 h-4"
            />
            <label htmlFor={checkboxId} className="text-sm text-gray-700">{label}</label>
        </div>
    );
}
