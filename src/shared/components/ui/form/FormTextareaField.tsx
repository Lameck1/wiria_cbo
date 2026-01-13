import { useFormContext, Controller } from 'react-hook-form';
import { Textarea } from '../Textarea';

interface FormTextareaFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    description?: string;
    rows?: number;
}

export function FormTextareaField({
    name,
    label,
    placeholder,
    className = '',
    disabled = false,
    required = false,
    description,
    rows = 4,
}: FormTextareaFieldProps) {
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
                    <Textarea
                        {...field}
                        label={label}
                        placeholder={placeholder}
                        disabled={disabled}
                        required={required}
                        error={error}
                        helperText={description}
                        rows={rows}
                    />
                )}
            />
        </div>
    );
}
