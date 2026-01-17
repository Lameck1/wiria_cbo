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
      <span className="mb-4 block text-sm font-semibold text-wiria-blue-dark">
        Select Amount (KES) <span className="text-red-500">*</span>
      </span>

      {/* Suggested amounts */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {suggestedAmounts.map((amount) => (
          <motion.button
            key={amount.value}
            type="button"
            aria-label={amount.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAmountChange(amount.value)}
            disabled={disabled}
            className={`relative flex min-h-[100px] flex-col items-center justify-center rounded-2xl border-2 p-2 px-3 transition-all duration-300 ${
              selectedAmount === amount.value
                ? 'border-wiria-yellow bg-wiria-yellow/10 shadow-lg shadow-wiria-yellow/5'
                : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <span
              className={`text-xl font-extrabold tracking-tight ${selectedAmount === amount.value ? 'text-wiria-blue-dark' : 'text-gray-800'}`}
            >
              {amount.label}
            </span>
            <span
              className={`mt-2 text-center text-[10px] font-bold uppercase leading-tight tracking-widest ${selectedAmount === amount.value ? 'text-wiria-blue-dark/70' : 'text-gray-400'}`}
            >
              {amount.impact}
            </span>
            {selectedAmount === amount.value && (
              <motion.div
                layoutId="activeAmountBorder"
                className="pointer-events-none absolute -inset-[2px] rounded-2xl border-2 border-wiria-yellow ring-4 ring-wiria-yellow/10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-100/50 p-4">
        <label
          htmlFor="customAmount"
          className="mb-3 block text-xs font-bold uppercase tracking-widest text-gray-500"
        >
          Or enter a custom amount:
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center">
            <span className="mr-1 font-bold text-gray-400">KES</span>
          </div>
          <input
            id="customAmount"
            type="number"
            min="100"
            value={selectedAmount}
            onChange={(event) => onAmountChange(Number(event.target.value))}
            disabled={disabled}
            className="block w-full rounded-lg border border-gray-200 bg-white py-3 pl-16 pr-4 text-lg font-semibold text-wiria-blue-dark outline-none transition-all focus:border-wiria-yellow focus:ring-2 focus:ring-wiria-yellow/30 disabled:cursor-not-allowed disabled:bg-gray-50"
            placeholder="0.00"
          />
        </div>
        <p className="mt-2 text-xs italic text-gray-400">Minimum donation: KES 100</p>
      </div>
    </div>
  );
}
