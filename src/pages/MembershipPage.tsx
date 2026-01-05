import { Layout } from '@/shared/components/layout/Layout';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useRegistration } from '@/features/membership/hooks/useRegistration';
import { usePaymentPoller } from '@/features/donations/hooks/usePaymentPoller';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, RegistrationFormSchema } from '@/features/membership/validation';
import { formatPhoneNumber } from '@/shared/utils/helpers';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useBackendStatus } from '@/shared/services/backendStatus';
import { UserRole } from '@/shared/types';
import { useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
    MembershipHero,
    OfflineInfoCard,
    RegistrationSuccess,
    PendingPaymentCard,
    FeeBreakdownSection,
    ConsentCheckboxes,
} from './membership/components';

const INDIVIDUAL_REG = 500;
const INDIVIDUAL_SUB = 1000;
const GROUP_REG = 250;
const GROUP_SUB = 500;

function MembershipPage() {
    const { user, isAuthenticated } = useAuth();
    const { isBackendConnected } = useBackendStatus();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user?.role === UserRole.MEMBER) {
            navigate('/member-portal', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<RegistrationFormSchema>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            membershipType: 'INDIVIDUAL',
            memberCount: 1,
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            nationalId: '',
            county: '',
            subCounty: '',
            ward: '',
            village: '',
            agreedToTerms: false,
            consentToDataProcessing: false,
            paymentMethod: 'STK_PUSH',
            gender: undefined,
        },
    });

    const membershipType = watch('membershipType');
    const memberCount = watch('memberCount') || 1;

    const feeBreakdown = useMemo(() => {
        const regRate = membershipType === 'INDIVIDUAL' ? INDIVIDUAL_REG : GROUP_REG;
        const subRate = membershipType === 'INDIVIDUAL' ? INDIVIDUAL_SUB : GROUP_SUB;
        const count = membershipType === 'INDIVIDUAL' ? 1 : memberCount;

        return {
            registration: { rate: regRate, count, subtotal: regRate * count },
            subscription: { rate: subRate, count, subtotal: subRate * count },
            total: (regRate + subRate) * count,
        };
    }, [membershipType, memberCount]);

    const totalFee = feeBreakdown.total;

    useEffect(() => {
        setValue('membershipFee', totalFee);
    }, [totalFee, setValue]);

    const {
        submitRegistration,
        checkPaymentStatus,
        resetRegistration,
        isSubmitting,
        memberId,
        membershipNumber,
        paymentStatus,
    } = useRegistration();

    const paymentMethod = watch('paymentMethod');

    // Poll payment status for STK Push
    usePaymentPoller({
        donationId: memberId,
        isActive: paymentStatus === 'PENDING' && paymentMethod === 'STK_PUSH',
        onStatusCheck: checkPaymentStatus,
    });

    const onSubmit = async (data: RegistrationFormSchema) => {
        const formattedData = {
            ...data,
            phoneNumber: formatPhoneNumber(data.phoneNumber),
        };
        await submitRegistration(formattedData);
    };

    const handleStartOver = () => {
        resetRegistration();
        window.location.reload();
    };

    const isFormDisabled = isSubmitting || paymentStatus === 'PENDING';

    return (
        <Layout>
            <MembershipHero />

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        {/* Backend Offline - Show Info Only */}
                        {!isBackendConnected && <OfflineInfoCard />}

                        {/* Backend Online - Show Registration Form */}
                        {isBackendConnected && (
                            <>
                                {/* Success State */}
                                {paymentStatus === 'COMPLETED' && (
                                    <RegistrationSuccess
                                        membershipNumber={membershipNumber}
                                        onStartOver={handleStartOver}
                                    />
                                )}

                                {/* Pending Payment */}
                                {paymentStatus === 'PENDING' && paymentMethod === 'STK_PUSH' && (
                                    <PendingPaymentCard />
                                )}

                                {/* Registration Form */}
                                {paymentStatus !== 'COMPLETED' && (
                                    <Card className="shadow-2xl border-none">
                                        <CardBody className="p-8">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                                <h2 className="text-2xl font-bold text-wiria-blue-dark">
                                                    Membership Registration
                                                </h2>

                                                {/* Membership Type Toggle */}
                                                <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
                                                    <button
                                                        type="button"
                                                        onClick={() => setValue('membershipType', 'INDIVIDUAL')}
                                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${membershipType === 'INDIVIDUAL'
                                                            ? 'bg-white text-wiria-blue-dark shadow-sm'
                                                            : 'text-gray-500 hover:text-gray-700'
                                                            }`}
                                                    >
                                                        Individual
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setValue('membershipType', 'GROUP')}
                                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${membershipType === 'GROUP'
                                                            ? 'bg-white text-wiria-blue-dark shadow-sm'
                                                            : 'text-gray-500 hover:text-gray-700'
                                                            }`}
                                                    >
                                                        Group
                                                    </button>
                                                </div>
                                            </div>

                                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                                <AnimatePresence mode="wait">
                                                    {membershipType === 'GROUP' && (
                                                        <motion.div
                                                            key="group-fields"
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden space-y-4 pb-6 border-b border-gray-100"
                                                        >
                                                            <div className="bg-blue-50 p-4 rounded-xl mb-4 flex items-center gap-3">
                                                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                                    </svg>
                                                                </div>
                                                                <p className="text-sm text-blue-800">
                                                                    Group registration allows for discounted collective renewals and centralized management.
                                                                </p>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <Input
                                                                    label="Group Name"
                                                                    placeholder="e.g. Unity Youth Group"
                                                                    {...register('groupName')}
                                                                    error={errors.groupName?.message}
                                                                    disabled={isFormDisabled}
                                                                />
                                                                <Input
                                                                    type="number"
                                                                    label="Initial Member Count"
                                                                    min={1}
                                                                    {...register('memberCount', { valueAsNumber: true })}
                                                                    error={errors.memberCount?.message}
                                                                    disabled={isFormDisabled}
                                                                />
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Personal Information */}
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                        <span className="w-8 h-8 rounded-full bg-wiria-blue-dark text-white flex items-center justify-center text-sm font-bold">1</span>
                                                        {membershipType === 'GROUP' ? 'Primary Contact / Representative Information' : 'Personal Information'}
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} disabled={isFormDisabled} />
                                                        <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} disabled={isFormDisabled} />
                                                        <Input type="date" label={membershipType === 'INDIVIDUAL' ? 'Date of Birth *' : 'Date of Birth'} {...register('dateOfBirth')} error={errors.dateOfBirth?.message} disabled={isFormDisabled} />
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Gender {membershipType === 'INDIVIDUAL' && <span className="text-red-500">*</span>}
                                                            </label>
                                                            <select {...register('gender')} disabled={isFormDisabled} className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-wiria-yellow focus:ring-2 focus:ring-wiria-yellow focus:ring-opacity-50 disabled:bg-gray-50 transition-all">
                                                                <option value="">Select gender</option>
                                                                <option value="MALE">Male</option>
                                                                <option value="FEMALE">Female</option>
                                                                <option value="OTHER">Other</option>
                                                            </select>
                                                            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
                                                        </div>
                                                        <Input label={membershipType === 'GROUP' ? 'Group Registration Number (if applicable)' : 'National ID Number *'} {...register('nationalId')} error={errors.nationalId?.message} disabled={isFormDisabled} />
                                                    </div>
                                                </div>

                                                {/* Contact Information */}
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                        <span className="w-8 h-8 rounded-full bg-wiria-blue-dark text-white flex items-center justify-center text-sm font-bold">2</span>
                                                        Contact & Location
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <Input type="email" label="Email Address" {...register('email')} error={errors.email?.message} disabled={isFormDisabled} />
                                                        <Input label="Phone Number" {...register('phoneNumber')} error={errors.phoneNumber?.message} placeholder="0712345678" helperText="Your M-Pesa registered number" disabled={isFormDisabled} />
                                                        <Input label="County" {...register('county')} error={errors.county?.message} disabled={isFormDisabled} />
                                                        <Input label="Sub-County" {...register('subCounty')} error={errors.subCounty?.message} disabled={isFormDisabled} />
                                                        <Input label="Ward" {...register('ward')} error={errors.ward?.message} disabled={isFormDisabled} />
                                                        <Input label="Village" {...register('village')} error={errors.village?.message} disabled={isFormDisabled} />
                                                    </div>
                                                </div>

                                                {/* Payment Section */}
                                                <FeeBreakdownSection
                                                    feeBreakdown={feeBreakdown}
                                                    totalFee={totalFee}
                                                    paymentMethod={paymentMethod}
                                                    onPaymentMethodChange={(method) => setValue('paymentMethod', method)}
                                                    isDisabled={isFormDisabled}
                                                />

                                                {/* Consent */}
                                                <ConsentCheckboxes
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    register={register as any}
                                                    errors={errors}
                                                    isDisabled={isFormDisabled}
                                                />

                                                {/* Submit */}
                                                <Button
                                                    type="submit"
                                                    fullWidth
                                                    size="lg"
                                                    isLoading={isSubmitting}
                                                    disabled={paymentStatus === 'PENDING'}
                                                    className="h-14 text-lg shadow-lg hover:shadow-xl transition-all"
                                                >
                                                    {isSubmitting ? 'Processing...' : paymentStatus === 'PENDING' ? 'Payment Pending...' : 'Complete Registration'}
                                                </Button>

                                                <p className="text-center text-sm text-gray-600">
                                                    Already a member?{' '}
                                                    <Link to="/member-login" className="font-bold text-wiria-blue-dark hover:underline">
                                                        Login here
                                                    </Link>
                                                </p>
                                            </form>
                                        </CardBody>
                                    </Card>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default MembershipPage;
