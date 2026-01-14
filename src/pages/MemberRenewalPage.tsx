import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormProvider, Controller } from 'react-hook-form';

import { useAuth } from '@/features/auth/context/AuthContext';
import { PaymentInstructions } from '@/features/donations/components/PaymentInstructions';
import { PaymentMethodToggle } from '@/features/donations/components/PaymentMethodToggle';
import { usePaymentPoller } from '@/features/donations/hooks/usePaymentPoller';
import { PortalLayout } from '@/features/membership/components/PortalLayout';
import { useMemberData } from '@/features/membership/hooks/useMemberData';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { FormField } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/Input';
import { useRenewal } from '@/features/membership/hooks/useRenewal';
import { useRenewalFeeCalculation } from '@/shared/hooks/useFeeCalculation';
import { formatPhoneNumber } from '@/shared/utils/helpers';
import { renewalSchema, RenewalFormSchema } from '@/features/membership/validation';

import {
  RenewalSuccess,
  RenewalPending,
  MembershipStatusCard,
  TotalAmountCard,
} from './renewal/components';

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
  const memberCount = watch('memberCount') || 1;
  const agreedToDataProtection = watch('agreedToDataProtection');
  const agreedToCodeOfEthics = watch('agreedToCodeOfEthics');
  const transactionCode = watch('transactionCode');

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setValue('memberCount', profile.currentMemberCount || 1);
      setValue('phoneNumber', profile.phone || '');
    }
  }, [profile, setValue]);

  const { submitRenewal, checkPaymentStatus, isSubmitting, paymentStatus, transactionId } =
    useRenewal();

  usePaymentPoller({
    donationId: transactionId,
    isActive: !!transactionId && paymentStatus === 'PENDING',
    onStatusCheck: checkPaymentStatus,
  });

  const maxCount = profile?.maxMemberCountReached || profile?.currentMemberCount || 0;

  const feeBreakdown = useRenewalFeeCalculation({
    membershipType: isGroup ? 'GROUP' : 'INDIVIDUAL',
    memberCount,
    maxCount,
  });

  const onSubmit = async (data: RenewalFormSchema) => {
    await submitRenewal({
      paymentMethod: data.paymentMethod,
      phoneNumber: formatPhoneNumber(data.phoneNumber || ''),
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
                    membershipType={profile?.membershipType || 'INDIVIDUAL'}
                    expiresAt={profile?.membershipExpiresAt}
                    daysUntilExpiry={daysUntilExpiry}
                  />
                  <TotalAmountCard total={feeBreakdown.total} />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <AnimatePresence>
                    {isGroup && (
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
                                    render={({ field }) => (
                                      <Input
                                        {...field}
                                        type="number"
                                        className="h-12 text-center text-xl font-bold"
                                        min={1}
                                      />
                                    )}
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

                  <Card className="border-none shadow-lg">
                    <CardBody className="p-8">
                      <h2 className="mb-8 text-2xl font-bold text-wiria-blue-dark">
                        Payment Details
                      </h2>

                      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div>
                          <p className="mb-3 block text-sm font-bold text-gray-700">
                            Payment Method
                          </p>
                          <PaymentMethodToggle
                            selected={paymentMethod}
                            onChange={(value) => setValue('paymentMethod', value)}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div>
                          {paymentMethod === 'STK_PUSH' ? (
                            <FormField
                              name="phoneNumber"
                              label="M-Pesa Phone Number"
                              type="tel"
                              placeholder="254700000000"
                              description="You'll receive a prompt on your phone"
                              disabled={isSubmitting}
                            />
                          ) : (
                            <FormField
                              name="transactionCode"
                              label="Transaction Code"
                              placeholder="e.g. QWE123RTY"
                              description="Enter the code from the M-Pesa SMS"
                              disabled={isSubmitting}
                            />
                          )}
                        </div>
                      </div>

                      <div className="mb-8 rounded-2xl bg-gray-50 p-6">
                        <PaymentInstructions
                          paymentMethod={paymentMethod}
                          amount={feeBreakdown.total}
                          submitLabel="Complete Renewal"
                          accountNumber="MEMBERSHIP_RENEW"
                        />
                      </div>

                      <div className="mb-8 space-y-4">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="agreedToDataProtection"
                            {...methods.register('agreedToDataProtection')}
                            className="mt-1 h-5 w-5 rounded border-gray-300 text-wiria-blue-dark focus:ring-wiria-blue-dark"
                            disabled={isSubmitting}
                          />
                          <label htmlFor="agreedToDataProtection" className="text-sm leading-tight text-gray-700">
                            I consent to the processing of my personal data under the Data Protection Policy. *
                          </label>
                        </div>
                        {errors.agreedToDataProtection && <p className="text-xs text-red-500 ml-8">{errors.agreedToDataProtection.message}</p>}

                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="agreedToCodeOfEthics"
                            {...methods.register('agreedToCodeOfEthics')}
                            className="mt-1 h-5 w-5 rounded border-gray-300 text-wiria-blue-dark focus:ring-wiria-blue-dark"
                            disabled={isSubmitting}
                          />
                          <label htmlFor="agreedToCodeOfEthics" className="text-sm leading-tight text-gray-700">
                            I agree to abide by the WIRIA Code of Ethics and Conduct. *
                          </label>
                        </div>
                        {errors.agreedToCodeOfEthics && <p className="text-xs text-red-500 ml-8">{errors.agreedToCodeOfEthics.message}</p>}
                      </div>

                      <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        isLoading={isSubmitting}
                        disabled={isSubmitDisabled}
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
      </FormProvider>
    </PortalLayout>
  );
}

export default MemberRenewalPage;
