/**
 * Hero Section Component
 * Matches styling from original HTML pages
 */

import { motion } from 'framer-motion';
import { Button } from '@/shared/components/ui/Button';
import { Link } from 'react-router-dom';

export function HeroSection() {
    return (
        <section className="relative bg-gradient-to-r from-wiria-blue-dark to-blue-800 py-24">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: "url('https://picsum.photos/1920/400?image=1074')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </div>

            <div className="container mx-auto px-4 lg:px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <motion.span
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="inline-block px-4 py-1.5 bg-wiria-yellow/20 text-wiria-yellow rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-wiria-yellow/30"
                    >
                        Community-Driven Impact
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                        className="text-5xl md:text-6xl font-bold mb-6"
                    >
                        Empowering Communities,
                        <br />
                        <span className="text-wiria-yellow">Enhancing Health</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                        className="text-xl md:text-2xl text-wiria-green-light mb-8"
                    >
                        Wiria (Wellness, Inclusion, Rights, and Impact Advocates) CBO champions the rights of key and vulnerable
                        populations in Homa Bay County, Kenya.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link to="/membership">
                            <Button size="lg" className="w-full sm:w-auto">
                                Become a Member
                            </Button>
                        </Link>
                        <Link to="/donations">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-wiria-blue-dark"
                            >
                                Support Our Work
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Decorative gradient at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
        </section>
    );
}

