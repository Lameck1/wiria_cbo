/**
 * Impact Metrics Component
 * Displays program impact statistics with animations
 */

import { motion } from 'framer-motion';

interface ImpactMetricsProps {
    metrics: {
        label: string;
        value: string;
    }[];
    color: string;
}

export function ImpactMetrics({ metrics, color }: ImpactMetricsProps) {
    return (
        <div className="space-y-3">
            {metrics.map((metric, index) => (
                <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    className="flex justify-between items-center group cursor-default"
                >
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{metric.label}</span>
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                        className={`font-bold text-${color} text-xl`}
                    >
                        {metric.value}
                    </motion.span>
                </motion.div>
            ))}
        </div>
    );
}
