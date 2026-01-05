/**
 * Program Overview Card Component
 * Reusable card for program overview sections with animations
 */

import { motion, AnimatePresence } from 'framer-motion';
import { ProgramData } from '../constants/programsData';
import { ProgramIcon, CheckIcon } from './ProgramIcons';

interface ProgramOverviewCardProps {
    program: ProgramData;
}

// Static gradient styles to ensure Tailwind generates the classes - Updated for 4 pillars
const GRADIENT_STYLES: Record<string, { gradient: string; subtitleClass: string }> = {
    'wellness-detail': {
        gradient: 'linear-gradient(to bottom right, #22c55e, #16a34a)', // green-500 to green-600
        subtitleClass: 'text-green-100',
    },
    'inclusion-detail': {
        gradient: 'linear-gradient(to bottom right, #a855f7, #9333ea)', // purple-500 to purple-600
        subtitleClass: 'text-purple-100',
    },
    'rights-detail': {
        gradient: 'linear-gradient(to bottom right, #2563eb, #1d4ed8)', // blue-600 to blue-700
        subtitleClass: 'text-blue-100',
    },
    'impact-advocacy-detail': {
        gradient: 'linear-gradient(to bottom right, #f59e0b, #eab308)', // yellow-500 to yellow-500
        subtitleClass: 'text-yellow-100',
    },
};

export function ProgramOverviewCard({ program }: ProgramOverviewCardProps) {
    const styles = GRADIENT_STYLES[program.id] ?? {
        gradient: 'linear-gradient(to bottom right, #22c55e, #16a34a)',
        subtitleClass: 'text-green-100',
    };

    return (
        <motion.div
            layoutId="program-card"
            transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
            className="rounded-xl p-8 md:p-12 text-white mb-8 shadow-lg overflow-hidden"
            style={{ background: styles.gradient }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="flex flex-col md:flex-row items-start gap-6"
                >
                    <motion.div
                        initial={{ scale: 0.8, rotate: -5 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex-shrink-0"
                    >
                        <ProgramIcon type={program.icon} className="w-20 h-20" />
                    </motion.div>
                    <div className="flex-grow">
                        <motion.h3
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="text-3xl md:text-4xl font-bold mb-3"
                        >
                            {program.title}
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className={`${styles.subtitleClass} text-lg mb-6`}
                        >
                            {program.subtitle}
                        </motion.p>
                        <div className="grid sm:grid-cols-3 gap-4 text-white">
                            {program.highlights.map((highlight, index) => (
                                <motion.div
                                    key={highlight}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                                    className="flex items-start"
                                >
                                    <CheckIcon className="w-6 h-6 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>{highlight}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}
