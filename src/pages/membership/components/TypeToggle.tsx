import { memo } from 'react';

interface MembershipTypeToggleProps {
  value: 'INDIVIDUAL' | 'GROUP';
  onChange: (value: 'INDIVIDUAL' | 'GROUP') => void;
  isDisabled?: boolean;
}

export const MembershipTypeToggle = memo(function MembershipTypeToggle({
  value,
  onChange,
  isDisabled,
}: MembershipTypeToggleProps) {
  return (
    <div className="flex w-fit rounded-xl bg-gray-100 p-1">
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => onChange('INDIVIDUAL')}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
          value === 'INDIVIDUAL'
            ? 'bg-white text-wiria-blue-dark shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Individual
      </button>
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => onChange('GROUP')}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
          value === 'GROUP'
            ? 'bg-white text-wiria-blue-dark shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Group
      </button>
    </div>
  );
});
