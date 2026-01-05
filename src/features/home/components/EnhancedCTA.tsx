/**
 * Enhanced Call to Action Section
 * Premium CTA with background and animations
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';

interface CTAButton {
    label: string;
    link: string;
    variant: 'primary' | 'outline' | 'ghost';
}

interface EnhancedCTAProps {
    title: string;
    subtitle: string;
    buttons: CTAButton[];
}

export function EnhancedCTA({ title, subtitle, buttons }: EnhancedCTAProps) {
    return (
        <section className="relative py-20 bg-gradient-to-r from-wiria-blue-dark to-blue-900 text-white overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
                <motion.div
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: 'reverse',
                    }}
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            {/* Floating shape decorations */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                }}
                className="absolute top-10 right-10 w-32 h-32 bg-wiria-yellow/20 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, -5, 0],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    repeatType: 'reverse',
                }}
                className="absolute bottom-10 left-10 w-40 h-40 bg-wiria-green-light/20 rounded-full blur-3xl"
            />

            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">{title}</h2>
                    <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">{subtitle}</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {buttons.map((button, index) => (
                            <motion.div
                                key={button.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link to={button.link}>
                                    <Button
                                        size="lg"
                                        variant={button.variant}
                                        className={`w-full sm:w-auto ${button.variant === 'outline'
                                                ? 'border-white text-white hover:bg-white hover:text-wiria-blue-dark'
                                                : button.variant === 'ghost'
                                                    ? 'text-white hover:bg-white/10'
                                                    : ''
                                            }`}
                                    >
                                        {button.label}
                                    </Button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Social proof badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-300"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-wiria-green-light rounded-full" />
                        <span>Trusted by 10,000+ members</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-wiria-yellow rounded-full" />
                        <span>5+ years of impact</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span>Community-driven solutions</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
