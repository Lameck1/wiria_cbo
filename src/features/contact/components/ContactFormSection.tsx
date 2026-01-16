import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { Form, FormField, FormTextareaField } from '@/shared/components/ui/form';
import { TIMING } from '@/shared/constants/config';
import { cn } from '@/shared/utils/helpers';

import { useContactForm } from '../hooks/useContactForm';
import { ContactFormSchema, contactSchema } from '../validation';

const MESSAGE_MIN_LENGTH = 20;
const MESSAGE_MAX_LENGTH = 2000;

export function ContactFormSection() {
  const { submitContactForm, isSubmitting } = useContactForm();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const onSubmit = async (data: ContactFormSchema) => {
    const now = Date.now();
    if (now - lastSubmitTime < TIMING.SUBMIT_COOLDOWN) {
      return;
    }

    setLastSubmitTime(now);
    const success = await submitContactForm({
      ...data,
      phone: data.phone ?? undefined,
    });
    if (success) {
      setShowSuccess(true);
      setFormKey((previous) => previous + 1);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setShowSuccess(false), TIMING.SUCCESS_MESSAGE_DURATION);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
    >
      <Form
        key={formKey}
        schema={contactSchema}
        onSubmit={onSubmit}
        id="contact-form"
        className="space-y-6"
        resetOnSuccess
      >
        {({ watch }) => {
          const messageValue = watch('message') ?? '';
          const messageLength = messageValue.length;
          const messagePercentage = Math.min((messageLength / MESSAGE_MAX_LENGTH) * 100, 100);

          return (
            <>
              <FormField
                name="name"
                label="Full Name"
                placeholder="Your full name"
                required
                disabled={isSubmitting}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="your.email@example.com"
                  required
                  disabled={isSubmitting}
                />

                <FormField
                  name="phone"
                  label="Phone Number"
                  placeholder="+254 7XX XXX XXX"
                  description="(Optional)"
                  disabled={isSubmitting}
                />
              </div>

              <FormField
                name="subject"
                label="Subject"
                placeholder="What is this regarding?"
                required
                disabled={isSubmitting}
              />

              <div className="relative">
                <FormTextareaField
                  name="message"
                  label="Message"
                  placeholder="Tell us how we can help you..."
                  required
                  disabled={isSubmitting}
                  rows={5}
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
              </div>

              <ContactFormActions isSubmitting={isSubmitting} showSuccess={showSuccess} />
            </>
          );
        }}
      </Form>
    </motion.div>
  );
}

interface ContactFormActionsProps {
  isSubmitting: boolean;
  showSuccess: boolean;
}

function ContactFormActions({ isSubmitting, showSuccess }: ContactFormActionsProps) {
  return (
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
  );
}
