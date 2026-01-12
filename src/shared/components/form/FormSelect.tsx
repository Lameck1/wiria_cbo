/**
 * FormSelect Component

 * Open/Closed: Extensible via props without modification
 */

import React from 'react';
import { useId } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: readonly SelectOption[];
  required?: boolean;
  id?: string;
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  id,
}: FormSelectProps) {
  const autoId = useId();
  const selectId = id ?? `${name}-${autoId}`;

  return (
    <div>
      <label htmlFor={selectId} className="mb-2 block text-sm font-semibold text-gray-700">
        {label} {required && '*'}
      </label>
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-wiria-yellow"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
