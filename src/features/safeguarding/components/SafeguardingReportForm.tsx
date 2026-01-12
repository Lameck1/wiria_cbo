import { motion, AnimatePresence } from 'framer-motion';
import { useSafeguardingForm } from '../hooks/useSafeguardingForm';
import { ReporterStep } from './form/ReporterStep';
import { ConcernStep } from './form/ConcernStep';
import { SuccessView } from './form/SuccessView';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export function SafeguardingReportForm() {
  const {
    currentStep,
    isAnonymous,
    formData,
    evidenceFile,
    showSuccess,
    isSubmitting,
    submittedReference,
    progressPercentage,
    setIsAnonymous,
    handleChange,
    handleCategorySelect,
    handleFileChange,
    clearFile,
    handleNextStep,
    handlePrevStep,
    handleSubmit,
    handleNewReport,
  } = useSafeguardingForm();

  if (showSuccess) {
    return <SuccessView referenceNumber={submittedReference} onReset={handleNewReport} />;
  }

  return (
    <form id="safeguarding-form" className="space-y-6" onSubmit={handleSubmit}>
      {/* Progress Steps Indicator */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span
            className={`text-sm font-medium ${currentStep === 'reporter' ? 'text-slate-700' : 'text-gray-400'}`}
          >
            1. Reporter Info
          </span>
          <span
            className={`text-sm font-medium ${currentStep === 'details' ? 'text-slate-700' : 'text-gray-400'}`}
          >
            2. Concern Details
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-slate-600 to-slate-700"
            initial={{ width: '50%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, x: currentStep === 'reporter' ? -20 : 20 }}
        >
          {currentStep === 'reporter' ? (
            <ReporterStep
              isAnonymous={isAnonymous}
              formData={formData}
              isSubmitting={isSubmitting}
              setIsAnonymous={setIsAnonymous}
              onChange={handleChange}
              onNext={handleNextStep}
            />
          ) : (
            <ConcernStep
              formData={formData}
              isSubmitting={isSubmitting}
              evidenceFile={evidenceFile}
              onChange={handleChange}
              onCategorySelect={handleCategorySelect}
              onFileChange={handleFileChange}
              onClearFile={clearFile}
              onBack={handlePrevStep}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </form>
  );
}
