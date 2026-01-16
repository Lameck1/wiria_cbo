import { memo } from 'react';

import { motion } from 'framer-motion';

import { FormField } from '@/shared/components/ui/form';

interface GroupRegistrationSectionProps {
  isDisabled: boolean;
}

export const GroupRegistrationSection = memo(function GroupRegistrationSection({
  isDisabled,
}: GroupRegistrationSectionProps) {
  return (
    <motion.div
      key="group-fields"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="space-y-4 overflow-hidden border-b border-gray-100 pb-6"
    >
      <div className="mb-4 flex items-center gap-3 rounded-xl bg-blue-50 p-4">
        <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <p className="text-sm text-blue-800">
          Group registration allows for discounted collective renewals and centralized management.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          name="groupName"
          label="Group Name"
          placeholder="e.g. Unity Youth Group"
          disabled={isDisabled}
        />
        <FormField
          name="memberCount"
          type="number"
          label="Initial Member Count"
          disabled={isDisabled}
        />
      </div>
    </motion.div>
  );
});
