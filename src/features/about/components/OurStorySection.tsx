/**
 * Our Story Section - Enhanced UI/UX
 * Visual hierarchy, stat boxes, pull quotes, and staggered animations
 */

import { motion } from 'framer-motion';
import { REGISTRATION_DETAILS } from '../constants/aboutData';

export function OurStorySection() {
    return (
        <section className="py-16 md:py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-wiria-blue-dark mb-4">Our Story</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-wiria-yellow to-wiria-green-light mx-auto rounded-full" />
                </div>

                {/* Hero Statement */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 text-center"
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-wiria-blue-dark mb-2">
                        Born from Pain. Built for Change.
                    </h3>
                    <div className="w-16 h-1 bg-wiria-yellow mx-auto rounded-full mt-4" />
                </motion.div>

                {/* THE PROBLEM - Section 1 */}
                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">⚠️</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-800">The Reality We Face</h4>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6 text-gray-700 text-base md:text-lg leading-relaxed ml-0 md:ml-13"
                    >
                        <p>
                            In the heart of Western Kenya, communities face intersecting health and human rights challenges that demand urgent action—particularly for girls and young women.
                        </p>

                        <p>
                            Homa Bay County bears a disproportionate burden, with some of the highest rates in the country: <strong>HIV prevalence at 15.2%</strong>, <strong>adolescent pregnancy at 23.2%</strong>, and <strong>child marriage at 37%</strong> (National AIDS Control Council [NACC], 2023; Kenya National Bureau of Statistics [KNBS] & ICF, 2022; KELIN, 2023).
                        </p>

                        <p>
                            These overlapping vulnerabilities significantly increase girls’ risk of sexual abuse, exploitation, and persistent violations of their fundamental rights (Government of Kenya, 2023).
                        </p>

                        {/* Stat Highlight Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-r-lg shadow-md my-8"
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-3xl">📊</div>
                                <div className="flex-1">
                                    <p className="font-bold text-red-700 text-lg mb-3">Critical Regional Challenges</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-white/50 p-3 rounded-xl border border-red-100">
                                            <p className="text-red-700 font-black text-2xl">15.2%</p>
                                            <p className="text-xs font-bold text-gray-600 uppercase tracking-tighter">HIV Prevalence</p>
                                        </div>
                                        <div className="bg-white/50 p-3 rounded-xl border border-red-100">
                                            <p className="text-red-700 font-black text-2xl">23.2%</p>
                                            <p className="text-xs font-bold text-gray-600 uppercase tracking-tighter">Teen Pregnancy</p>
                                        </div>
                                        <div className="bg-white/50 p-3 rounded-xl border border-red-100">
                                            <p className="text-red-700 font-black text-2xl">37%</p>
                                            <p className="text-xs font-bold text-gray-600 uppercase tracking-tighter">Child Marriage</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Source: NACC 2023, KNBS 2022, Govt of Kenya 2023</p>
                                </div>
                            </div>
                        </motion.div>

                        <p>
                            For girls and young women, the consequences are devastating. Poverty often forces them into transactional sex simply to access food, remain in school, or survive—perpetuating cycles of HIV infection, abuse, and social exclusion.
                        </p>
                    </motion.div>
                </div>

                {/* THE TURNING POINT - Pull Quote */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="my-12 relative"
                >
                    <div className="bg-gradient-to-br from-wiria-blue-dark to-blue-800 text-white p-8 md:p-10 rounded-2xl shadow-xl">
                        <div className="text-6xl text-wiria-yellow opacity-50 mb-4">"</div>
                        <p className="text-xl md:text-2xl font-bold leading-relaxed -mt-10">
                            Communities cannot wait to be rescued. They must be empowered.
                        </p>
                        <div className="w-20 h-1 bg-wiria-yellow mt-6 rounded-full" />
                    </div>
                </motion.div>

                {/* THE SOLUTION - Section 2 */}
                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">💡</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-800">The Birth of WIRIA</h4>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="space-y-5 text-gray-700 text-base md:text-lg leading-relaxed ml-0 md:ml-13"
                    >
                        <p>
                            In <strong className="text-wiria-blue-dark">2019</strong>, WIRIA—Wellness, Inclusion, Rights & Impact Advocacy—was founded as a community-driven, youth-led
                            response to generations of neglect. Inspired by grassroots advocacy training, local Community Health
                            Advocates came together with one conviction:
                        </p>

                        {/* Quote Highlight */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-wiria-yellow p-5 rounded-r-lg italic text-lg font-semibold text-gray-800"
                        >
                            "We are the solution we have been waiting for."
                        </motion.div>
                    </motion.div>
                </div>

                {/* THE IMPACT - Section 3 */}
                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">🌟</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-800">Today & Tomorrow</h4>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                        className="ml-0 md:ml-13"
                    >
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-600 p-6 md:p-8 rounded-r-lg shadow-lg">
                            <p className="text-lg md:text-xl font-bold text-green-700 leading-relaxed">
                                Today, WIRIA stands as a beacon of hope, healing, and transformation. We don't just deliver programs—we
                                build movements, restore dignity, and turn pain into power.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Registration Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="mt-16 bg-white rounded-xl shadow-lg p-6 md:p-8 border-l-4 border-wiria-green-light bg-gradient-to-r from-green-50 to-white"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-wiria-green-light/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-wiria-green-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-wiria-blue-dark">Registration Details</h3>
                    </div>
                    <ul className="space-y-3 text-gray-700 text-base">
                        {REGISTRATION_DETAILS.map((detail) => (
                            <li key={detail.label} className="flex items-start gap-3">
                                <span className="font-semibold text-wiria-blue-dark min-w-[140px]">{detail.label}:</span>
                                {detail.value}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </section>
    );
}
