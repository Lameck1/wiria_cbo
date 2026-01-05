/**
 * Who We Serve Section - Iconless Community Tapestry Design
 * A creative, professional layout that highlights 7 key beneficiary groups without icons.
 */

import { motion } from 'framer-motion';

const BENEFICIARIES = [
    'Adolescents & Youth',
    'Women & Girls',
    'PLHIV',
    'PWDs',
    'GBV Survivors',
    'Sexual & Gender Minorities',
    'Rural & Underserved Communities'
];

export function WhoWeServeSection() {
    return (
        <section className="py-24 bg-gray-50/50 overflow-hidden">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Left Side: The Narrative */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:w-5/12"
                    >
                        <div className="inline-block px-4 py-1.5 bg-wiria-yellow/10 text-wiria-blue-dark rounded-full text-sm font-bold uppercase tracking-widest mb-6 border border-wiria-yellow/20">
                            Our Community Focus
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-wiria-blue-dark mb-8 leading-tight">
                            At the Heart of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-wiria-yellow to-blue-600">
                                Our Mission.
                            </span>
                        </h2>
                        <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                            <p>
                                WIRIA's impact is measured not just in numbers, but in the dignity restored and the lives transformed across Homa Bay County.
                            </p>
                            <p className="font-medium text-gray-800">
                                We focus our resources on the most vulnerable, ensuring that health, rights, and economic opportunities are accessible to everyone, regardless of background or identity.
                            </p>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-px bg-gradient-to-r from-wiria-yellow/50 to-transparent"
                            />
                        </div>
                    </motion.div>

                    {/* Right Side: The Iconless Community Tapestry */}
                    <div className="lg:w-7/12 flex flex-wrap gap-4">
                        {BENEFICIARIES.map((name, index) => (
                            <motion.div
                                key={name}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                    ease: [0.215, 0.61, 0.355, 1]
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    y: -4,
                                    transition: { duration: 0.2 }
                                }}
                                className="bg-white px-6 py-5 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100/80 hover:shadow-xl hover:border-wiria-blue-dark/10 transition-all duration-300 cursor-default group"
                            >
                                <span className="text-lg md:text-xl font-bold text-wiria-blue-dark group-hover:text-wiria-yellow transition-colors duration-300">
                                    {name}
                                </span>
                            </motion.div>
                        ))}

                        {/* Decorative background element for the cluster area */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-wiria-yellow/5 to-blue-600/5 blur-3xl rounded-full" />
                    </div>

                </div>
            </div>
        </section>
    );
}

export default WhoWeServeSection;
