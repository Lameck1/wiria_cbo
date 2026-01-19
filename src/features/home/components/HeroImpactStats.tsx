import { motion } from 'framer-motion';

const HERO_STATS = [
  { label: 'Members', value: '1,250+', icon: '👥' },
  { label: 'Beneficiaries', value: '15K+', icon: '🤝' },
  { label: 'Years Active', value: '6+', icon: '📅' },
];

export function HeroImpactStats() {
  return (
    <div className="absolute bottom-20 right-8 z-20 hidden flex-col gap-3 xl:flex">
      {HERO_STATS.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + index * 0.1 }}
          className="min-w-[140px] rounded-xl bg-white/95 p-3 shadow-xl backdrop-blur-md transition-transform duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <div className="text-xl font-bold text-wiria-blue-dark">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
