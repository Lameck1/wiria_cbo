/**
 * About Partners Section - Enhanced with Full Partner Details
 * Displays partner cards with logo, name, type, description, and website link
 */

import { motion } from 'framer-motion';
import { usePartners, Partner } from '@/features/home/hooks/usePartners';

// Partner type badge colors
const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
    DONOR: { bg: 'bg-green-100', text: 'text-green-700' },
    GOVERNMENT: { bg: 'bg-blue-100', text: 'text-blue-700' },
    IMPLEMENTING: { bg: 'bg-purple-100', text: 'text-purple-700' },
    NGO: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    CORPORATE: { bg: 'bg-orange-100', text: 'text-orange-700' },
};

function formatType(type: string): string {
    return type.charAt(0) + type.slice(1).toLowerCase();
}

export function AboutPartnersSection() {
    const { data: partners = [], isLoading, isError } = usePartners();

    return (
        <section id="partners" className="py-12 md:py-16 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 md:mb-12"
                >
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-wiria-blue-dark mb-4">
                        Our Partners
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-wiria-yellow to-wiria-green-light mx-auto rounded-full mb-6" />
                    <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
                        We work alongside dedicated partners who share our vision of a healthier, more equitable, and resilient community.
                    </p>
                </motion.div>

                {/* Partners Grid */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-wiria-blue-dark/20 border-t-wiria-blue-dark" />
                        <p className="mt-4 text-gray-500">Loading partners...</p>
                    </div>
                ) : isError ? (
                    <div className="text-center py-12">
                        <div className="inline-flex flex-col items-center gap-2 text-red-500">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-sm">Failed to load partners data.</span>
                        </div>
                    </div>
                ) : partners.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No partners to display at this time.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {partners.map((partner: Partner, index: number) => {
                            const defaultColors = { bg: 'bg-gray-100', text: 'text-gray-700' };
                            const typeColors = partner.type && TYPE_COLORS[partner.type]
                                ? TYPE_COLORS[partner.type]
                                : defaultColors;

                            return (
                                <motion.div
                                    key={partner.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-lg p-6 border border-gray-100 transition-all group"
                                >
                                    {/* Header with Logo and Type Badge */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                            {partner.logoUrl ? (
                                                <img
                                                    src={partner.logoUrl}
                                                    alt={partner.name}
                                                    className="max-w-full max-h-full object-contain p-1"
                                                />
                                            ) : (
                                                <span className="text-2xl font-bold text-gray-400">
                                                    {partner.name.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        {partner.type && typeColors && (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors.bg} ${typeColors.text}`}>
                                                {formatType(partner.type)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Partner Name */}
                                    <h3 className="text-lg font-bold text-wiria-blue-dark mb-2 group-hover:text-wiria-yellow transition-colors">
                                        {partner.name}
                                    </h3>

                                    {/* Description */}
                                    {partner.description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {partner.description}
                                        </p>
                                    )}

                                    {/* Website Link */}
                                    {partner.websiteUrl && (
                                        <a
                                            href={partner.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-wiria-blue-dark hover:text-wiria-yellow font-medium transition-colors"
                                        >
                                            Visit Website
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
