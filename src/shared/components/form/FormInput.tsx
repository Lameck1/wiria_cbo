/**
 * FormInput Component

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
      <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-gray-700">
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
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-wiria-yellow"
      />
    </div>
  );
}
