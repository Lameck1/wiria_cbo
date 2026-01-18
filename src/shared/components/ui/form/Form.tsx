import type { ReactNode } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import type { DefaultValues, UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';

interface FormProps<TSchema extends z.ZodTypeAny> {
  schema: TSchema;
  defaultValues?: DefaultValues<z.infer<TSchema>>;
  children: (methods: UseFormReturn<z.infer<TSchema>>) => ReactNode;
  onSubmit: (data: z.infer<TSchema>) => void | Promise<void>;
  className?: string;
  id?: string;
  resetOnSuccess?: boolean;
}

export function Form<TSchema extends z.ZodTypeAny>({
  schema,
  defaultValues,
  children,
  onSubmit,
  className = '',
  id,
  resetOnSuccess = false,
}: FormProps<TSchema>) {
  const methods = useForm<z.infer<TSchema>>({
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
