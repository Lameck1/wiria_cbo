/**
 * IconCard Component
 * Reusable card with icon for features/benefits grids
 * Single responsibility: Render a card with icon, title, and description
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface IconCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    iconBgColor?: string;
    delay?: number;
    className?: string;
}

export function IconCard({
    icon,
    title,
    description,
    iconBgColor = 'bg-wiria-yellow',
    delay = 0,
    className = '',
}: IconCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className={`text-center ${className}`}
        >
            <div className={`${iconBgColor} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                {icon}
            </div>
            <h4 className="font-bold text-wiria-blue-dark mb-2 text-xl">{title}</h4>
            <p className="text-gray-600">{description}</p>
        </motion.div>
    );
}
