/**
 * Renewal Components
 * Extracted from MemberRenewalPage for better modularity
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody } from '@/shared/components/ui/Card';

interface RenewalSuccessProps {
    onNavigate?: () => void;
}

/**
 * Success message displayed after successful renewal
 */
export function RenewalSuccess({ onNavigate }: RenewalSuccessProps) {
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (onNavigate) {
            onNavigate();
        } else {
            navigate('/member-portal');
        }
    };

    return (
        <div className="mx-auto max-w-2xl py-12">
            <Card className="border-none bg-gradient-to-b from-white to-blue-50/30 p-12 text-center shadow-2xl">
                <CardBody>
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 shadow-inner">
                        <svg
                            className="h-12 w-12 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-gray-900">Renewal Complete!</h2>
                    <p className="mb-10 text-lg leading-relaxed text-gray-600">
                        Thank you for renewing your WIRIA membership. Your account has been updated
                        successfully.
                    </p>
                    <Button
                        size="lg"
                        className="h-14 px-12 text-lg shadow-lg"
                        onClick={handleNavigate}
                    >
                        Return to Dashboard
                    </Button>
                </CardBody>
            </Card>
        </div>
    );
}

interface RenewalPendingProps {
    paymentMethod: 'STK_PUSH' | 'MANUAL';
    isSubmitting: boolean;
    onRefresh: () => void;
}

/**
 * Pending payment status indicator
 */
export function RenewalPending({ paymentMethod, isSubmitting, onRefresh }: RenewalPendingProps) {
    return (
        <motion.div
            key="pending"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 text-center"
        >
            <Card className="mx-auto max-w-md border-none p-12 shadow-2xl">
                <CardBody>
                    <div className="relative mb-10">
                        <div
                            className="mx-auto h-24 w-24 animate-spin rounded-full border-4 border-blue-100 border-t-wiria-blue-dark"
                            role="progressbar"
                            aria-label="Processing payment"
                        />
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-wiria-blue-dark">
                            {paymentMethod === 'STK_PUSH' ? 'SMS' : 'Wait'}
                        </div>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-gray-900">Processing Renewal</h3>
                    <p className="mb-8 text-gray-600">
                        {paymentMethod === 'STK_PUSH'
                            ? 'Please complete the payment on your phone by entering your M-Pesa PIN.'
                            : 'We are verifying your transaction. This may take a few moments.'}
                    </p>
                    <Button
                        variant="outline"
                        fullWidth
                        size="lg"
                        onClick={onRefresh}
                        disabled={isSubmitting}
                    >
                        Refresh Status
                    </Button>
                </CardBody>
            </Card>
        </motion.div>
    );
}

interface MembershipStatusCardProps {
    membershipType: string;
    expiresAt?: string;
    daysUntilExpiry?: number | null;
}

/**
 * Card showing current membership status
 */
export function MembershipStatusCard({ membershipType, expiresAt, daysUntilExpiry }: MembershipStatusCardProps) {
    return (
        <Card className="overflow-hidden border-none shadow-md">
            <div className="h-1 bg-wiria-blue-dark" aria-hidden="true" />
            <CardBody>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">
                    Membership Status
                </h3>
                <dl className="space-y-4">
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-600">Member Type</dt>
                        <dd className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                            {membershipType || 'INDIVIDUAL'}
                        </dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-600">Expires On</dt>
                        <dd className="font-bold text-gray-900">
                            {expiresAt ? new Date(expiresAt).toLocaleDateString() : '--'}
                        </dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-600">Days Remaining</dt>
                        <dd
                            className={`font-mono font-bold ${daysUntilExpiry != null && daysUntilExpiry <= 30 ? 'text-red-500' : 'text-green-600'
                                }`}
                        >
                            {daysUntilExpiry ?? '--'}
                        </dd>
                    </div>
                </dl>
            </CardBody>
        </Card>
    );
}

interface TotalAmountCardProps {
    total: number;
}

/**
 * Card showing the total amount due
 */
export function TotalAmountCard({ total }: TotalAmountCardProps) {
    return (
        <div className="relative flex flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-wiria-blue-dark to-blue-900 p-8 text-white shadow-xl">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" aria-hidden="true" />
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-100">
                Total Amount Due
            </p>
            <p className="mb-2 text-5xl font-bold" aria-live="polite">
                KES {total.toLocaleString()}
            </p>
            <p className="text-xs italic text-blue-200">Renewal for the next 12 months</p>
        </div>
    );
}
