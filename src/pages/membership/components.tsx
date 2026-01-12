/**
 * MembershipPage Sub-components
 * Extracted components to reduce MembershipPage.tsx size
 */

import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Spinner } from '@/shared/components/ui/Spinner';
import { PaymentMethodToggle } from '@/features/donations/components/PaymentMethodToggle';
import { PaymentInstructions } from '@/features/donations/components/PaymentInstructions';
import { RegistrationFormSchema } from '@/features/membership/validation';

// ─────────────────────────────────────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────────────────────────────────────
export const MembershipHero = memo(function MembershipHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-wiria-blue-dark to-blue-900 py-20 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-wiria-yellow blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-400 blur-3xl" />
      </div>
      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-4xl font-bold md:text-5xl"
        >
          Become a Member
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto max-w-2xl text-xl text-gray-200"
        >
          Join WIRIA CBO and be part of positive change in our community
        </motion.p>
      </div>
    </section>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Offline Information Card
// ─────────────────────────────────────────────────────────────────────────────
export const OfflineInfoCard = memo(function OfflineInfoCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="mb-8 overflow-hidden border-2 border-wiria-yellow bg-white shadow-xl">
        <div className="h-2 bg-gradient-to-r from-wiria-yellow to-amber-500" />
        <CardBody>
          <div className="py-8 text-center">
            <div className="mb-4 text-6xl">👋</div>
            <h2 className="mb-4 text-3xl font-bold text-wiria-blue-dark">Membership Information</h2>
            <p className="mx-auto mb-6 max-w-xl text-gray-700">
              Thank you for your interest in joining WIRIA CBO! Our online registration system is
              currently being set up. Please check back soon or contact us directly to become a
              member.
            </p>
            <div className="mx-auto mb-6 max-w-md rounded-xl bg-gray-50 p-6">
              <h3 className="mb-3 font-bold text-gray-900">Membership Fees</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Individual Registration:</span>
                  <span className="font-semibold">KES 500</span>
                </div>
                <div className="flex justify-between">
                  <span>Individual Subscription:</span>
                  <span className="font-semibold">KES 1,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Group Registration (per member):</span>
                  <span className="font-semibold">KES 250</span>
                </div>
                <div className="flex justify-between">
                  <span>Group Subscription (per member):</span>
                  <span className="font-semibold">KES 500</span>
                </div>
              </div>
            </div>
            <Link to="/contact">
              <Button size="lg" className="px-10">
                Contact Us to Register
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Registration Success Card
// ─────────────────────────────────────────────────────────────────────────────
interface RegistrationSuccessProps {
  membershipNumber: string | null;
  onStartOver: () => void;
}

export const RegistrationSuccess = memo(function RegistrationSuccess({
  membershipNumber,
  onStartOver,
}: RegistrationSuccessProps) {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
      <Card className="mb-8 overflow-hidden border-2 border-green-500 bg-white shadow-xl shadow-green-100">
        <div className="h-2 bg-green-500" />
        <CardBody>
          <div className="py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="mb-4 text-6xl"
            >
              🎉
            </motion.div>
            <h2 className="mb-4 text-3xl font-bold text-green-800">Welcome to WIRIA CBO!</h2>
            <p className="mb-2 text-green-700">Your membership has been successfully activated.</p>
            <p className="mb-6 inline-block rounded-lg border border-green-100 bg-green-50 px-8 py-3 text-lg font-semibold text-green-800">
              Membership Number: <span className="ml-2 font-mono text-2xl">{membershipNumber}</span>
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/member-login">
                <Button size="lg" className="px-10">
                  Login to Member Portal
                </Button>
              </Link>
              <Button variant="outline" onClick={onStartOver} size="lg">
                Register Another Member
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Pending Payment Card
// ─────────────────────────────────────────────────────────────────────────────
export const PendingPaymentCard = memo(function PendingPaymentCard() {
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <Card className="mb-8 border-2 border-blue-500 bg-white">
        <CardBody>
          <div className="py-6 text-center">
            <Spinner size="lg" className="mx-auto mb-4 border-blue-500" />
            <h3 className="mb-2 text-xl font-bold text-wiria-blue-dark">Waiting for Payment</h3>
            <p className="mb-4 text-gray-700">
              Please check your phone and complete the M-Pesa payment.
            </p>
            <div className="inline-block animate-pulse rounded-md bg-blue-50 p-3 text-sm text-blue-800">
              We're checking your payment status...
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Fee Breakdown Section
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Consent Checkboxes Section
// ─────────────────────────────────────────────────────────────────────────────
interface ConsentCheckboxesProps {
  register: UseFormRegister<RegistrationFormSchema>;
  errors: FieldErrors<RegistrationFormSchema>;
  isDisabled: boolean;
}

export const ConsentCheckboxes = memo(function ConsentCheckboxes({
  register,
  errors,
  isDisabled,
}: ConsentCheckboxesProps) {
  return (
    <div className="space-y-3 rounded-xl border border-gray-100 p-4">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="agreedToTerms"
          {...register('agreedToTerms')}
          disabled={isDisabled}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-wiria-blue-dark focus:ring-wiria-blue-dark"
        />
        <label htmlFor="agreedToTerms" className="text-sm leading-tight text-gray-700">
          I agree to the{' '}
          <a href="#" className="font-semibold text-wiria-blue-dark hover:underline">
            terms and conditions
          </a>
          <span className="text-red-500">*</span>
        </label>
      </div>
      {errors.agreedToTerms && (
        <p className="pl-8 text-sm text-red-600">{errors.agreedToTerms.message}</p>
      )}

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="consentToDataProcessing"
          {...register('consentToDataProcessing')}
          disabled={isDisabled}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-wiria-blue-dark focus:ring-wiria-blue-dark"
        />
        <label htmlFor="consentToDataProcessing" className="text-sm leading-tight text-gray-700">
          I consent to the processing of my personal data according to the privacy policy
          <span className="text-red-500">*</span>
        </label>
      </div>
      {errors.consentToDataProcessing && (
        <p className="pl-8 text-sm text-red-600">{errors.consentToDataProcessing.message}</p>
      )}
    </div>
  );
});
