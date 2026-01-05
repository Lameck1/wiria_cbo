/**
 * ApplicationTipsSection Component
 * Single responsibility: Display application tips grid
 */

import { motion } from 'framer-motion';
import { APPLICATION_TIPS } from '../constants/opportunitiesData';

// Icons for each tip - kept locally to this component
const TIP_ICONS: Record<string, React.ReactNode> = {
    'Tailor Your Application': (
        <svg className="w-6 h-6 text-wiria-blue-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    'Show Your Passion': (
        <svg className="w-6 h-6 text-wiria-blue-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    ),
    'Include References': (
        <svg className="w-6 h-6 text-wiria-blue-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
    ),
    'Apply Early': (
        <svg className="w-6 h-6 text-wiria-blue-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

export function ApplicationTipsSection() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-wiria-blue-dark mb-4">Application Tips</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-wiria-yellow to-wiria-green-light mx-auto rounded-full" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {APPLICATION_TIPS.map((tip, index) => (
                            <motion.div
                                key={tip.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start"
                            >
                                <div className="bg-wiria-green-light rounded-lg p-3 mr-4 flex-shrink-0">
                                    {TIP_ICONS[tip.title]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-wiria-blue-dark mb-2">{tip.title}</h4>
                                    <p className="text-sm text-gray-600">{tip.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
