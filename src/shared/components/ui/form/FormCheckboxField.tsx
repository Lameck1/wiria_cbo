import { useFormContext, Controller } from 'react-hook-form';

import { Checkbox } from '../Checkbox';

interface FormCheckboxFieldProps {
  name: string;
  label: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function FormCheckboxField({
  name,
  label,
  className = '',
  disabled = false,
  required = false,
}: FormCheckboxFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, ...field } }) => (
          <Checkbox
            {...field}
            checked={!!value}
            label={label}
            disabled={disabled}
            required={required}
            error={error}
          />
        )}
      />
    </div>
  );
}
