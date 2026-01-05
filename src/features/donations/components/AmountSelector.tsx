/**
 * Donation Amount Selector Component
 */

import { motion } from 'framer-motion';

interface AmountSelectorProps {
    selectedAmount: number;
    onAmountChange: (amount: number) => void;
    disabled?: boolean;
}

const suggestedAmounts = [
    { value: 500, label: '500', impact: '5 Youth Kits' },
    { value: 1000, label: '1,000', impact: '10 Handbooks' },
    { value: 2000, label: '2,000', impact: '20 HIV Tests' },
    { value: 5000, label: '5,000', impact: '10 Women Trained' },
    { value: 10000, label: '10,000', impact: 'Community Outreach' },
];

export function AmountSelector({ selectedAmount, onAmountChange, disabled }: AmountSelectorProps) {
    return (
        <div>
            <label className="block text-sm font-semibold text-wiria-blue-dark mb-4">
                Select Amount (KES) <span className="text-red-500">*</span>
            </label>

            {/* Suggested amounts */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                {suggestedAmounts.map((amount) => (
                    <motion.button
                        key={amount.value}
                        type="button"
                        aria-label={amount.label}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAmountChange(amount.value)}
                        disabled={disabled}
                        className={`
                            relative flex flex-col items-center justify-center min-h-[100px] p-2 px-3 rounded-2xl border-2 transition-all duration-300
                            ${selectedAmount === amount.value
                                ? 'border-wiria-yellow bg-wiria-yellow/10 shadow-lg shadow-wiria-yellow/5'
                                : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50'
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        <span className={`text-xl font-extrabold tracking-tight ${selectedAmount === amount.value ? 'text-wiria-blue-dark' : 'text-gray-800'}`}>
                            {amount.label}
                        </span>
                        <span className={`text-[10px] uppercase tracking-widest font-bold mt-2 text-center leading-tight ${selectedAmount === amount.value ? 'text-wiria-blue-dark/70' : 'text-gray-400'}`}>
                            {amount.impact}
                        </span>
                        {selectedAmount === amount.value && (
                            <motion.div
                                layoutId="activeAmountBorder"
                                className="absolute -inset-[2px] border-2 border-wiria-yellow rounded-2xl pointer-events-none ring-4 ring-wiria-yellow/10"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Custom amount */}
            <div className="bg-gray-100/50 p-4 rounded-xl border border-dashed border-gray-300">
                <label htmlFor="customAmount" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                    Or enter a custom amount:
                </label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                        <span className="text-gray-400 font-bold mr-1">KES</span>
                    </div>
                    <input
                        id="customAmount"
                        type="number"
                        min="100"
                        value={selectedAmount}
                        onChange={(e) => onAmountChange(Number(e.target.value))}
                        disabled={disabled}
                        className="block w-full pl-16 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-lg font-semibold text-wiria-blue-dark focus:ring-2 focus:ring-wiria-yellow/30 focus:border-wiria-yellow outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="0.00"
                    />
                </div>
                <p className="mt-2 text-xs text-gray-400 italic">Minimum donation: KES 100</p>
            </div>
        </div>
    );
}
