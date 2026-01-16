/**
 * Renewal Components
 * Extracted from MemberRenewalPage for better modularity
 */

import { motion } from 'framer-motion';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import type { RenewalFormSchema } from '@/features/membership/validation';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';

import type { Control} from 'react-hook-form';

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

interface GroupMemberCountCardProps {
    maxCount: number;
    control: Control<RenewalFormSchema>;
}

export function GroupMemberCountCard({ maxCount, control }: GroupMemberCountCardProps) {
    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-6 overflow-hidden"
        >
            <Card className="border-blue-100 bg-blue-50/30">
                <CardBody>
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div>
                            <h3 className="mb-1 text-lg font-bold text-blue-900">
                                Group Member Count
                            </h3>
                            <p className="text-sm text-blue-700">
                                Update your group size to include new members.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end text-right">
                                <span className="text-xs font-bold uppercase text-gray-500">
                                    Last Recorded
                                </span>
                                <span className="font-mono text-xl font-bold text-gray-800">
                                    {maxCount}
                                </span>
                            </div>
                            <div className="h-10 w-px bg-blue-200" />
                            <div className="w-32 text-center">
                                <Controller
                                    name="memberCount"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            className="h-12 text-center text-xl font-bold"
                                            min={1}
                                            onChange={(event) => field.onChange(Number(event.target.value))}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </motion.div>
    );
}

interface FeeBreakdown {
    renewal: { count: number; rate: number; subtotal: number };
    newRegistration: { count: number; rate: number; subtotal: number };
    total: number;
}

interface FeeBreakdownCardProps {
    feeBreakdown: FeeBreakdown;
}

export function FeeBreakdownCard({ feeBreakdown }: FeeBreakdownCardProps) {
    return (
        <div className="mb-8">
            <Card className="border-2 border-gray-100 bg-gray-50">
                <CardBody>
                    <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-900">
                        <svg
                            className="h-4 w-4 text-wiria-blue-dark"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                        Fee Breakdown
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-dashed border-gray-200 py-2">
                            <div className="text-gray-600">
                                <span className="font-medium text-gray-900">Subscription Renewal</span>
                                <p className="text-xs text-gray-500">
                                    {feeBreakdown.renewal.count}{' '}
                                    {feeBreakdown.renewal.count === 1 ? 'member' : 'members'} × KES{' '}
                                    {feeBreakdown.renewal.rate.toLocaleString()}
                                </p>
                            </div>
                            <span className="font-semibold text-gray-900">
                                KES {feeBreakdown.renewal.subtotal.toLocaleString()}
                            </span>
                        </div>

                        {feeBreakdown.newRegistration.count > 0 && (
                            <div className="flex items-center justify-between border-b border-dashed border-gray-200 py-2">
                                <div className="text-gray-600">
                                    <span className="font-medium text-blue-700">
                                        Incremental Registration
                                    </span>
                                    <p className="text-xs text-gray-500">
                                        {feeBreakdown.newRegistration.count} new{' '}
                                        {feeBreakdown.newRegistration.count === 1 ? 'member' : 'members'} ×
                                        KES {feeBreakdown.newRegistration.rate.toLocaleString()}
                                    </p>
                                </div>
                                <span className="font-bold text-blue-700">
                                    KES {feeBreakdown.newRegistration.subtotal.toLocaleString()}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-lg font-bold text-gray-900">Total Due</span>
                            <motion.span
                                key={feeBreakdown.total}
                                initial={{ scale: 1.1, color: '#1e40af' }}
                                animate={{ scale: 1, color: '#1e3a8a' }}
                                className="font-mono text-2xl font-bold text-wiria-blue-dark"
                            >
                                KES {feeBreakdown.total.toLocaleString()}
                            </motion.span>
                        </div>
                    </div>
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
