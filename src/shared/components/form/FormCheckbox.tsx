/**
 * FormCheckbox Component

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
        className="mr-3 mt-1 h-4 w-4"
      />
      <label htmlFor={checkboxId} className="text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
}
