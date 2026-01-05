/**
 * Latest Updates Section
 * Displays recent news and activities
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Update } from '../constants/homeData';

interface LatestUpdatesSectionProps {
    updates: Update[];
}

const categoryColors = {
    health: 'bg-green-100 text-green-700',
    rights: 'bg-blue-100 text-blue-700',
    economy: 'bg-yellow-100 text-yellow-700',
    general: 'bg-gray-100 text-gray-700',
};

export function LatestUpdatesSection({ updates }: LatestUpdatesSectionProps) {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-wiria-blue-dark mb-4">Latest Updates</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Stay informed about our recent activities and community impact
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {updates.map((update, index) => (
                        <motion.div
                            key={update.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                            className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 cursor-pointer"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <motion.img
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.4 }}
                                    src={update.image}
                                    alt={update.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[update.category as keyof typeof categoryColors] || categoryColors.general}`}>
                                        {update.category.charAt(0).toUpperCase() + update.category.slice(1)}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="text-sm text-gray-500 mb-2">
                                    {new Date(update.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </div>
                                <h3 className="text-xl font-bold text-wiria-blue-dark mb-3">{update.title}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-3">{update.excerpt}</p>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className="text-wiria-blue-dark font-semibold flex items-center"
                                >
                                    Read More
                                    <svg
                                        className="w-4 h-4 ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center"
                >
                    <Link
                        to="/about#updates"
                        className="inline-block px-8 py-3 bg-wiria-blue-dark text-white font-semibold rounded-full hover:bg-blue-900 transition-colors"
                    >
                        View All Updates
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
