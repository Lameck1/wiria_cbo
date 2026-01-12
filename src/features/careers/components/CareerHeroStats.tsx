/**
 * CareerHeroStats Component
 * Compact version showing open positions count with scroll CTA
 */

import { motion } from 'framer-motion';
import { useCareers } from '../hooks/useCareers';

export function CareerHeroStats() {
  const { data: jobs = [] } = useCareers();

  // Count active, non-expired jobs
  const openPositions = jobs.filter((job) => {
    if (job.status !== 'ACTIVE') return false;
    return new Date(job.deadline) >= new Date();
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-4 flex justify-center"
    >
      <button
        onClick={() =>
          document.getElementById('current-openings')?.scrollIntoView({ behavior: 'smooth' })
        }
        className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/15 px-5 py-2.5 backdrop-blur-sm transition-all hover:bg-white/25"
      >
        <span className="flex items-center gap-2 font-medium text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          {openPositions} Open Position{openPositions !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1 font-semibold text-wiria-yellow transition-transform group-hover:translate-x-1">
          View Jobs
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
    </motion.div>
  );
}
