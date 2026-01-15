import { ReactNode } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, UseFormReturn, DefaultValues, FieldValues } from 'react-hook-form';
import { z } from 'zod';

interface FormProps<T extends FieldValues> {
    schema: z.ZodType<T>;
    defaultValues?: DefaultValues<T>;
    children: (methods: UseFormReturn<T>) => ReactNode;
    onSubmit: (data: T) => void | Promise<void>;
    className?: string;
    id?: string;
}

export function Form<T extends FieldValues>({
    schema,
    defaultValues,
    children,
    onSubmit,
    className = '',
    id,
}: FormProps<T>) {
    const methods = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues,
        mode: 'onBlur', // Validate on blur for better UX
    });

    return (
        <FormProvider {...methods}>
            <form
                id={id}
                onSubmit={(e) => void methods.handleSubmit(onSubmit)(e)}
                className={`space-y-6 ${className}`}
                noValidate
            >
                {children(methods)}
            </form>
        </FormProvider>
    );
}
