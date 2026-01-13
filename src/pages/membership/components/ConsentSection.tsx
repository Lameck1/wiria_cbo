import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

interface ConsentCheckboxesProps {
    isDisabled: boolean;
}

export const ConsentCheckboxes = memo(function ConsentCheckboxes({
    isDisabled,
}: ConsentCheckboxesProps) {
    const { register, formState: { errors } } = useFormContext();

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
                    <Link to="/safeguarding" className="font-semibold text-wiria-blue-dark hover:underline">
                        terms and conditions
                    </Link>
                    <span className="text-red-500">*</span>
                </label>
            </div>
            {errors['agreedToTerms'] && (
                <p className="pl-8 text-sm text-red-600">{(errors['agreedToTerms']?.message as string)}</p>
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
            {errors['consentToDataProcessing'] && (
                <p className="pl-8 text-sm text-red-600">{(errors['consentToDataProcessing']?.message as string)}</p>
            )}
        </div>
    );
});
