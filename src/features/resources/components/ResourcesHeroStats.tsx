/**
 * ResourcesHeroStats Component
 * Quick stats widget showing document and tender counts with scroll buttons
 */

import { motion } from 'framer-motion';

import { useResources } from '../hooks/useResources';
import { useTenders } from '../hooks/useTenders';

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export function ResourcesHeroStats() {
  const { data: resources = [] } = useResources();
  const { data: tenders = [] } = useTenders();

  const documentCount = resources.length;
  const activeTenderCount = tenders.filter((t) => t.status === 'OPEN').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-8 flex flex-wrap justify-center gap-4"
    >
      {/* Documents Stat */}
      <button
        onClick={() => scrollToSection('documents')}
        className="group flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm transition-all hover:bg-white/20"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wiria-yellow/20">
          <svg
            className="h-5 w-5 text-wiria-yellow"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="text-left">
          <div className="text-2xl font-bold text-white">{documentCount}</div>
          <div className="text-xs text-white/70">Documents</div>
        </div>
        <svg
          className="h-4 w-4 text-white/50 transition-all group-hover:translate-y-1 group-hover:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Separator */}
      <div className="hidden items-center text-2xl text-white/30 sm:flex">•</div>

      {/* Tenders Stat */}
      <button
        onClick={() => scrollToSection('tenders')}
        className="group flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm transition-all hover:bg-white/20"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
          <svg
            className="h-5 w-5 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <div className="text-left">
          <div className="text-2xl font-bold text-white">{activeTenderCount}</div>
          <div className="text-xs text-white/70">Active Tenders</div>
        </div>
        <svg
          className="h-4 w-4 text-white/50 transition-all group-hover:translate-y-1 group-hover:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </motion.div>
  );
}
