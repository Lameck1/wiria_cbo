/**
 * SafeguardingCallout Component
 * Callout section for reporting safeguarding concerns

 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function SafeguardingCallout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-10 rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-orange-50 p-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-100">
          <svg
            className="h-6 w-6 text-red-500"
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
        </div>
        <div className="flex-1">
          <h4 className="mb-1 text-lg font-bold text-red-800">Need to Report a Concern?</h4>
          <p className="mb-4 text-sm text-red-700/80">
            If you have a safeguarding concern related to PSEAH or Child Protection, we have a
            dedicated confidential reporting system.
          </p>
          <Link
            to="/safeguarding"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition-all hover:shadow-lg"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Report a Safeguarding Concern
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
