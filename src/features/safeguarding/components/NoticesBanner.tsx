/**
 * NoticesBanner Component
 * Emergency warning and confidentiality notice banners

 */

import { motion } from 'framer-motion';

export function NoticesBanner() {
  return (
    <section className="bg-gray-50 py-8">
      <div className="container mx-auto space-y-4 px-4 lg:px-6">
        {/* Emergency Warning - with pulsing glow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-lg border-l-4 border-amber-500 bg-gradient-to-r from-yellow-50 to-amber-50 p-6"
        >
          {/* Pulsing glow effect */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-200/30 to-yellow-200/30"
          />

          <div className="relative z-10 flex items-start">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
            >
              <svg
                className="mr-3 mt-1 h-6 w-6 flex-shrink-0 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </motion.div>
            <div>
              <h3 className="mb-1 font-bold text-amber-800">Immediate Danger?</h3>
              <p className="text-amber-700">
                If someone is in immediate danger, please contact local emergency services first
                (Police: 999/112, or Child Helpline: 116).
              </p>
            </div>
          </div>
        </motion.div>

        {/* Confidentiality Notice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border-l-4 border-slate-500 bg-gradient-to-r from-slate-50 to-slate-100 p-6"
        >
          <div className="flex items-start">
            <svg
              className="mr-3 mt-1 h-6 w-6 flex-shrink-0 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div>
              <h3 className="mb-1 font-bold text-slate-800">Confidentiality Notice</h3>
              <p className="text-slate-600">
                All reports are treated with the utmost confidentiality. You can choose to report
                anonymously. Only designated safeguarding officers have access to this information.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
