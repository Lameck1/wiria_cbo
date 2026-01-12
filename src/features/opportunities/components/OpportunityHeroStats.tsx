/**
 * OpportunityHeroStats Component

 */

import { motion } from 'framer-motion';
import { useOpportunities } from '../hooks/useOpportunities';

export function OpportunityHeroStats() {
  const { data: opportunities = [] } = useOpportunities();

  const stats = [
    {
      value: opportunities.length,
      label: 'Open Positions',
      icon: '📋',
    },
    {
      value: opportunities.filter((o) => o.type === 'VOLUNTEER').length,
      label: 'Volunteer Roles',
      icon: '🤝',
    },
    {
      value: opportunities.filter((o) => o.type === 'INTERNSHIP').length,
      label: 'Internships',
      icon: '🎓',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-10 flex flex-wrap justify-center gap-6 md:gap-12"
    >
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="flex items-center justify-center gap-2 text-3xl font-bold text-white md:text-4xl">
            <span className="text-2xl">{stat.icon}</span>
            <span>{stat.value}</span>
          </div>
          <div className="text-sm text-white/70">{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
}
