import { motion, AnimatePresence } from 'framer-motion';
import { ProgramData } from '../constants/programsData';
import { ProgramOverviewCard } from './ProgramOverviewCard';
import { ProgramIcon, CheckIcon } from './ProgramIcons';
import { ImpactMetrics } from './ImpactMetrics';

interface ProgramDetailProps {
  program: ProgramData;
}

// Static style mappings to ensure Tailwind generates the classes - Updated for 4 pillars
const PROGRAM_STYLES: Record<
  string,
  {
    iconBg: string;
    iconText: string;
    cardGradient: string;
    borderColor: string;
    checkColor: string;
  }
> = {
  'wellness-detail': {
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
    cardGradient: 'linear-gradient(to bottom right, #dcfce7, #bbf7d0)', // green-50 to green-100
    borderColor: 'border-green-500',
    checkColor: 'text-green-600',
  },
  'inclusion-detail': {
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-600',
    cardGradient: 'linear-gradient(to bottom right, #fae8ff, #f3e8ff)', // purple-50 to purple-100
    borderColor: 'border-purple-500',
    checkColor: 'text-purple-600',
  },
  'rights-detail': {
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    cardGradient: 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)', // blue-50 to blue-100
    borderColor: 'border-blue-600',
    checkColor: 'text-blue-600',
  },
  'impact-advocacy-detail': {
    iconBg: 'bg-yellow-100',
    iconText: 'text-yellow-600',
    cardGradient: 'linear-gradient(to bottom right, #fef9c3, #fef08a)', // yellow-50 to yellow-100
    borderColor: 'border-yellow-500',
    checkColor: 'text-yellow-600',
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export function ProgramDetail({ program }: ProgramDetailProps) {
  const styles = PROGRAM_STYLES[program.id] ?? {
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
    cardGradient: 'linear-gradient(to bottom right, #dcfce7, #bbf7d0)',
    borderColor: 'border-green-500',
    checkColor: 'text-green-600',
  };

  return (
    <div key={program.id} id={program.id} className="program-detail tab-content">
      {/* Overview Card */}
      <ProgramOverviewCard program={program} />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${program.id}-content`}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with Icon */}
          <motion.div variants={itemVariants} className="mb-6 flex items-center md:mb-8">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className={`${styles.iconBg} mr-3 flex-shrink-0 rounded-full p-3 md:mr-4 md:p-4`}
            >
              <ProgramIcon
                type={program.icon}
                className={`h-8 w-8 md:h-10 md:w-10 ${styles.iconText}`}
              />
            </motion.div>
            <div className="min-w-0">
              <motion.h2
                variants={itemVariants}
                className="text-2xl font-bold text-wiria-blue-dark md:text-4xl"
              >
                {program.title}
              </motion.h2>
              <motion.p variants={itemVariants} className="mt-1 text-sm text-gray-600 md:text-lg">
                {program.subtitle}
              </motion.p>
            </div>
          </motion.div>

          {/* Impact Statement - Theme color-coded */}
          {program.impact && (
            <motion.div
              layoutId="program-impact-statement"
              variants={itemVariants}
              transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
              className={`mb-8 rounded-xl border-l-4 p-6 shadow-md ${
                program.id === 'wellness-detail'
                  ? 'border-green-600 bg-green-50'
                  : program.id === 'inclusion-detail'
                    ? 'border-purple-600 bg-purple-50'
                    : program.id === 'rights-detail'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-amber-600 bg-amber-50'
              }`}
            >
              <p className="flex items-start gap-2 text-lg font-bold md:text-xl">
                <span className="text-2xl">💡</span>
                <span>
                  <span className="text-gray-700">Impact:</span>{' '}
                  <span
                    className={
                      program.id === 'wellness-detail'
                        ? 'text-green-700'
                        : program.id === 'inclusion-detail'
                          ? 'text-purple-700'
                          : program.id === 'rights-detail'
                            ? 'text-blue-700'
                            : 'text-amber-700'
                    }
                  >
                    {program.impact}
                  </span>
                </span>
              </p>
            </motion.div>
          )}

          {/* Approach and Metrics Grid */}
          <div className="mb-12 grid gap-8 md:grid-cols-2">
            <motion.div
              layoutId="program-approach-card"
              variants={itemVariants}
              transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
              whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              className="rounded-xl p-8"
              style={{ background: styles.cardGradient }}
            >
              <h3 className="mb-4 text-2xl font-bold text-wiria-blue-dark">
                {program.approach.title}
              </h3>
              <p className="leading-relaxed text-gray-700">{program.approach.description}</p>
            </motion.div>
            <motion.div
              layoutId="program-metrics-card"
              variants={itemVariants}
              transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
              whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              className="rounded-xl p-8"
              style={{ background: styles.cardGradient }}
            >
              <h3 className="mb-4 text-2xl font-bold text-wiria-blue-dark">Impact Metrics</h3>
              <ImpactMetrics metrics={program.metrics} color={program.color.text} />
            </motion.div>
          </div>

          {/* Initiatives */}
          <div className="mb-12 space-y-6">
            {program.initiatives.map((initiative) => (
              <motion.div
                key={initiative.title}
                layoutId={`initiative-${initiative.title}`}
                variants={itemVariants}
                transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
                whileHover={{ x: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                className={`border-l-4 ${styles.borderColor} cursor-default rounded-r-lg bg-white p-6 shadow-md`}
              >
                <h4 className="mb-3 flex items-center text-xl font-bold text-wiria-blue-dark">
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    <CheckIcon className={`${styles.checkColor} mr-2`} />
                  </motion.div>
                  {initiative.title}
                </h4>
                <p className="text-gray-700">{initiative.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
