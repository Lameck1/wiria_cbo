/**
 * SectionHeader Component
 * Reusable section header with title and gradient underline
 * Single responsibility: Render consistent section headers
 */

import { motion } from 'framer-motion';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    badge?: string;
    centered?: boolean;
    className?: string;
}

export function SectionHeader({
    title,
    subtitle,
    badge,
    centered = true,
    className = '',
}: SectionHeaderProps) {
    const alignClass = centered ? 'text-center' : 'text-left';
    const underlineClass = centered ? 'mx-auto' : '';

    return (
        <div className={`mb-12 ${alignClass} ${className}`}>
            {/* Optional Badge */}
            {badge && (
                <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-block px-4 py-1.5 bg-wiria-yellow/20 text-wiria-blue-dark rounded-full text-sm font-medium mb-4"
                >
                    {badge}
                </motion.span>
            )}

            {/* Title */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-wiria-blue-dark mb-4"
            >
                {title}
            </motion.h2>

            {/* Gradient Underline */}
            <div className={`w-24 h-1 bg-gradient-to-r from-wiria-yellow to-wiria-green-light rounded-full mb-6 ${underlineClass}`} />

            {/* Optional Subtitle */}
            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-lg text-gray-600 max-w-3xl mx-auto"
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
}
