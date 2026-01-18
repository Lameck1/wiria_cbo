import type { ReactNode } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import type { UseFormReturn, DefaultValues, FieldValues } from 'react-hook-form';
import type { z } from 'zod';

interface FormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues?: DefaultValues<T>;
  children: (methods: UseFormReturn<T>) => ReactNode;
  onSubmit: (data: T) => void | Promise<void>;
  className?: string;
  id?: string;
  resetOnSuccess?: boolean;
}

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  children,
  onSubmit,
  className = '',
  id,
  resetOnSuccess = false,
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
        onSubmit={(event) =>
          void methods.handleSubmit(async (data) => {
            await onSubmit(data);
            if (resetOnSuccess) {
              methods.reset();
            }
          })(event)
        }
        className={`space-y-6 ${className}`}
        noValidate
      >
        {children(methods)}
      </form>
    </FormProvider>
  );
}
