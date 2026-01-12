/**
 * Core Values Section

 */

import { motion } from 'framer-motion';
import { CORE_VALUES } from '../constants/aboutData';

// Meaningful SVG Icons for each value
const VALUE_ICONS: Record<string, React.ReactNode> = {
  'Inclusivity & Equity': (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  'Transparency & Accountability': (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  'Empowerment & Participation': (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
  'Human Rights & Dignity': (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  'Evidence-Informed Action': (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
};

export function CoreValuesSection() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header - */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-wiria-blue-dark md:text-5xl">
            Our Core Values
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '6rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mb-6 h-1 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light"
          />
          <p className="mx-auto max-w-3xl text-lg text-gray-600 md:text-xl">
            The principles that guide every action and decision we make
          </p>
        </motion.div>

        {/* Values Grid - with better spacing and animations */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_VALUES.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl"
            >
              {/* Decorative gradient background on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-5"
                style={{
                  background: `linear-gradient(135deg, ${value.iconBg.includes('purple') ? '#9333ea' : value.iconBg.includes('blue') ? '#2563eb' : value.iconBg.includes('green') ? '#16a34a' : value.iconBg.includes('yellow') ? '#f59e0b' : '#ea580c'} 0%, transparent 100%)`,
                }}
              />

              {/* Icon Container - Larger and more prominent */}
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className={`h-16 w-16 rounded-2xl ${value.iconBg} relative z-10 mb-6 flex items-center justify-center shadow-md`}
              >
                <span className={value.iconColor}>{VALUE_ICONS[value.title]}</span>
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="mb-3 text-xl font-bold text-wiria-blue-dark transition-colors duration-300 group-hover:text-wiria-green-light md:text-2xl">
                  {value.title}
                </h3>
                <p className="text-base leading-relaxed text-gray-600">{value.description}</p>
              </div>

              {/* Decorative corner element */}
              <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-wiria-yellow/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA/Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-block rounded-full border-2 border-wiria-yellow/30 bg-gradient-to-r from-wiria-yellow/20 to-wiria-green-light/20 px-8 py-4">
            <p className="text-lg font-semibold text-wiria-blue-dark">
              💡 These values drive our commitment to creating lasting, measurable impact
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
