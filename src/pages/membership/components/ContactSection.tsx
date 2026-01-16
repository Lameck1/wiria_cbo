import { memo } from 'react';

import { FormField } from '@/shared/components/ui/form';

interface ContactLocationSectionProps {
  isDisabled: boolean;
}

export const ContactLocationSection = memo(function ContactLocationSection({
  isDisabled,
}: ContactLocationSectionProps) {
  return (
    <div>
      <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-wiria-blue-dark text-sm font-bold text-white">
          2
        </span>
        Contact & Location
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField name="email" type="email" label="Email Address" disabled={isDisabled} />
        <FormField
          name="phoneNumber"
          label="Phone Number"
          placeholder="0712345678"
          description="Your M-Pesa registered number"
          disabled={isDisabled}
        />
        <FormField name="county" label="County" disabled={isDisabled} />
        <FormField name="subCounty" label="Sub-County" disabled={isDisabled} />
        <FormField name="ward" label="Ward" disabled={isDisabled} />
        <FormField name="village" label="Village" disabled={isDisabled} />
      </div>
    </div>
  );
});
