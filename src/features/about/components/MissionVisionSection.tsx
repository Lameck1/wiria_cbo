/**
 * Mission & Vision Section
 * Styled cards matching original HTML design
 */

import { motion } from 'framer-motion';

export function MissionVisionSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-8 md:mb-16 md:grid-cols-2 md:gap-12">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-2xl bg-wiria-blue-dark p-8 text-white shadow-xl md:p-10"
          >
            {/* Decorative circles */}
            <div className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/5" />
            <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-1/2 translate-y-1/2 rounded-full bg-wiria-yellow/10" />

            <div className="relative z-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-wiria-yellow/20">
                <svg
                  className="h-7 w-7 text-wiria-yellow"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">Our Mission</h2>
              <p className="mb-3 text-base font-semibold text-wiria-yellow md:text-lg">
                What We Do—And Why It Matters
              </p>
              <p className="text-lg leading-relaxed text-gray-300 md:text-xl">
                To promote health, human rights, and sustainable livelihoods by empowering
                communities through health literacy, inclusion, advocacy, and evidence-based action.
              </p>
              <p className="mt-4 text-base text-gray-400">
                We meet people where they are—physically, culturally, and emotionally—and walk with
                them toward healthier, safer, and more empowered lives.
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-wiria-yellow to-amber-500 p-8 text-wiria-blue-dark shadow-xl md:p-10"
          >
            {/* Decorative circles */}
            <div className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/20" />
            <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-1/2 translate-y-1/2 rounded-full bg-wiria-blue-dark/10" />

            <div className="relative z-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white/30">
                <svg
                  className="h-7 w-7 text-wiria-blue-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">Our Vision</h2>
              <p className="mb-3 text-base font-semibold md:text-lg">The Future We Are Building</p>
              <p className="text-lg leading-relaxed md:text-xl">
                A healthy, inclusive, and empowered society where vulnerable populations live with
                dignity, equality, and sustainable opportunity—regardless of where they are born or
                how little they have.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
