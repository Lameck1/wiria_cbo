/**
 * Payment Method Selector Component
 */

import { motion } from 'framer-motion';

interface PaymentMethodToggleProps {
  selected: 'STK_PUSH' | 'MANUAL';
  onChange: (method: 'STK_PUSH' | 'MANUAL') => void;
  disabled?: boolean;
}

export function PaymentMethodToggle({ selected, onChange, disabled }: PaymentMethodToggleProps) {
  return (
    <div>
      <span className="mb-4 block text-sm font-semibold text-wiria-blue-dark">
        Payment Method <span className="text-red-500">*</span>
      </span>
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange('STK_PUSH')}
          disabled={disabled}
          className={`relative rounded-2xl border-2 p-5 text-center transition-all duration-200 ${selected === 'STK_PUSH'
              ? 'border-wiria-yellow bg-wiria-yellow/5 shadow-lg shadow-wiria-yellow/10 ring-2 ring-wiria-yellow/20'
              : 'border-gray-100 bg-white shadow-sm hover:border-wiria-yellow/30 hover:bg-gray-50'
            } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <div className="mb-3 text-4xl">📱</div>
          <div className="font-bold text-wiria-blue-dark">M-Pesa STK Push</div>
          <div className="mt-1 text-xs font-medium text-gray-500">Instant & Secure</div>

          {selected === 'STK_PUSH' && (
            <motion.div
              layoutId="activePayment"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-wiria-yellow text-xs text-white shadow-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              ✓
            </motion.div>
          )}
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange('MANUAL')}
          disabled={disabled}
          className={`relative rounded-2xl border-2 p-5 text-center transition-all duration-200 ${selected === 'MANUAL'
              ? 'border-wiria-yellow bg-wiria-yellow/5 shadow-lg shadow-wiria-yellow/10 ring-2 ring-wiria-yellow/20'
              : 'border-gray-100 bg-white shadow-sm hover:border-wiria-yellow/30 hover:bg-gray-50'
            } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <div className="mb-3 text-4xl">🏦</div>
          <div className="font-bold text-wiria-blue-dark">Manual Paybill</div>
          <div className="mt-1 text-xs font-medium text-gray-500">Direct Bank/M-Pesa</div>

          {selected === 'MANUAL' && (
            <motion.div
              layoutId="activePayment"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-wiria-yellow text-xs text-white shadow-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              ✓
            </motion.div>
          )}
        </motion.button>
      </div>
    </div>
  );
}
