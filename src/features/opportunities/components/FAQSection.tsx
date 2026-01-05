/**
 * FAQSection Component
 * Single responsibility: Display frequently asked questions in accordion format
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface FAQ {
    id: number;
    question: string;
    answer: string;
}

const FAQS: FAQ[] = [
    {
        id: 1,
        question: 'What are the requirements to volunteer or intern with WIRIA?',
        answer: 'We welcome individuals 18 years and above with a passion for community development. Specific roles may require relevant skills or educational background. All volunteers and interns must be willing to commit to their agreed schedule and uphold our organizational values.',
    },
    {
        id: 2,
        question: 'Is accommodation or transport provided?',
        answer: 'For local volunteers, we provide transport allowance for field activities. For international volunteers or those from outside Homa Bay County, we can assist with finding affordable accommodation and provide orientation support.',
    },
    {
        id: 3,
        question: 'Will I receive a certificate upon completion?',
        answer: 'Yes! All volunteers and interns who complete their agreed commitment receive a certificate of completion and a reference letter upon request. We also provide LinkedIn recommendations for exceptional contributors.',
    },
    {
        id: 4,
        question: 'What is the minimum commitment period?',
        answer: 'Volunteer commitments can be as short as 2-4 hours per week. Internships typically require a minimum of 2 months, with 3-6 months being ideal for maximum learning and impact.',
    },
    {
        id: 5,
        question: 'Can I volunteer remotely?',
        answer: 'Yes, certain roles such as content creation, social media management, research, and data analysis can be done remotely. Check the location field in each opportunity listing for availability.',
    },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="border-b border-gray-200 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full py-5 flex items-center justify-between text-left hover:text-wiria-blue-dark transition-colors"
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 w-8 h-8 bg-wiria-yellow/20 rounded-full flex items-center justify-center"
                >
                    <svg className="w-5 h-5 text-wiria-blue-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 text-gray-600 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function FAQSection() {
    const [openId, setOpenId] = useState<number | null>(1);

    const handleToggle = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 lg:px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 bg-blue-100 text-wiria-blue-dark rounded-full text-sm font-medium mb-4"
                    >
                        Got Questions?
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-wiria-blue-dark mb-4"
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-wiria-yellow to-wiria-green-light mx-auto rounded-full" />
                </div>

                {/* FAQ Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto bg-gray-50 rounded-2xl p-6 md:p-8"
                >
                    {FAQS.map((faq) => (
                        <FAQItem
                            key={faq.id}
                            faq={faq}
                            isOpen={openId === faq.id}
                            onToggle={() => handleToggle(faq.id)}
                        />
                    ))}
                </motion.div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-10"
                >
                    <p className="text-gray-600 mb-4">Still have questions?</p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-wiria-blue-dark hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Contact Us
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
