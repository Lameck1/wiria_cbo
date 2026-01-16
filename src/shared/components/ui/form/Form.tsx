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
        // @ts-expect-error - Zod version mismatch between react-hook-form and zod
        resolver: zodResolver(schema),
        defaultValues,
        mode: 'onBlur', // Validate on blur for better UX
    });

    return (
        <FormProvider {...methods}>
            <form
                id={id}
                onSubmit={(event) => void methods.handleSubmit(onSubmit)(event)}
                className={`space-y-6 ${className}`}
                noValidate
            >
                {children(methods)}
            </form>
        </FormProvider>
    );
}
