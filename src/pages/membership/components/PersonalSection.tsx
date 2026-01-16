import { memo } from 'react';

import { FormField, FormSelectField } from '@/shared/components/ui/form';

interface PersonalInfoSectionProps {
  isDisabled: boolean;
  membershipType: 'INDIVIDUAL' | 'GROUP';
}

export const PersonalInfoSection = memo(function PersonalInfoSection({
  isDisabled,
  membershipType,
}: PersonalInfoSectionProps) {
  return (
    <div>
      <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-wiria-blue-dark text-sm font-bold text-white">
          1
        </span>
        {membershipType === 'GROUP'
          ? 'Primary Contact / Representative Information'
          : 'Personal Information'}
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField name="firstName" label="First Name" disabled={isDisabled} />
        <FormField name="lastName" label="Last Name" disabled={isDisabled} />
        <FormField
          name="dateOfBirth"
          type="date"
          label={membershipType === 'INDIVIDUAL' ? 'Date of Birth *' : 'Date of Birth'}
          disabled={isDisabled}
        />
        <FormSelectField
          name="gender"
          label={membershipType === 'INDIVIDUAL' ? 'Gender *' : 'Gender'}
          disabled={isDisabled}
          options={[
            { value: 'MALE', label: 'Male' },
            { value: 'FEMALE', label: 'Female' },
            { value: 'OTHER', label: 'Other' },
          ]}
        />
        <FormField
          name="nationalId"
          label={
            membershipType === 'GROUP'
              ? 'Group Registration Number (if applicable)'
              : 'National ID Number *'
          }
          disabled={isDisabled}
        />
      </div>
    </div>
  );
});
