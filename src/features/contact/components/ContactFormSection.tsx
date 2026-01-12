import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContactForm } from '../hooks/useContactForm';
import { FormField, Input, TextArea } from '@/shared/components/ui/Form';
import { cn } from '@/shared/utils/helpers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactFormSchema } from '../validation';

const MESSAGE_MIN_LENGTH = 20;
const MESSAGE_MAX_LENGTH = 2000;

export function ContactFormSection() {
  const { submitContactForm, isSubmitting } = useContactForm();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, touchedFields, isSubmitSuccessful },
  } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSubmitSuccessful) {
      setShowSuccess(true);
      reset();
      timer = setTimeout(() => setShowSuccess(false), 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSubmitSuccessful, reset]);

  const onSubmit = async (data: ContactFormSchema) => {
    await submitContactForm({
      ...data,
      phone: data.phone || undefined,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d+]/g, '');
    if (val.startsWith('+')) val = '+' + val.slice(1).replace(/\+/g, '');
    setValue('phone', val, { shouldValidate: true });
  };

  const messageValue = watch('message') || '';
  const messageLength = messageValue.length;
  const messagePercentage = Math.min((messageLength / MESSAGE_MAX_LENGTH) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
    >
      <form id="contact-form" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Full Name"
          error={errors.name?.message}
          touched={touchedFields.name}
          required
        >
          <Input
            {...register('name')}
            placeholder="Your full name"
            disabled={isSubmitting}
            hasError={!!errors.name}
            isValid={touchedFields.name && !errors.name}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            label="Email Address"
            error={errors.email?.message}
            touched={touchedFields.email}
            required
          >
            <Input
              type="email"
              {...register('email')}
              placeholder="your.email@example.com"
              disabled={isSubmitting}
              hasError={!!errors.email}
              isValid={touchedFields.email && !errors.email}
            />
          </FormField>

          <FormField
            label="Phone Number"
            error={errors.phone?.message}
            touched={touchedFields.phone}
            helpText="(Optional)"
          >
            <Input
              {...register('phone', { onChange: handlePhoneChange })}
              placeholder="+254 7XX XXX XXX"
              disabled={isSubmitting}
              hasError={!!errors.phone}
              isValid={touchedFields.phone && !errors.phone && !!watch('phone')}
            />
          </FormField>
        </div>

        <FormField
          label="Subject"
          error={errors.subject?.message}
          touched={touchedFields.subject}
          required
        >
          <Input
            {...register('subject')}
            placeholder="What is this regarding?"
            disabled={isSubmitting}
            hasError={!!errors.subject}
            isValid={touchedFields.subject && !errors.subject}
          />
        </FormField>

        <FormField
          label="Message"
          error={errors.message?.message}
          touched={touchedFields.message}
          required
        >
          <TextArea
            {...register('message')}
            rows={5}
            placeholder="Tell us how we can help you..."
            disabled={isSubmitting}
            hasError={!!errors.message}
            isValid={touchedFields.message && !errors.message}
            maxLength={MESSAGE_MAX_LENGTH}
          />
          <div className="absolute bottom-[-24px] right-0 flex items-center gap-2">
            <div className="h-1 w-16 overflow-hidden rounded-full bg-gray-100">
              <motion.div
                className={cn(
                  'h-full',
                  messageLength >= MESSAGE_MIN_LENGTH ? 'bg-green-500' : 'bg-wiria-yellow'
                )}
                initial={{ width: 0 }}
                animate={{ width: `${messagePercentage}%` }}
              />
            </div>
            <span
              className={cn(
                'text-[10px] font-bold',
                messageLength >= MESSAGE_MIN_LENGTH ? 'text-green-600' : 'text-gray-400'
              )}
            >
              {messageLength}/{MESSAGE_MAX_LENGTH}
            </span>
          </div>
        </FormField>

        <div className="sticky bottom-4 z-10 pt-4 lg:static">
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-4 font-bold text-white shadow-lg"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Message Sent Successfully!
              </motion.div>
            ) : (
              <motion.button
                key="submit"
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-wiria-blue-dark to-blue-800 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Send Message
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>
    </motion.div>
  );
}
