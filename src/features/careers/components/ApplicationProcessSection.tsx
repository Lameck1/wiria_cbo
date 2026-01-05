/**
 * ApplicationProcessSection Component
 * Simplified, compact card-based layout
 */

import { motion } from 'framer-motion';
import { SectionHeader } from '@/shared/components/sections/SectionHeader';

const STEPS = [
    {
        step: 1,
        title: 'Review',
        description: 'Read the job description and requirements',
    },
    {
        step: 2,
        title: 'Apply',
        description: 'Submit your CV and cover letter',
    },
    {
        step: 3,
        title: 'Interview',
        description: 'Meet with our team if shortlisted',
    },
    {
        step: 4,
        title: 'Onboard',
        description: 'Join us and start your journey',
    },
];

export function ApplicationProcessSection() {
    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="max-w-4xl mx-auto">
                    <SectionHeader title="How to Apply" />

                    {/* Compact Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {STEPS.map((step, index) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                            >
                                {/* Step Number */}
                                <div className="w-10 h-10 mx-auto mb-3 bg-wiria-blue-dark text-white rounded-full flex items-center justify-center font-bold text-lg">
                                    {step.step}
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-wiria-blue-dark mb-1">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
