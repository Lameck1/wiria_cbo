/**
 * OpportunityFilters Component
 * Single responsibility: Filter opportunities by type and category
 */

import { motion } from 'framer-motion';

export type OpportunityTypeFilter = 'ALL' | 'VOLUNTEER' | 'INTERNSHIP';

interface OpportunityFiltersProps {
    selectedType: OpportunityTypeFilter;
    onTypeChange: (type: OpportunityTypeFilter) => void;
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

const TYPE_OPTIONS: { value: OpportunityTypeFilter; label: string; icon: string }[] = [
    { value: 'ALL', label: 'All Types', icon: '📋' },
    { value: 'VOLUNTEER', label: 'Volunteer', icon: '🤝' },
    { value: 'INTERNSHIP', label: 'Internship', icon: '🎓' },
];

export function OpportunityFilters({
    selectedType,
    onTypeChange,
    categories,
    selectedCategory,
    onCategoryChange,
}: OpportunityFiltersProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8"
        >
            {/* Type Filter */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
                {TYPE_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onTypeChange(option.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedType === option.value
                                ? 'bg-wiria-blue-dark text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <span className="mr-1">{option.icon}</span>
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
                <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-wiria-yellow focus:border-transparent bg-white"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            )}
        </motion.div>
    );
}
