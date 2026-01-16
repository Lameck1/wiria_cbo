import { useFormContext, Controller } from 'react-hook-form';

import { cn } from '@/shared/utils/helpers';

import { Input } from '../Input';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  className = '',
  description,
  disabled = false,
  required = false,
}: FormFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;
  const hasError = !!error;

  return (
    <div className={cn('space-y-1.5', className)}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label={label}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            error={hasError ? error : undefined}
            helperText={hasError ? undefined : description}
          />
        )}
      />
    </div>
  );
}
