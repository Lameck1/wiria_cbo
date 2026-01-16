
import { PaymentInstructions } from '@/features/donations/components/PaymentInstructions';
import { PaymentMethodToggle } from '@/features/donations/components/PaymentMethodToggle';
import type { RenewalFormSchema } from '@/features/membership/validation';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { FormField } from '@/shared/components/ui/form';

import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface PaymentSectionCardProps {
  paymentMethod: 'STK_PUSH' | 'MANUAL';
  setValue: UseFormSetValue<RenewalFormSchema>;
  register: UseFormRegister<RenewalFormSchema>;
  errors: FieldErrors<RenewalFormSchema>;
  isSubmitting: boolean;
  amount: number;
  isSubmitDisabled: boolean;
  submitLabel: string;
  accountNumber: string;
}

export function PaymentSectionCard({
  paymentMethod,
  setValue,
  register,
  errors,
  isSubmitting,
  amount,
  isSubmitDisabled,
  submitLabel,
  accountNumber,
}: PaymentSectionCardProps) {
  return (
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
            amount={amount}
            submitLabel={submitLabel}
            accountNumber={accountNumber}
          />
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreedToDataProtection"
              {...register('agreedToDataProtection')}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-wiria-blue-dark focus:ring-wiria-blue-dark"
              disabled={isSubmitting}
            />
            <label htmlFor="agreedToDataProtection" className="text-sm leading-tight text-gray-700">
              I consent to the processing of my personal data under the Data Protection Policy. *
            </label>
          </div>
          {errors.agreedToDataProtection && (
            <p className="ml-8 text-xs text-red-500">
              {errors.agreedToDataProtection.message}
            </p>
          )}

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreedToCodeOfEthics"
              {...register('agreedToCodeOfEthics')}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-wiria-blue-dark focus:ring-wiria-blue-dark"
              disabled={isSubmitting}
            />
            <label htmlFor="agreedToCodeOfEthics" className="text-sm leading-tight text-gray-700">
              I agree to abide by the WIRIA Code of Ethics and Conduct. *
            </label>
          </div>
          {errors.agreedToCodeOfEthics && (
            <p className="ml-8 text-xs text-red-500">
              {errors.agreedToCodeOfEthics.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isSubmitting}
          disabled={isSubmitDisabled}
          className="h-14 text-lg shadow-xl"
        >
          {submitLabel} • KES {amount.toLocaleString()}
        </Button>
      </CardBody>
    </Card>
  );
}

