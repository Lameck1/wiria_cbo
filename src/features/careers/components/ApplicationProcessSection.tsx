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
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mx-auto max-w-4xl">
          <SectionHeader title="How to Apply" />

          {/* Compact Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Step Number */}
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-wiria-blue-dark text-lg font-bold text-white">
                  {step.step}
                </div>

                {/* Title */}
                <h3 className="mb-1 font-bold text-wiria-blue-dark">{step.title}</h3>

                {/* Description */}
                <p className="text-xs leading-relaxed text-gray-500">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
