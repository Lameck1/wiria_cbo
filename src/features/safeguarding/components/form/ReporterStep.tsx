import { motion, AnimatePresence } from 'framer-motion';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/shared/components/ui/Button';
import { FormField, FormSelectField } from '@/shared/components/ui/form';

const REPORTER_RELATIONS = [
  { value: 'Witness', label: 'Witness' },
  { value: 'Victim', label: 'Victim/Survivor' },
  { value: 'Parent/Guardian', label: 'Parent/Guardian' },
  { value: 'Staff', label: 'Staff Member' },
  { value: 'Volunteer', label: 'Volunteer' },
  { value: 'Community Member', label: 'Community Member' },
  { value: 'Other', label: 'Other' },
];

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface ReporterStepProps {
  isAnonymous: boolean;
  isSubmitting: boolean;
  setIsAnonymous: (value: boolean) => void;
  onNext: () => void;
}

export function ReporterStep({
  isAnonymous,
  isSubmitting,
  setIsAnonymous,
  onNext,
}: ReporterStepProps) {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <motion.div
        variants={staggerItem}
        className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-5"
      >
        <label htmlFor="isAnonymous" className="flex cursor-pointer items-start">
          <input
            {...register('isAnonymous')}
            id="isAnonymous"
            type="checkbox"
            onChange={(event) => setIsAnonymous(event.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-gray-300 text-slate-600 focus:ring-slate-500"
          />
          <span className="ml-3 flex-1">
            <span className="flex items-center gap-2 font-semibold text-gray-800">
              Report Anonymously
              {isAnonymous && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                >
                  Protected
                </motion.span>
              )}
            </span>
            <span className="mt-1 block text-sm text-gray-500">
              Your identity will not be recorded. However, we won't be able to contact you for
              follow-up.
            </span>
          </span>
        </label>

        <AnimatePresence>
          {isAnonymous && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3"
            >
              <p className="flex items-center gap-2 text-sm text-green-700">
                <strong>Your identity is protected.</strong>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {!isAnonymous && (
        <motion.div
          variants={staggerItem}
          className="space-y-4 border-l-4 border-wiria-blue-dark pl-4"
        >
          <h3 className="font-semibold text-wiria-blue-dark">Your Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Your Name"
              name="reporterName"
              disabled={isSubmitting}
              placeholder="Enter your name"
              required
            />
            <FormField
              label="Your Email"
              type="email"
              name="reporterEmail"
              disabled={isSubmitting}
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Phone (Optional)"
              type="tel"
              name="reporterPhone"
              disabled={isSubmitting}
              placeholder="+254 7XX XXX XXX"
            />
            <FormSelectField
              label="Your Relation"
              name="reporterRelation"
              options={REPORTER_RELATIONS}
              disabled={isSubmitting}
            />
          </div>
        </motion.div>
      )}

      <motion.div variants={staggerItem}>
        <Button
          type="button"
          onClick={onNext}
          fullWidth
          className="flex items-center justify-center gap-2 rounded-xl py-4 shadow-lg"
        >
          Continue to Concern Details
        </Button>
      </motion.div>
    </div>
  );
}
