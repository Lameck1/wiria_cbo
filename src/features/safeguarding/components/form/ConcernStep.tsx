import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/shared/components/ui/Button';
import { FormField, FormTextareaField } from '@/shared/components/ui/form';

const CONCERN_CATEGORIES = [
  { value: 'CHILD_PROTECTION', label: 'Child Protection', icon: '🧒' },
  { value: 'SEXUAL_EXPLOITATION', label: 'Sexual Exploitation', icon: '⚠️' },
  { value: 'HARASSMENT', label: 'Harassment', icon: '😰' },
  { value: 'DISCRIMINATION', label: 'Discrimination', icon: '🚫' },
  { value: 'FRAUD', label: 'Financial Misconduct', icon: '💰' },
  { value: 'OTHER', label: 'Other Concern', icon: '📋' },
];

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface ConcernStepProps {
  isSubmitting: boolean;
  evidenceFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
  onBack: () => void;
}

export function ConcernStep({
  isSubmitting,
  evidenceFile,
  onFileChange,
  onClearFile,
  onBack,
}: ConcernStepProps) {
  const { watch, setValue } = useFormContext();
  const category = watch('category') as string;

  return (
    <div className="space-y-6">
      <motion.div variants={staggerItem}>
        <span className="mb-1 block text-sm font-medium text-gray-700">
          Category of Concern <span className="text-red-500">*</span>
        </span>
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
          {CONCERN_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setValue('category', cat.value, { shouldValidate: true })}
              disabled={isSubmitting}
              className={`rounded-xl border-2 p-3 text-left transition-all ${category === cat.value
                ? 'border-slate-600 bg-slate-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } disabled:opacity-50`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span
                className={`mt-1 block text-sm font-medium ${category === cat.value ? 'text-slate-700' : 'text-gray-600'}`}
              >
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={staggerItem} className="grid gap-4 md:grid-cols-2">
        <FormField
          label="When did this occur?"
          type="date"
          name="incidentDate"
          disabled={isSubmitting}
        />
        <FormField
          label="Where did this happen?"
          name="location"
          disabled={isSubmitting}
          placeholder="Location or area"
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FormTextareaField
          label="Person(s) Involved"
          name="personsInvolved"
          rows={2}
          disabled={isSubmitting}
          placeholder="Names or descriptions of people involved"
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FormTextareaField
          label="Description"
          name="description"
          rows={5}
          required
          disabled={isSubmitting}
          placeholder="Please describe what happened in detail..."
          description="Minimum 20 characters required"
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <label htmlFor="evidence-file" className="mb-1 block text-sm font-medium text-gray-700">
          Supporting Evidence (Optional)
        </label>
        {evidenceFile ? (
          <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <p className="max-w-[200px] truncate font-medium text-green-800">
                  {evidenceFile.name}
                </p>
                <p className="text-sm text-green-600">{(evidenceFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClearFile}
              className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-100"
            >
              &times;
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              id="evidence-file"
              type="file"
              onChange={onFileChange}
              disabled={isSubmitting}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              accept="image/*,.pdf,.doc,.docx"
            />
            <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition-all hover:border-slate-400 hover:bg-gray-50">
              <p className="font-medium text-gray-600">Click or drag file to upload</p>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div variants={staggerItem} className="flex gap-3 pt-4">
        <Button variant="secondary" onClick={onBack} disabled={isSubmitting} className="flex-1">
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !category}
          className="flex-[2] rounded-xl py-4 shadow-lg"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Button>
      </motion.div>
    </div>
  );
}
