import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';

import { useAuth } from '@/features/auth/context/AuthContext';
import { usePaymentPoller } from '@/features/donations/hooks/usePaymentPoller';
import { PortalLayout } from '@/features/membership/components/PortalLayout';
import { useMemberData } from '@/features/membership/hooks/useMemberData';
import { useRenewal } from '@/features/membership/hooks/useRenewal';
import { RenewalFormSchema, renewalSchema } from '@/features/membership/validation';
import { useRenewalFeeCalculation } from '@/shared/hooks/useFeeCalculation';
import { formatPhoneNumber } from '@/shared/utils/helpers';

import {
  FeeBreakdownCard,
  GroupMemberCountCard,
  MembershipStatusCard,
  RenewalPending,
  RenewalSuccess,
  TotalAmountCard,
} from './renewal/components';
import { PaymentSectionCard } from './renewal/PaymentSectionCard';

function MemberRenewalPage() {
  useAuth();
  const { profile, fetchProfile, daysUntilExpiry } = useMemberData();

  const isGroup = profile?.membershipType === 'GROUP';

  const methods = useForm<RenewalFormSchema>({
    resolver: zodResolver(renewalSchema),
    defaultValues: {
      paymentMethod: 'STK_PUSH',
      memberCount: 1,
      phoneNumber: '',
      transactionCode: '',
      agreedToDataProtection: false,
      agreedToCodeOfEthics: false,
    },
  });

  const { handleSubmit, watch, setValue, formState: { errors } } = methods;

  const paymentMethod = watch('paymentMethod');
  const memberCount = watch('memberCount') ?? 1;
  const agreedToDataProtection = watch('agreedToDataProtection');
  const agreedToCodeOfEthics = watch('agreedToCodeOfEthics');
  const transactionCode = watch('transactionCode');

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setValue('memberCount', profile.currentMemberCount ?? 1);
      setValue('phoneNumber', profile.phone ?? '');
    }
  }, [profile, setValue]);

  const { submitRenewal, checkPaymentStatus, isSubmitting, paymentStatus, transactionId } =
    useRenewal();

  usePaymentPoller({
    donationId: transactionId,
    isActive: !!transactionId && paymentStatus === 'PENDING',
    onStatusCheck: checkPaymentStatus,
  });

  const maxCount = profile?.maxMemberCountReached ?? profile?.currentMemberCount ?? 0;

  const feeBreakdown = useRenewalFeeCalculation({
    membershipType: isGroup ? 'GROUP' : 'INDIVIDUAL',
    memberCount,
    maxCount,
  });

  const onSubmit = async (data: RenewalFormSchema) => {
    await submitRenewal({
      paymentMethod: data.paymentMethod,
      phoneNumber: formatPhoneNumber(data.phoneNumber ?? ''),
      transactionCode: data.paymentMethod === 'MANUAL' ? data.transactionCode : undefined,
      memberCount: isGroup ? data.memberCount : undefined,
      amount: feeBreakdown.total,
    });
  };

  const isSubmitDisabled =
    !agreedToDataProtection ||
    !agreedToCodeOfEthics ||
    (paymentMethod === 'MANUAL' && !transactionCode);

  if (paymentStatus === 'SUCCESS') {
    return (
      <PortalLayout title="Renewal Successful">
        <RenewalSuccess />
      </PortalLayout>
    );
  }

  return (
    <PortalLayout title="Renew Membership">
      <FormProvider {...methods}>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <AnimatePresence mode="wait">
            {paymentStatus === 'PENDING' ? (
              <RenewalPending
                paymentMethod={paymentMethod}
                isSubmitting={isSubmitting}
                onRefresh={() => window.location.reload()}
              />
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <MembershipStatusCard
                    membershipType={profile?.membershipType ?? 'INDIVIDUAL'}
                    expiresAt={profile?.membershipExpiresAt}
                    daysUntilExpiry={daysUntilExpiry}
                  />
                  <TotalAmountCard total={feeBreakdown.total} />
                </div>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void handleSubmit(onSubmit)(event);
                  }}
                  className="space-y-8"
                >
                  <AnimatePresence>
                    {isGroup && (
                      <GroupMemberCountCard maxCount={maxCount} control={methods.control} />
                    )}
                  </AnimatePresence>

                  <FeeBreakdownCard feeBreakdown={feeBreakdown} />

                  <PaymentSectionCard
                    paymentMethod={paymentMethod}
                    setValue={setValue}
                    register={methods.register}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    amount={feeBreakdown.total}
                    isSubmitDisabled={isSubmitDisabled}
                    submitLabel="Complete Renewal"
                    accountNumber="MEMBERSHIP_RENEW"
                  />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FormProvider>
    </PortalLayout>
  );
}

export default MemberRenewalPage;
