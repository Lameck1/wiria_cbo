/**
 * CareerHeroStats Component
 * Compact version showing open positions count with scroll CTA
 */

import { motion } from 'framer-motion';
import { useCareers } from '../hooks/useCareers';

export function CareerHeroStats() {
    const { data: jobs = [] } = useCareers();

    // Count active, non-expired jobs
    const openPositions = jobs.filter(job => {
        if (job.status !== 'ACTIVE') return false;
        return new Date(job.deadline) >= new Date();
    }).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-4"
        >
            <button
                onClick={() => document.getElementById('current-openings')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/25 transition-all group"
            >
                <span className="flex items-center gap-2 text-white font-medium">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    {openPositions} Open Position{openPositions !== 1 ? 's' : ''}
                </span>
                <span className="text-wiria-yellow font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    View Jobs
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
        </motion.div>
    );
}
