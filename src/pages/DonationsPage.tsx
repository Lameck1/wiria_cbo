/**
 * Donations Page - Matching Legacy Implementation
 * Updated to match legacy HTML version content, styling, and functionality
 */

import { Layout } from '@/shared/components/layout/Layout';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Spinner } from '@/shared/components/ui/Spinner';
import { AmountSelector } from '@/features/donations/components/AmountSelector';
import { PaymentMethodToggle } from '@/features/donations/components/PaymentMethodToggle';
import { PaymentInstructions } from '@/features/donations/components/PaymentInstructions';
import { DonationImpactSection } from '@/features/donations/components/DonationImpactSection';
import { AlternatePaymentMethods } from '@/features/donations/components/AlternatePaymentMethods';
import { useDonation } from '@/features/donations/hooks/useDonation';
import { usePaymentPoller } from '@/features/donations/hooks/usePaymentPoller';
import { useState, FormEvent } from 'react';
import { formatPhoneNumber } from '@/shared/utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

function DonationsPage() {
    const [formData, setFormData] = useState({
        amount: 1000,
        donorName: '',
        donorEmail: '',
        donorPhone: '',
        paymentMethod: 'STK_PUSH' as 'STK_PUSH' | 'MANUAL',
        manualVerificationPhone: '',
    });

    const {
        initiateDonation,
        checkPaymentStatus,
        verifyManualPayment,
        resetDonation,
        isSubmitting,
        isVerifying,
        isManualPaymentVerified,
        donationId,
        paymentStatus,
    } = useDonation();

    // Poll payment status for STK Push
    usePaymentPoller({
        donationId,
        isActive: paymentStatus === 'PENDING' && formData.paymentMethod === 'STK_PUSH',
        onStatusCheck: checkPaymentStatus,
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // For manual payments, require verification first
        if (formData.paymentMethod === 'MANUAL' && !isManualPaymentVerified) {
            alert('Please verify your payment first.');
            return;
        }

        // Format phone number
        const formattedData = {
            amount: formData.amount,
            donorName: formData.donorName,
            donorEmail: formData.donorEmail,
            donorPhone: formatPhoneNumber(formData.donorPhone),
            purpose: '', // Legacy doesn't have purpose
            isAnonymous: false, // Legacy doesn't have anonymous
            paymentMethod: formData.paymentMethod,
        };

        const result = await initiateDonation(formattedData);

        if (result.success && formData.paymentMethod === 'MANUAL') {
            // For manual payments, show success and reset
            setTimeout(() => {
                if (confirm('Would you like to make another donation?')) {
                    resetDonation();
                    setFormData({
                        amount: 1000,
                        donorName: '',
                        donorEmail: '',
                        donorPhone: '',
                        paymentMethod: 'STK_PUSH',
                        manualVerificationPhone: '',
                    });
                }
            }, 2000);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleVerifyPayment = async () => {
        if (!formData.manualVerificationPhone) {
            alert('Please enter the phone number used for payment');
            return;
        }

        await verifyManualPayment(
            formatPhoneNumber(formData.manualVerificationPhone),
            formData.amount
        );
    };

    const handleStartOver = () => {
        resetDonation();
        setFormData({
            amount: 1000,
            donorName: '',
            donorEmail: '',
            donorPhone: '',
            paymentMethod: 'STK_PUSH',
            manualVerificationPhone: '',
        });
    };

    return (
        <Layout>
            {/* Hero Section - Refined Blue Gradient with Pattern */}
            <section className="relative bg-wiria-blue-dark py-28 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                </div>
                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-wiria-yellow/10 rounded-full blur-3xl -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -ml-48 -mb-48" />

                <div className="container mx-auto px-4 lg:px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-5 py-2 bg-wiria-yellow text-wiria-blue-dark rounded-full text-xs font-bold uppercase tracking-widest mb-8 shadow-lg shadow-wiria-yellow/20">
                                Make an Impact
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
                                Your Support <span className="text-wiria-yellow">Saves Lives</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-100 font-medium leading-relaxed max-w-2xl mx-auto">
                                Join us in our mission to empower communities, enhance health, and champion
                                human rights in Homa Bay County.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Donation Section */}
            <section className="py-20 bg-gray-50 relative -mt-10 rounded-t-[3rem] shadow-2xl z-20">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="max-w-3xl mx-auto">
                        <AnimatePresence mode="wait">
                            {/* Payment Status - Success */}
                            {paymentStatus === 'COMPLETED' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <Card className="mb-12 bg-white border-none shadow-2xl rounded-3xl overflow-hidden">
                                        <div className="h-2 bg-green-500 w-full" />
                                        <CardBody className="p-12">
                                            <div className="text-center">
                                                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">
                                                    ✓
                                                </div>
                                                <h2 className="text-4xl font-black text-wiria-blue-dark mb-6">
                                                    Donation Successful!
                                                </h2>
                                                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                                                    Your generous contribution of{' '}
                                                    <span className="font-bold text-wiria-blue-dark px-2 bg-wiria-yellow/20 rounded">
                                                        KES {formData.amount.toLocaleString()}
                                                    </span>{' '}
                                                    has been received. We are deeply grateful for your support.
                                                </p>
                                                <Button
                                                    onClick={handleStartOver}
                                                    size="lg"
                                                    className="px-10 py-4 bg-wiria-blue-dark text-white rounded-2xl hover:bg-blue-900 transition-all font-bold text-lg"
                                                >
                                                    Make Another Donation
                                                </Button>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Payment Status - Pending STK Push */}
                            {paymentStatus === 'PENDING' && formData.paymentMethod === 'STK_PUSH' && (
                                <motion.div
                                    key="pending"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <Card className="mb-12 bg-white border-none shadow-2xl rounded-3xl overflow-hidden">
                                        <div className="h-2 bg-wiria-yellow w-full" />
                                        <CardBody className="p-10">
                                            <div className="text-center max-w-md mx-auto">
                                                <div className="relative w-24 h-24 mx-auto mb-8">
                                                    <Spinner size="lg" className="absolute inset-0 w-full h-full text-wiria-yellow" />
                                                    <div className="absolute inset-0 flex items-center justify-center text-2xl">
                                                        📱
                                                    </div>
                                                </div>
                                                <h3 className="text-2xl font-black text-wiria-blue-dark mb-4">
                                                    Complete on Your Phone
                                                </h3>
                                                <div className="space-y-4 mb-8 text-left bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                                    <div className="flex items-center gap-4 text-sm font-bold text-wiria-blue-dark">
                                                        <div className="w-6 h-6 rounded-full bg-wiria-yellow flex items-center justify-center text-[10px] text-white">1</div>
                                                        <span>Check your phone for M-Pesa prompt</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm font-bold text-wiria-blue-dark">
                                                        <div className="w-6 h-6 rounded-full bg-wiria-yellow flex items-center justify-center text-[10px] text-white">2</div>
                                                        <span>Enter your M-Pesa PIN</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-white">3</div>
                                                        <span>Wait for confirmation here</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500 animate-pulse">
                                                    Checking payment status securelly...
                                                </p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Donation Form */}
                            {paymentStatus !== 'COMPLETED' && paymentStatus !== 'PENDING' && (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Card className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border-none p-2 sm:p-4">
                                        <CardBody className="p-6 sm:p-12">
                                            <div className="flex flex-col items-center mb-12">
                                                <div className="w-20 h-20 bg-wiria-yellow/10 text-wiria-yellow rounded-2xl flex items-center justify-center text-3xl mb-6 rotate-3 shadow-inner">
                                                    ❤️
                                                </div>
                                                <h2 className="text-4xl font-black text-wiria-blue-dark mb-4 text-center">
                                                    Enter Donation Details
                                                </h2>
                                                <p className="text-gray-500 font-medium">Your information is secure and private.</p>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-8">
                                                {/* Donor Information */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1 bg-gray-50/50 rounded-3xl">
                                                    <Input
                                                        label="Full Name"
                                                        name="donorName"
                                                        value={formData.donorName}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Jane Doe"
                                                        disabled={isSubmitting}
                                                        className="bg-white border-gray-100 rounded-2xl h-14"
                                                    />

                                                    <Input
                                                        type="email"
                                                        label="Email Address"
                                                        name="donorEmail"
                                                        value={formData.donorEmail}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="jane@example.com"
                                                        disabled={isSubmitting}
                                                        className="bg-white border-gray-100 rounded-2xl h-14"
                                                    />
                                                </div>

                                                {/* Amount Selector */}
                                                <div className="pt-4 border-t border-gray-100">
                                                    <AmountSelector
                                                        selectedAmount={formData.amount}
                                                        onAmountChange={(amount) =>
                                                            setFormData((prev) => ({ ...prev, amount }))
                                                        }
                                                        disabled={isSubmitting}
                                                    />
                                                </div>

                                                {/* Payment Method Selection */}
                                                <div className="pt-4 border-t border-gray-100">
                                                    <PaymentMethodToggle
                                                        selected={formData.paymentMethod}
                                                        onChange={(method) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                paymentMethod: method,
                                                            }))
                                                        }
                                                        disabled={isSubmitting}
                                                    />
                                                </div>

                                                {/* STK Push Phone Input */}
                                                <AnimatePresence>
                                                    {formData.paymentMethod === 'STK_PUSH' && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <Input
                                                                label="M-Pesa Phone Number"
                                                                name="donorPhone"
                                                                value={formData.donorPhone}
                                                                onChange={handleChange}
                                                                required
                                                                placeholder="e.g., 254712345678"
                                                                helperText="Format: 2547XXXXXXXX or 2541XXXXXXXX"
                                                                disabled={isSubmitting}
                                                                className="bg-white border-gray-100 rounded-2xl h-14"
                                                            />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Manual Payment Instructions & Verification */}
                                                <AnimatePresence>
                                                    {formData.paymentMethod === 'MANUAL' && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="bg-blue-50/50 p-8 rounded-3xl border-2 border-dashed border-blue-200">
                                                                <h4 className="font-bold text-wiria-blue-dark text-lg mb-6 flex items-center gap-2">
                                                                    <span className="bg-blue-100 p-2 rounded-lg">📋</span> Paybill Instructions
                                                                </h4>
                                                                <PaymentInstructions
                                                                    paymentMethod="MANUAL"
                                                                    amount={formData.amount}
                                                                />

                                                                <div className="space-y-4 mt-10">
                                                                    <p className="text-sm font-bold text-wiria-blue-dark uppercase tracking-wider opacity-60">
                                                                        Verify Your Payment
                                                                    </p>
                                                                    <div className="flex flex-col sm:flex-row gap-4">
                                                                        <input
                                                                            type="text"
                                                                            name="manualVerificationPhone"
                                                                            value={formData.manualVerificationPhone}
                                                                            onChange={handleChange}
                                                                            placeholder="Phone number used..."
                                                                            className="flex-1 px-6 py-4 border-2 border-gray-100 rounded-2xl text-base focus:ring-4 focus:ring-wiria-yellow/10 focus:border-wiria-yellow outline-none transition-all placeholder:text-gray-300"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={handleVerifyPayment}
                                                                            disabled={isVerifying}
                                                                            className="bg-wiria-blue-dark text-white font-black py-4 px-8 rounded-2xl hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
                                                                        >
                                                                            {isVerifying ? <Spinner size="sm" /> : 'Verify'}
                                                                        </button>
                                                                    </div>
                                                                    {isManualPaymentVerified && (
                                                                        <motion.p
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            className="text-sm font-bold text-green-600 bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-2"
                                                                        >
                                                                            <span>✓</span> Payment Verified! You can now complete your donation.
                                                                        </motion.p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Submit Button */}
                                                <Button
                                                    type="submit"
                                                    fullWidth
                                                    size="lg"
                                                    isLoading={isSubmitting}
                                                    className="w-full bg-gradient-to-r from-wiria-blue-dark to-blue-900 text-white font-black py-5 px-8 rounded-2xl hover:translate-y-[-2px] hover:shadow-2xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-4 text-xl group"
                                                >
                                                    {isSubmitting ? (
                                                        'Processing...'
                                                    ) : (
                                                        <>
                                                            <span>Complete Donation</span>
                                                            <svg
                                                                className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={3}
                                                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                                />
                                                            </svg>
                                                        </>
                                                    )}
                                                </Button>

                                                <div className="mt-8 flex items-center justify-center gap-3 text-xs text-gray-400 font-medium">
                                                    <span className="flex items-center gap-1">🔒 SSL Secure</span>
                                                    <span>•</span>
                                                    <span>Powered by M-Pesa Safaricom</span>
                                                </div>
                                            </form>
                                        </CardBody>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Alternate Payment Methods */}
                        {paymentStatus !== 'COMPLETED' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="mt-12"
                            >
                                <AlternatePaymentMethods />
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <DonationImpactSection />
        </Layout>
    );
}

export default DonationsPage;
