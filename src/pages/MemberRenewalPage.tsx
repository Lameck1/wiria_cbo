import { PortalLayout } from '@/features/membership/components/PortalLayout';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { PaymentMethodToggle } from '@/features/donations/components/PaymentMethodToggle';
import { PaymentInstructions } from '@/features/donations/components/PaymentInstructions';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useMemberData } from '@/features/membership/hooks/useMemberData';
import { useRenewal } from '@/features/membership/hooks/useRenewal';
import { usePaymentPoller } from '@/features/donations/hooks/usePaymentPoller';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPhoneNumber } from '@/shared/utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

const INDIVIDUAL_SUB = 1000;
const INDIVIDUAL_REG = 500;
const GROUP_SUB = 500;
const GROUP_REG = 250;

function MemberRenewalPage() {
    const navigate = useNavigate();
    useAuth();
    const { profile, fetchProfile, daysUntilExpiry } = useMemberData();

    const isGroup = profile?.membershipType === 'GROUP';

    const [memberCount, setMemberCount] = useState(1);
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'STK_PUSH' | 'MANUAL'>('STK_PUSH');
    const [transactionCode, setTransactionCode] = useState('');
    const [consentDataProtection, setConsentDataProtection] = useState(false);
    const [consentCodeOfEthics, setConsentCodeOfEthics] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (profile) {
            setMemberCount(profile.currentMemberCount || 1);
            setPhone(profile.phone || '');
        }
    }, [profile]);

    const {
        submitRenewal,
        checkPaymentStatus,
        isSubmitting,
        paymentStatus,
        transactionId,
    } = useRenewal();

    usePaymentPoller({
        donationId: transactionId,
        isActive: !!transactionId && paymentStatus === 'PENDING',
        onStatusCheck: checkPaymentStatus,
    });

    const maxCount = profile?.maxMemberCountReached || profile?.currentMemberCount || 0;

    const feeBreakdown = useMemo(() => {
        const subRate = isGroup ? GROUP_SUB : INDIVIDUAL_SUB;
        const regRate = isGroup ? GROUP_REG : INDIVIDUAL_REG;

        const renewalCount = isGroup ? memberCount : 1;
        const newRegCount = isGroup ? Math.max(0, memberCount - maxCount) : 0;

        const renewalTotal = renewalCount * subRate;
        const regTotal = newRegCount * regRate;

        return {
            renewal: { count: renewalCount, rate: subRate, subtotal: renewalTotal },
            newRegistration: { count: newRegCount, rate: regRate, subtotal: regTotal },
            total: renewalTotal + regTotal
        };
    }, [memberCount, maxCount, isGroup]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitRenewal({
            paymentMethod,
            phoneNumber: formatPhoneNumber(phone),
            transactionCode: paymentMethod === 'MANUAL' ? transactionCode : undefined,
            memberCount: isGroup ? memberCount : undefined,
            amount: feeBreakdown.total,
        });
    };

    if (paymentStatus === 'SUCCESS') {
        return (
            <PortalLayout title="Renewal Successful">
                <div className="max-w-2xl mx-auto py-12">
                    <Card className="text-center p-12 border-none shadow-2xl bg-gradient-to-b from-white to-blue-50/30">
                        <CardBody>
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Renewal Complete!</h2>
                            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                                Thank you for renewing your WIRIA membership. Your account has been updated successfully.
                            </p>
                            <Button size="lg" className="px-12 h-14 text-lg shadow-lg" onClick={() => navigate('/member-portal')}>
                                Return to Dashboard
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout title="Renew Membership">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    {paymentStatus === 'PENDING' ? (
                        <motion.div key="pending" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
                            <Card className="max-w-md mx-auto p-12 border-none shadow-2xl">
                                <CardBody>
                                    <div className="relative mb-10">
                                        <div className="w-24 h-24 border-4 border-blue-100 border-t-wiria-blue-dark rounded-full animate-spin mx-auto" />
                                        <div className="absolute inset-0 flex items-center justify-center text-wiria-blue-dark font-bold">
                                            {paymentMethod === 'STK_PUSH' ? 'SMS' : 'Wait'}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Processing Renewal</h3>
                                    <p className="text-gray-600 mb-8">
                                        {paymentMethod === 'STK_PUSH'
                                            ? 'Please complete the payment on your phone by entering your M-Pesa PIN.'
                                            : 'We are verifying your transaction. This may take a few moments.'}
                                    </p>
                                    <Button variant="outline" fullWidth size="lg" onClick={() => window.location.reload()} disabled={isSubmitting}>
                                        Refresh Status
                                    </Button>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <Card className="border-none shadow-md overflow-hidden">
                                    <div className="h-1 bg-wiria-blue-dark" />
                                    <CardBody>
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Membership Status</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Member Type</span>
                                                <span className="font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
                                                    {profile?.membershipType || 'INDIVIDUAL'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Expires On</span>
                                                <span className="font-bold text-gray-900">
                                                    {profile?.membershipExpiresAt
                                                        ? new Date(profile.membershipExpiresAt).toLocaleDateString()
                                                        : '--'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Days Remaining</span>
                                                <span className={`font-mono font-bold ${daysUntilExpiry && daysUntilExpiry <= 30 ? 'text-red-500' : 'text-green-600'}`}>
                                                    {daysUntilExpiry ?? '--'}
                                                </span>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="bg-gradient-to-br from-wiria-blue-dark to-blue-900 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                                    <p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-2">Total Amount Due</p>
                                    <p className="text-5xl font-bold mb-2">KES {feeBreakdown.total.toLocaleString()}</p>
                                    <p className="text-blue-200 text-xs italic">Renewal for the next 12 months</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <AnimatePresence>
                                    {isGroup && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mb-6 overflow-hidden">
                                            <Card className="border-blue-100 bg-blue-50/30">
                                                <CardBody>
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-blue-900 mb-1">Group Member Count</h3>
                                                            <p className="text-sm text-blue-700">Update your group size to include new members.</p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-right flex flex-col items-end">
                                                                <span className="text-xs text-gray-500 uppercase font-bold">Last Recorded</span>
                                                                <span className="text-xl font-mono font-bold text-gray-800">{maxCount}</span>
                                                            </div>
                                                            <div className="w-px h-10 bg-blue-200" />
                                                            <div className="w-32">
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    value={memberCount}
                                                                    onChange={(e) => setMemberCount(Math.max(1, parseInt(e.target.value) || 0))}
                                                                    className="text-center font-bold text-xl h-12"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="mb-8">
                                    <Card className="bg-gray-50 border-gray-100 border-2">
                                        <CardBody>
                                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                                                <svg className="w-4 h-4 text-wiria-blue-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                                Fee Breakdown
                                            </h3>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center py-2 border-b border-gray-200 border-dashed">
                                                    <div className="text-gray-600">
                                                        <span className="font-medium text-gray-900">Subscription Renewal</span>
                                                        <p className="text-xs text-gray-500">
                                                            {feeBreakdown.renewal.count} {feeBreakdown.renewal.count === 1 ? 'member' : 'members'} × KES {feeBreakdown.renewal.rate.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <span className="font-semibold text-gray-900">KES {feeBreakdown.renewal.subtotal.toLocaleString()}</span>
                                                </div>

                                                {feeBreakdown.newRegistration.count > 0 && (
                                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 border-dashed">
                                                        <div className="text-gray-600">
                                                            <span className="font-medium text-blue-700">Incremental Registration</span>
                                                            <p className="text-xs text-gray-500">
                                                                {feeBreakdown.newRegistration.count} new {feeBreakdown.newRegistration.count === 1 ? 'member' : 'members'} × KES {feeBreakdown.newRegistration.rate.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <span className="font-bold text-blue-700">KES {feeBreakdown.newRegistration.subtotal.toLocaleString()}</span>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center pt-2">
                                                    <span className="text-lg font-bold text-gray-900">Total Due</span>
                                                    <motion.span
                                                        key={feeBreakdown.total}
                                                        initial={{ scale: 1.1, color: '#1e40af' }}
                                                        animate={{ scale: 1, color: '#1e3a8a' }}
                                                        className="text-2xl font-bold text-wiria-blue-dark font-mono"
                                                    >
                                                        KES {feeBreakdown.total.toLocaleString()}
                                                    </motion.span>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>

                                <Card className="shadow-lg border-none">
                                    <CardBody className="p-8">
                                        <h2 className="text-2xl font-bold text-wiria-blue-dark mb-8">Payment Details</h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    Payment Method
                                                </label>
                                                <PaymentMethodToggle
                                                    selected={paymentMethod}
                                                    onChange={setPaymentMethod}
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div>
                                                {paymentMethod === 'STK_PUSH' ? (
                                                    <Input
                                                        label="M-Pesa Phone Number"
                                                        type="tel"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        placeholder="254700000000"
                                                        helperText="You'll receive a prompt on your phone"
                                                        disabled={isSubmitting}
                                                    />
                                                ) : (
                                                    <Input
                                                        label="Transaction Code"
                                                        value={transactionCode}
                                                        onChange={(e) => setTransactionCode(e.target.value)}
                                                        placeholder="e.g. QWE123RTY"
                                                        required
                                                        helperText="Enter the code from the M-Pesa SMS"
                                                        disabled={isSubmitting}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-6 rounded-2xl mb-8">
                                            <PaymentInstructions
                                                paymentMethod={paymentMethod}
                                                amount={feeBreakdown.total}
                                                submitLabel="Complete Renewal"
                                                accountNumber="MEMBERSHIP_RENEW"
                                            />
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="consentDataProtection"
                                                    checked={consentDataProtection}
                                                    onChange={(e) => setConsentDataProtection(e.target.checked)}
                                                    disabled={isSubmitting}
                                                    className="mt-1 w-5 h-5 rounded border-gray-300 text-wiria-blue-dark focus:ring-wiria-blue-dark"
                                                />
                                                <label htmlFor="consentDataProtection" className="text-sm text-gray-700 leading-tight">
                                                    I consent to the processing of my personal data under the Data Protection Policy.
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="consentCodeOfEthics"
                                                    checked={consentCodeOfEthics}
                                                    onChange={(e) => setConsentCodeOfEthics(e.target.checked)}
                                                    disabled={isSubmitting}
                                                    className="mt-1 w-5 h-5 rounded border-gray-300 text-wiria-blue-dark focus:ring-wiria-blue-dark"
                                                />
                                                <label htmlFor="consentCodeOfEthics" className="text-sm text-gray-700 leading-tight">
                                                    I agree to abide by the WIRIA Code of Ethics and Conduct.
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            fullWidth
                                            size="lg"
                                            isLoading={isSubmitting}
                                            disabled={
                                                !consentDataProtection ||
                                                !consentCodeOfEthics ||
                                                (paymentMethod === 'MANUAL' && !transactionCode)
                                            }
                                            className="h-14 text-lg shadow-xl"
                                        >
                                            Complete Renewal • KES {feeBreakdown.total.toLocaleString()}
                                        </Button>
                                    </CardBody>
                                </Card>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PortalLayout>
    );
}

export default MemberRenewalPage;
