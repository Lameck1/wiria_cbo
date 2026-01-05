/**
 * TestimonialsSection Component
 * Single responsibility: Display testimonials from past volunteers/interns
 */

import { motion } from 'framer-motion';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    year: string;
    quote: string;
    avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        name: 'Sarah Akinyi',
        role: 'Community Health Volunteer',
        year: '2023',
        quote: 'Volunteering with WIRIA opened my eyes to the real challenges our community faces. I gained invaluable experience in health education and made lifelong friends.',
        avatar: '👩🏾',
    },
    {
        id: 2,
        name: 'James Ochieng',
        role: 'M&E Intern',
        year: '2022',
        quote: 'The internship program gave me hands-on experience with data analysis and impact measurement. It was the perfect stepping stone for my career in development.',
        avatar: '👨🏾',
    },
    {
        id: 3,
        name: 'Grace Atieno',
        role: 'Education Program Volunteer',
        year: '2023',
        quote: 'Working with the youth in Homa Bay was incredibly rewarding. WIRIA truly cares about both the community and its volunteers.',
        avatar: '👩🏾‍🏫',
    },
];

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col h-full"
        >
            {/* Quote Icon */}
            <div className="text-4xl text-wiria-yellow mb-4">"</div>

            {/* Quote */}
            <p className="text-gray-700 italic flex-grow mb-6">{testimonial.quote}</p>

            {/* Author */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-wiria-blue-dark to-blue-600 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                </div>
                <div>
                    <p className="font-bold text-wiria-blue-dark">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role} • {testimonial.year}</p>
                </div>
            </div>
        </motion.div>
    );
}

export function TestimonialsSection() {
    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4 lg:px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 bg-wiria-yellow/20 text-wiria-blue-dark rounded-full text-sm font-medium mb-4"
                    >
                        Success Stories
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-wiria-blue-dark mb-4"
                    >
                        Hear From Our Alumni
                    </motion.h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-wiria-yellow to-wiria-green-light mx-auto rounded-full" />
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
