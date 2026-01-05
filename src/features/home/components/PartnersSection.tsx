/**
 * Partners Section - Enhanced Professional Design
 * Features: Glassmorphism cards, hover effects, smooth animations
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePartners, Partner } from '../hooks/usePartners';

export function PartnersSection() {
    const { data: partners = [], isLoading, isError } = usePartners();

    // Don't render section if no partners
    if (!isLoading && partners.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 w-72 h-72 bg-wiria-blue-dark/5 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-wiria-yellow/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 lg:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <span className="inline-block px-4 py-1.5 bg-wiria-blue-dark/10 text-wiria-blue-dark text-sm font-semibold rounded-full mb-4">
                        Our Network
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold text-wiria-blue-dark mb-4">
                        Trusted Partners
                    </h3>
                    <div className="w-20 h-1 bg-gradient-to-r from-wiria-yellow to-wiria-green-light mx-auto rounded-full mb-4" />
                    <p className="text-gray-600 max-w-lg mx-auto">
                        Collaborating with leading organizations to create sustainable impact in our communities
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-wiria-blue-dark/20 border-t-wiria-blue-dark" />
                        <p className="mt-4 text-gray-500">Loading partners...</p>
                    </div>
                ) : isError ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-full">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>Unable to load partners</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Partners Grid - Centered for 4 items */}
                        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
                            {partners.map((partner: Partner, index: number) => (
                                <motion.div
                                    key={partner.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.08 }}
                                    className="w-40 sm:w-44"
                                >
                                    <a
                                        href={partner.websiteUrl || '#'}
                                        target={partner.websiteUrl ? '_blank' : undefined}
                                        rel={partner.websiteUrl ? 'noopener noreferrer' : undefined}
                                        className="group block bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-wiria-blue-dark/20 h-32 flex flex-col items-center justify-center relative overflow-hidden hover:-translate-y-1"
                                        title={partner.name}
                                    >
                                        {/* Hover gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-wiria-blue-dark/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Logo if available */}
                                        {partner.logoUrl && (
                                            <img
                                                src={partner.logoUrl}
                                                alt={partner.name}
                                                className="max-w-[80%] max-h-12 object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 relative z-10 mb-2"
                                            />
                                        )}

                                        {/* Partner name - always visible */}
                                        <span className={`text-center font-semibold relative z-10 transition-colors duration-300 ${partner.logoUrl
                                            ? 'text-xs text-gray-500 group-hover:text-wiria-blue-dark'
                                            : 'text-sm text-wiria-blue-dark group-hover:text-wiria-yellow'
                                            }`}>
                                            {partner.name}
                                        </span>

                                        {/* External link indicator */}
                                        {partner.websiteUrl && (
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <svg className="w-3.5 h-3.5 text-wiria-blue-dark/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </div>
                                        )}
                                    </a>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Link */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-center mt-12"
                        >
                            <Link
                                to="/about#partners"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-wiria-blue-dark/5 hover:bg-wiria-blue-dark text-wiria-blue-dark hover:text-white font-semibold rounded-full transition-all duration-300 group"
                            >
                                <span>View All Partners</span>
                                <svg
                                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </motion.div>
                    </>
                )}
            </div>
        </section>
    );
}
