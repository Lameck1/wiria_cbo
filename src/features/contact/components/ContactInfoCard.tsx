/**
 * ContactInfoCard Component
 * Glassmorphism styled card for displaying contact information with icon
 * Features: frosted glass effect, hover animations, click-to-contact on mobile
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ContactInfoCardProps {
    icon: ReactNode;
    title: string;
    children: ReactNode;
    href?: string;
    delay?: number;
}

export function ContactInfoCard({ icon, title, children, href, delay = 0 }: ContactInfoCardProps) {
    const content = (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.4 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className={`
                flex items-start mt-6 p-4 -mx-4 rounded-xl
                bg-white/60 backdrop-blur-md
                border border-white/40
                shadow-sm hover:shadow-lg
                transition-all duration-300
                group
                ${href ? 'cursor-pointer active:scale-98' : ''}
            `}
        >
            <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-wiria-yellow/20 to-wiria-yellow/10 flex items-center justify-center mr-4 flex-shrink-0 group-hover:from-wiria-yellow/30 group-hover:to-wiria-yellow/20 transition-all shadow-inner"
            >
                {icon}
            </motion.div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-wiria-blue-dark text-lg group-hover:text-wiria-yellow transition-colors">
                    {title}
                </h4>
                <div className="text-gray-600 mt-1 group-hover:text-gray-700 transition-colors">
                    {children}
                </div>
            </div>
            {href && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="hidden lg:flex items-center text-wiria-yellow opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </motion.div>
            )}
        </motion.div>
    );

    // Wrap in link for click-to-contact on mobile
    if (href) {
        return (
            <a href={href} className="block no-underline">
                {content}
            </a>
        );
    }

    return content;
}
