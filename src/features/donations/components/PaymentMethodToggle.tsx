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
            <label className="block text-sm font-semibold text-wiria-blue-dark mb-4">
                Payment Method <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
                <motion.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onChange('STK_PUSH')}
                    disabled={disabled}
                    className={`
                        relative p-5 rounded-2xl border-2 text-center transition-all duration-200
                        ${selected === 'STK_PUSH'
                            ? 'border-wiria-yellow bg-wiria-yellow/5 shadow-lg shadow-wiria-yellow/10 ring-2 ring-wiria-yellow/20'
                            : 'border-gray-100 bg-white hover:border-wiria-yellow/30 hover:bg-gray-50 shadow-sm'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                >
                    <div className="text-4xl mb-3">📱</div>
                    <div className="font-bold text-wiria-blue-dark">M-Pesa STK Push</div>
                    <div className="text-xs font-medium text-gray-500 mt-1">Instant & Secure</div>

                    {selected === 'STK_PUSH' && (
                        <motion.div
                            layoutId="activePayment"
                            className="absolute -top-2 -right-2 bg-wiria-yellow text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md border-2 border-white"
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
                    className={`
                        relative p-5 rounded-2xl border-2 text-center transition-all duration-200
                        ${selected === 'MANUAL'
                            ? 'border-wiria-yellow bg-wiria-yellow/5 shadow-lg shadow-wiria-yellow/10 ring-2 ring-wiria-yellow/20'
                            : 'border-gray-100 bg-white hover:border-wiria-yellow/30 hover:bg-gray-50 shadow-sm'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                >
                    <div className="text-4xl mb-3">🏦</div>
                    <div className="font-bold text-wiria-blue-dark">Manual Paybill</div>
                    <div className="text-xs font-medium text-gray-500 mt-1">Direct Bank/M-Pesa</div>

                    {selected === 'MANUAL' && (
                        <motion.div
                            layoutId="activePayment"
                            className="absolute -top-2 -right-2 bg-wiria-yellow text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md border-2 border-white"
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
