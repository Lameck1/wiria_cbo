import { useFormContext, Controller } from 'react-hook-form';

import { Select, SelectOption } from '../Select';

interface FormSelectFieldProps {
    name: string;
    label: string;
    options: readonly SelectOption[];
    className?: string;
    disabled?: boolean;
    required?: boolean;
    description?: string;
}

export function FormSelectField({
    name,
    label,
    options,
    className = '',
    disabled = false,
    required = false,
    description,
}: FormSelectFieldProps) {
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
                render={({ field }) => (
                    <Select
                        {...field}
                        label={label}
                        options={options}
                        disabled={disabled}
                        required={required}
                        error={error}
                        helperText={description}
                    />
                )}
            />
        </div>
    );
}
