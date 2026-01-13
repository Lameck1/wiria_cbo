import { Card, CardBody } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { useRegistration } from '@/features/membership/hooks/useRegistration';
import { usePaymentPoller } from '@/features/donations/hooks/usePaymentPoller';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, RegistrationFormSchema } from '@/features/membership/validation';
import { formatPhoneNumber } from '@/shared/utils/helpers';
import { useFeeCalculation } from '@/shared/hooks/useFeeCalculation';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useBackendStatus } from '@/shared/services/backendStatus';
import { UserRole } from '@/shared/types';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import {
  MembershipHero,
  OfflineInfoCard,
  RegistrationSuccess,
  PendingPaymentCard,
  FeeBreakdownSection,
  ConsentCheckboxes,
  MembershipTypeToggle,
  GroupRegistrationSection,
  PersonalInfoSection,
  ContactLocationSection,
} from './membership/components';

function MembershipPage() {
  const { user, isAuthenticated } = useAuth();
  const { isBackendConnected } = useBackendStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === UserRole.MEMBER) {
      navigate('/member-portal', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const methods = useForm<RegistrationFormSchema>({
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

  const { handleSubmit, watch, setValue } = methods;

  const membershipType = watch('membershipType');
  const memberCount = watch('memberCount') || 1;

  const feeBreakdown = useFeeCalculation({
    membershipType,
    memberCount,
  });

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
    <FormProvider {...methods}>
      <MembershipHero />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
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
                  <Card className="border-none shadow-2xl">
                    <CardBody className="p-8">
                      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <h2 className="text-2xl font-bold text-wiria-blue-dark">
                          Membership Registration
                        </h2>

                        <MembershipTypeToggle
                          value={membershipType}
                          onChange={(val) => setValue('membershipType', val)}
                          isDisabled={isFormDisabled}
                        />
                      </div>

                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <AnimatePresence mode="wait">
                          {membershipType === 'GROUP' && (
                            <GroupRegistrationSection
                              isDisabled={isFormDisabled}
                            />
                          )}
                        </AnimatePresence>

                        <PersonalInfoSection
                          isDisabled={isFormDisabled}
                          membershipType={membershipType}
                        />

                        <ContactLocationSection
                          isDisabled={isFormDisabled}
                        />

                        {/* Payment Section */}
                        <FeeBreakdownSection
                          feeBreakdown={feeBreakdown}
                          totalFee={totalFee}
                          paymentMethod={paymentMethod}
                          onPaymentMethodChange={(method: 'STK_PUSH' | 'MANUAL') =>
                            setValue('paymentMethod', method)
                          }
                          isDisabled={isFormDisabled}
                        />

                        {/* Consent */}
                        <ConsentCheckboxes
                          isDisabled={isFormDisabled}
                        />

                        {/* Submit */}
                        <Button
                          type="submit"
                          fullWidth
                          size="lg"
                          isLoading={isSubmitting}
                          disabled={paymentStatus === 'PENDING'}
                          className="h-14 text-lg shadow-lg transition-all hover:shadow-xl"
                        >
                          {isSubmitting
                            ? 'Processing...'
                            : paymentStatus === 'PENDING'
                              ? 'Payment Pending...'
                              : 'Complete Registration'}
                        </Button>

                        <p className="text-center text-sm text-gray-600">
                          Already a member?{' '}
                          <Link
                            to="/member-login"
                            className="font-bold text-wiria-blue-dark hover:underline"
                          >
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
    </FormProvider>
  );
}

export default MembershipPage;
