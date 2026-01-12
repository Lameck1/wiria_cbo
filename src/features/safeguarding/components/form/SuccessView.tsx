import { motion } from 'framer-motion';

interface SuccessViewProps {
  referenceNumber: string | null;
  onReset: () => void;
}

export function SuccessView({ referenceNumber, onReset }: SuccessViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 shadow-lg"
      >
        <motion.svg
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="h-12 w-12 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </motion.svg>
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-2 text-2xl font-bold text-gray-800"
      >
        Report Submitted Successfully
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-6 text-gray-600"
      >
        Thank you for bringing this to our attention.
      </motion.p>
      {referenceNumber && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="inline-block rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 p-6 shadow-inner"
        >
          <p className="mb-1 text-sm text-gray-600">Your Reference Number:</p>
          <p className="text-3xl font-bold tracking-wider text-slate-700">{referenceNumber}</p>
        </motion.div>
      )}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 text-sm text-gray-500"
      >
        Please save this reference number to check the status of your report.
      </motion.p>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 font-medium text-wiria-blue-dark transition-colors hover:text-wiria-yellow"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Submit Another Report
      </motion.button>
    </motion.div>
  );
}
