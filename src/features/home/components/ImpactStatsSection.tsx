/**
 * Impact Stats Section - Enhanced with Animations
 * Animated counters with decorative floating elements and card hover effects
 */

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface ImpactStat {
    label: string;
    value: string;
    target: number;
    description: string;
}

interface ImpactStatsSectionProps {
    stats: ImpactStat[];
}

function Counter({ target, duration = 2 }: { target: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLParagraphElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

            setCount(Math.floor(progress * target));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [isInView, target, duration]);

    return (
        <p ref={ref} className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-wiria-blue-dark to-blue-700 bg-clip-text text-transparent">
            {count.toLocaleString()}+
        </p>
    );
}

export function ImpactStatsSection({ stats }: ImpactStatsSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section className="py-20 section-gradient-green relative overflow-hidden">
            {/* Enhanced decorative floating elements */}
            <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-wiria-blue-dark/5 animate-float blur-xl" />
            <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-wiria-yellow/10 animate-float blur-lg" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-wiria-yellow/10 animate-float blur-xl" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/4 left-1/4 w-20 h-20 rounded-full bg-green-200/20 animate-float blur-lg" style={{ animationDelay: '1.5s' }} />

            <div className="container mx-auto px-4 lg:px-6 relative z-10" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-wiria-blue-dark mb-4">Our Impact</h2>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '6rem' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-1 bg-gradient-to-r from-wiria-yellow to-wiria-green-light mx-auto rounded-full mb-6"
                    />
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Making a measurable difference in Homa Bay County since 2019
                    </p>
                </motion.div>

                <div id="impact-counters" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="group relative"
                        >
                            {/* Pulsing glow effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-wiria-yellow/20 to-wiria-green-light/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <Counter target={stat.target} />
                                <p className="text-lg font-semibold text-wiria-blue-dark">{stat.label}</p>
                                {stat.description && (
                                    <p className="text-sm text-gray-500 mt-2">{stat.description}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
