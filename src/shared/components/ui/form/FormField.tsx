import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

interface FormFieldProps {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    className?: string;
    description?: ReactNode;
    disabled?: boolean;
}

export function FormField({
    name,
    label,
    type = 'text',
    placeholder,
    className = '',
    description,
    disabled = false,
}: FormFieldProps) {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    return (
        <div className={`space-y-1.5 ${className}`}>
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {label}
            </label>
            <div className="relative">
                <input
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...register(name)}
                    className={`
            flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white
            file:border-0 file:bg-transparent file:text-sm file:font-medium
            placeholder:text-gray-500
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            transition-all duration-200
            ${error ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-200'}
          `}
                />
            </div>
            {description && <p className="text-xs text-gray-500">{description}</p>}
            {error && <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">{error}</p>}
        </div>
    );
}
