import { memo } from 'react';
import { motion } from 'framer-motion';
import { PaymentMethodToggle } from '@/features/donations/components/PaymentMethodToggle';
import { PaymentInstructions } from '@/features/donations/components/PaymentInstructions';

interface FeeBreakdown {
    registration: { rate: number; count: number; subtotal: number };
    subscription: { rate: number; count: number; subtotal: number };
    total: number;
}

interface FeeBreakdownSectionProps {
    feeBreakdown: FeeBreakdown;
    totalFee: number;
    paymentMethod: 'STK_PUSH' | 'MANUAL';
    onPaymentMethodChange: (method: 'STK_PUSH' | 'MANUAL') => void;
    isDisabled: boolean;
}

export const FeeBreakdownSection = memo(function FeeBreakdownSection({
    feeBreakdown,
    totalFee,
    paymentMethod,
    onPaymentMethodChange,
    isDisabled,
}: FeeBreakdownSectionProps) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
                <svg
                    className="h-5 w-5 text-wiria-blue-dark"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
                Fee Breakdown
            </h3>

            <div className="mb-8 space-y-4">
                <div className="flex items-center justify-between border-b border-dashed border-gray-200 py-2">
                    <div className="text-gray-600">
                        <span className="font-medium text-gray-900">Registration Fee</span>
                        <p className="text-xs text-gray-500">
                            {feeBreakdown.registration.count}{' '}
                            {feeBreakdown.registration.count === 1 ? 'member' : 'members'} × KES{' '}
                            {feeBreakdown.registration.rate.toLocaleString()}
                        </p>
                    </div>
                    <span className="font-semibold text-gray-900">
                        KES {feeBreakdown.registration.subtotal.toLocaleString()}
                    </span>
                </div>

                <div className="flex items-center justify-between border-b border-dashed border-gray-200 py-2">
                    <div className="text-gray-600">
                        <span className="font-medium text-gray-900">Subscription Fee</span>
                        <p className="text-xs text-gray-500">
                            {feeBreakdown.subscription.count}{' '}
                            {feeBreakdown.subscription.count === 1 ? 'member' : 'members'} × KES{' '}
                            {feeBreakdown.subscription.rate.toLocaleString()}
                        </p>
                    </div>
                    <span className="font-semibold text-gray-900">
                        KES {feeBreakdown.subscription.subtotal.toLocaleString()}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <motion.span
                        key={totalFee}
                        initial={{ scale: 1.1, color: '#1e40af' }}
                        animate={{ scale: 1, color: '#1e3a8a' }}
                        className="font-mono text-2xl font-bold text-wiria-blue-dark"
                    >
                        KES {totalFee.toLocaleString()}
                    </motion.span>
                </div>
            </div>

            <div className="mb-6">
                <PaymentMethodToggle
                    selected={paymentMethod}
                    onChange={onPaymentMethodChange}
                    disabled={isDisabled}
                />
            </div>

            <PaymentInstructions
                paymentMethod={paymentMethod}
                amount={totalFee}
                submitLabel="Complete Registration"
                accountNumber="MEMBERSHIP"
            />
        </div>
    );
});
