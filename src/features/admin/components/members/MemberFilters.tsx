import React, { useState } from 'react';

import { TIMING } from '@/shared/constants/config';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface MemberFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  onSearch: (query: string) => void;
}

export function MemberFilters({ currentFilter, onFilterChange, onSearch }: MemberFiltersProps) {
  const [searchValue, setSearchValue] = useState('');

  // Debounce search value with configured delay
  const debouncedSearchValue = useDebounce(searchValue, TIMING.DEBOUNCE_DEFAULT);

  // Call onSearch when debounced value changes
  React.useEffect(() => {
    onSearch(debouncedSearchValue);
  }, [debouncedSearchValue, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const tabs = [
    { id: 'ALL', label: 'All Members' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'ACTIVE', label: 'Active' },
    { id: 'CANCELLED', label: 'Cancelled' },
    { id: 'EXPIRED', label: 'Expired' },
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`whitespace-nowrap border-b-2 px-6 py-3 font-semibold transition-all ${
              currentFilter === tab.id
                ? 'border-wiria-blue-dark text-wiria-blue-dark'
                : 'border-transparent text-gray-600 hover:text-wiria-blue-dark'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search by name, email, phone, or member number..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-wiria-blue-dark md:w-96"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}
