import type { ReactNode } from 'react';

import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Modal } from '@/shared/components/ui/Modal';
import { Select } from '@/shared/components/ui/Select';
import { Textarea } from '@/shared/components/ui/Textarea';

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'date'
  | 'textarea'
  | 'select'
  | 'file';

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormField<T = unknown> {
  name: keyof T;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[]; // For select fields
  accept?: string; // For file fields
  rows?: number; // For textarea fields
  min?: number; // For number/date fields
  max?: number; // For number/date fields
  disabled?: boolean;
  defaultValue?: unknown;
}

// Type alias for backwards compatibility
export type FieldConfig = FormField<Record<string, unknown>>;

export interface FormModalProps<T extends Record<string, unknown>> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void | Promise<void>;
  title: string;
  fields: FormField<T>[];
  initialData?: Partial<T>;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  children?: ReactNode; // For custom fields
}

export function FormModal<T extends Record<string, unknown>>({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  initialData = {},
  isSubmitting = false,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  children,
}: FormModalProps<T>) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: Record<string, unknown> = {};

    fields.forEach((field) => {
      const value = formData.get(field.name as string);
      if (field.type === 'number') {
        data[field.name as string] = value ? Number(value) : undefined;
      } else if (field.type === 'file') {
        data[field.name as string] = value;
      } else {
        data[field.name as string] = value;
      }
    });

    await onSubmit(data as T);
  };

  const renderField = (field: FormField<T>) => {
    const commonProps = {
      name: field.name as string,
      id: field.name as string,
      required: field.required,
      disabled: isSubmitting || field.disabled,
      placeholder: field.placeholder,
      defaultValue: initialData[field.name] as string | number | undefined,
    };

    switch (field.type) {
      case 'textarea': {
        return <Textarea {...commonProps} rows={field.rows ?? 4} />;
      }

      case 'select': {
        return (
          <Select {...commonProps}>
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
      }

      case 'file': {
        return (
          <Input
            {...commonProps}
            type="file"
            accept={field.accept}
            defaultValue={undefined} // Files can't have defaultValue
          />
        );
      }

      case 'number':
      case 'date': {
        return <Input {...commonProps} type={field.type} min={field.min} max={field.max} />;
      }

      default: {
        return <Input {...commonProps} type={field.type} />;
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name as string}>
            <label
              htmlFor={field.name as string}
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {field.label}
              {field.required && <span className="ml-1 text-red-500">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}

        {children}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            {cancelLabel}
          </Button>
          <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
            {isSubmitting ? 'Submitting...' : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
