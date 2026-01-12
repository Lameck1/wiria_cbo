import { useState, useCallback } from 'react';
import { useSafeguardingReport, SafeguardingReportData } from './useSafeguardingReport';

export type FormStep = 'reporter' | 'details';

export function useSafeguardingForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>('reporter');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState<SafeguardingReportData>({
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
  });
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { submitReport, isSubmitting, submittedReference, resetSubmission } =
    useSafeguardingReport();

  const handleSetAnonymous = useCallback((val: boolean) => {
    setIsAnonymous(val);
    setFormData((prev) => ({ ...prev, isAnonymous: val }));
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const handleCategorySelect = useCallback((category: string) => {
    setFormData((prev) => ({ ...prev, category }));
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEvidenceFile(e.target.files[0]);
    }
  }, []);

  const clearFile = useCallback(() => {
    setEvidenceFile(null);
  }, []);

  const handleNextStep = useCallback(() => {
    setCurrentStep('details');
  }, []);

  const handlePrevStep = useCallback(() => {
    setCurrentStep('reporter');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await submitReport(formData, evidenceFile || undefined);
    if (success) {
      setShowSuccess(true);
    }
  };

  const handleNewReport = useCallback(() => {
    resetSubmission();
    setShowSuccess(false);
    setFormData({
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
    });
    setEvidenceFile(null);
    setIsAnonymous(false);
    setCurrentStep('reporter');
  }, [resetSubmission]);

  return {
    currentStep,
    isAnonymous,
    formData,
    evidenceFile,
    showSuccess,
    isSubmitting,
    submittedReference,
    setIsAnonymous: handleSetAnonymous,
    handleChange,
    handleCategorySelect,
    handleFileChange,
    clearFile,
    handleNextStep,
    handlePrevStep,
    handleSubmit,
    handleNewReport,
    progressPercentage: currentStep === 'reporter' ? 50 : 100,
  };
}
