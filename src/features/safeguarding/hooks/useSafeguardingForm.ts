import { useState, useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useSafeguardingReport } from './useSafeguardingReport';
import { safeguardingSchema, SafeguardingReportSchema } from '../validation';

export type FormStep = 'reporter' | 'details';

export function useSafeguardingForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>('reporter');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { submitReport, submittedReference, resetSubmission } = useSafeguardingReport();

  const form = useForm<SafeguardingReportSchema>({
    resolver: zodResolver(safeguardingSchema),
    defaultValues: {
      isAnonymous: false,
      reporterName: '',
      reporterEmail: '',
      reporterPhone: '',
      reporterRelation: '',
      category: '',
      incidentDate: '',
      location: '',
      personsInvolved: '',
      description: '',
    },
    mode: 'onTouched',
  });

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { isSubmitting },
  } = form;

  const isAnonymous = watch('isAnonymous');

  const onSubmit = async (data: SafeguardingReportSchema) => {
    const success = await submitReport(data, evidenceFile ?? undefined);
    if (success) {
      setShowSuccess(true);
    }
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setEvidenceFile(e.target.files[0]);
    }
  }, []);

  const clearFile = useCallback(() => {
    setEvidenceFile(null);
  }, []);

  const handleNextStep = async () => {
    const fieldsToValidate: (keyof SafeguardingReportSchema)[] = isAnonymous
      ? []
      : ['reporterName', 'reporterEmail'];

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }

    setCurrentStep('details');
  };

  const handlePreviousStep = useCallback(() => {
    setCurrentStep('reporter');
  }, []);

  const handleNewReport = useCallback(() => {
    resetSubmission();
    setShowSuccess(false);
    reset();
    setEvidenceFile(null);
    setCurrentStep('reporter');
  }, [resetSubmission, reset]);

  return {
    form,
    currentStep,
    isAnonymous,
    evidenceFile,
    showSuccess,
    isSubmitting,
    submittedReference,
    handleFileChange,
    clearFile,
    handleNextStep,
    handlePrevStep: handlePreviousStep,
    submitAction: handleSubmit(onSubmit),
    handleNewReport,
    progressPercentage: currentStep === 'reporter' ? 50 : 100,
    setIsAnonymous: (value: boolean) => setValue('isAnonymous', value),
  };
}
