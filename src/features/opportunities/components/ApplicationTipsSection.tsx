/**
 * ApplicationTipsSection Component

 */

import { motion } from 'framer-motion';

import { APPLICATION_TIPS } from '../constants/opportunitiesData';

// Icons for each tip - kept locally to this component
const TIP_ICONS: Record<string, React.ReactNode> = {
  'Tailor Your Application': (
    <svg
      className="h-6 w-6 text-wiria-blue-dark"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  'Show Your Passion': (
    <svg
      className="h-6 w-6 text-wiria-blue-dark"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  ),
  'Include References': (
    <svg
      className="h-6 w-6 text-wiria-blue-dark"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  ),
  'Apply Early': (
    <svg
      className="h-6 w-6 text-wiria-blue-dark"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

export function ApplicationTipsSection() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl font-bold text-wiria-blue-dark">Application Tips</h2>
            <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {APPLICATION_TIPS.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start"
              >
                <div className="mr-4 flex-shrink-0 rounded-lg bg-wiria-green-light p-3">
                  {TIP_ICONS[tip.title]}
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-wiria-blue-dark">{tip.title}</h4>
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
