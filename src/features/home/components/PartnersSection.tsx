/**
 * Partners Section
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
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-20">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-wiria-blue-dark/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-wiria-yellow/5 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-wiria-blue-dark/10 px-4 py-1.5 text-sm font-semibold text-wiria-blue-dark">
            Our Network
          </span>
          <h3 className="mb-4 text-3xl font-bold text-wiria-blue-dark md:text-4xl">
            Trusted Partners
          </h3>
          <div className="mx-auto mb-4 h-1 w-20 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light" />
          <p className="mx-auto max-w-lg text-gray-600">
            Collaborating with leading organizations to create sustainable impact in our communities
          </p>
        </motion.div>

        {isLoading ? (
          <div className="py-16 text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-wiria-blue-dark/20 border-t-wiria-blue-dark" />
            <p className="mt-4 text-gray-500">Loading partners...</p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-red-500">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Unable to load partners</span>
            </div>
          </div>
        ) : (
          <>
            {/* Partners Grid - Centered for 4 items */}
            <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-6">
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
                    className="group relative block flex h-32 flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-wiria-blue-dark/20 hover:shadow-xl"
                    title={partner.name}
                  >
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-wiria-blue-dark/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Logo if available */}
                    {partner.logoUrl && (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="relative z-10 mb-2 max-h-12 max-w-[80%] object-contain opacity-60 grayscale transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                      />
                    )}

                    {/* Partner name - always visible */}
                    <span
                      className={`relative z-10 text-center font-semibold transition-colors duration-300 ${partner.logoUrl
                          ? 'text-xs text-gray-500 group-hover:text-wiria-blue-dark'
                          : 'text-sm text-wiria-blue-dark group-hover:text-wiria-yellow'
                        }`}
                    >
                      {partner.name}
                    </span>

                    {/* External link indicator */}
                    {partner.websiteUrl && (
                      <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <svg
                          className="h-3.5 w-3.5 text-wiria-blue-dark/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
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
              className="mt-12 text-center"
            >
              <Link
                to="/about#partners"
                className="group inline-flex items-center gap-3 rounded-full bg-wiria-blue-dark/5 px-6 py-3 font-semibold text-wiria-blue-dark transition-all duration-300 hover:bg-wiria-blue-dark hover:text-white"
              >
                <span>View All Partners</span>
                <svg
                  className="h-5 w-5 transform transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
