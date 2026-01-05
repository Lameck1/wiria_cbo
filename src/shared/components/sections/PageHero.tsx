/**
 * PageHero Component
 * Reusable hero section for all pages
 * Single responsibility: Render consistent hero banner with background image
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageHeroProps {
    badge: string;
    title: string;
    subtitle: string;
    backgroundImage?: string;
    backgroundOpacity?: number;
    children?: ReactNode;
}

export function PageHero({
    badge,
    title,
    subtitle,
    backgroundImage,
    backgroundOpacity = 20,
    children,
}: PageHeroProps) {
    return (
        <section className="relative bg-gradient-to-r from-wiria-blue-dark to-blue-800 py-24">
            {/* Background Image Overlay */}
            {backgroundImage && (
                <div className={`absolute inset-0 opacity-${backgroundOpacity}`}>
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${backgroundImage}')` }}
                    />
                </div>
            )}

            <div className="container mx-auto px-4 lg:px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center text-white">
                    {/* Badge */}
                    <motion.span
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-block px-4 py-1.5 bg-wiria-yellow/20 text-wiria-yellow rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-wiria-yellow/30"
                    >
                        {badge}
                    </motion.span>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-6xl font-bold mb-6"
                    >
                        {title}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl text-wiria-green-light"
                    >
                        {subtitle}
                    </motion.p>

                    {/* Optional children (stats, CTAs, etc.) */}
                    {children}
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent" />
        </section>
    );
}
