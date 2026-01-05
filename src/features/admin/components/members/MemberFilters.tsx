
interface MemberFiltersProps {
    currentFilter: string;
    onFilterChange: (filter: string) => void;
    onSearch: (query: string) => void;
}

export function MemberFilters({ currentFilter, onFilterChange, onSearch }: MemberFiltersProps) {
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
            <div className="flex space-x-2 border-b overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onFilterChange(tab.id)}
                        className={`px-6 py-3 font-semibold transition-all border-b-2 whitespace-nowrap ${currentFilter === tab.id
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
                    className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wiria-blue-dark focus:border-transparent"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    );
}
