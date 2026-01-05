/**
 * EqualOpportunitySection Component
 * Enhanced with visual elements, icons, and values display
 */

import { motion } from 'framer-motion';

const VALUES = [
    { icon: '🌍', label: 'Diversity' },
    { icon: '⚖️', label: 'Equality' },
    { icon: '🤝', label: 'Inclusion' },
    { icon: '💜', label: 'Respect' },
];

export function EqualOpportunitySection() {
    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4 lg:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Header with Badge */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Certified Equal Opportunity Employer
                        </div>
                        <h2 className="text-3xl font-bold text-wiria-blue-dark mb-4">
                            We Celebrate Diversity
                        </h2>
                    </div>

                    {/* Values Icons */}
                    <div className="flex justify-center gap-6 mb-8">
                        {VALUES.map((value, index) => (
                            <motion.div
                                key={value.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-2xl mb-2 hover:shadow-lg transition-shadow">
                                    {value.icon}
                                </div>
                                <span className="text-xs font-semibold text-gray-600">{value.label}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Statement Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-wiria-blue-dark rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    WIRIA CBO is an equal opportunity employer. We celebrate diversity and are
                                    committed to creating an inclusive environment for all employees. We do not
                                    discriminate on the basis of race, religion, color, national origin, gender,
                                    sexual orientation, age, marital status, veteran status, or disability status.
                                </p>
                                <p className="text-gray-600 text-sm">
                                    We believe that diverse teams drive innovation and better serve our communities.
                                    Every voice matters at WIRIA CBO.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Message */}
                    <p className="text-center text-gray-500 text-sm mt-6">
                        🌟 We encourage applications from all qualified candidates, including those from underrepresented groups.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
