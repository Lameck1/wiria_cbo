/**
 * Mission & Vision Section
 * Styled cards matching original HTML design
 */

import { motion } from 'framer-motion';

export function MissionVisionSection() {
    return (
        <section className="py-16 md:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
                    {/* Mission Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ y: -4 }}
                        className="relative bg-wiria-blue-dark text-white p-8 md:p-10 rounded-2xl shadow-xl overflow-hidden group"
                    >
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-wiria-yellow/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-xl bg-wiria-yellow/20 flex items-center justify-center mb-6">
                                <svg className="w-7 h-7 text-wiria-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
                            <p className="text-base md:text-lg font-semibold text-wiria-yellow mb-3">
                                What We Do—And Why It Matters
                            </p>
                            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                                To promote health, human rights, and sustainable livelihoods by empowering communities through
                                health literacy, inclusion, advocacy, and evidence-based action.
                            </p>
                            <p className="text-base text-gray-400 mt-4">
                                We meet people where they are—physically, culturally, and emotionally—and walk with them toward
                                healthier, safer, and more empowered lives.
                            </p>
                        </div>
                    </motion.div>

                    {/* Vision Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ y: -4 }}
                        className="relative bg-gradient-to-br from-wiria-yellow to-amber-500 text-wiria-blue-dark p-8 md:p-10 rounded-2xl shadow-xl overflow-hidden group"
                    >
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-wiria-blue-dark/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-xl bg-white/30 flex items-center justify-center mb-6">
                                <svg className="w-7 h-7 text-wiria-blue-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Vision</h2>
                            <p className="text-base md:text-lg font-semibold mb-3">
                                The Future We Are Building
                            </p>
                            <p className="text-lg md:text-xl leading-relaxed">
                                A healthy, inclusive, and empowered society where vulnerable populations live with dignity, equality,
                                and sustainable opportunity—regardless of where they are born or how little they have.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
