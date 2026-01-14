/**
 * Our Story Section - UI/UX
 * Visual hierarchy, stat boxes, pull quotes, and staggered animations
 */

import { motion } from 'framer-motion';

import { REGISTRATION_DETAILS } from '../constants/aboutData';

export function OurStorySection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-wiria-blue-dark md:text-4xl">Our Story</h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light" />
        </div>

        {/* Hero Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h3 className="mb-2 text-2xl font-bold text-wiria-blue-dark md:text-3xl">
            Born from Pain. Built for Change.
          </h3>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-wiria-yellow" />
        </motion.div>

        {/* THE PROBLEM - Section 1 */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
              <span className="text-xl">⚠️</span>
            </div>
            <h4 className="text-lg font-bold text-gray-800">The Reality We Face</h4>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:ml-13 ml-0 space-y-6 text-base leading-relaxed text-gray-700 md:text-lg"
          >
            <p>
              In the heart of Western Kenya, communities face intersecting health and human rights
              challenges that demand urgent action—particularly for girls and young women.
            </p>

            <p>
              Homa Bay County bears a disproportionate burden, with some of the highest rates in the
              country: <strong>HIV prevalence at 15.2%</strong>,{' '}
              <strong>adolescent pregnancy at 23.2%</strong>, and{' '}
              <strong>child marriage at 37%</strong> (National AIDS Control Council [NACC], 2023;
              Kenya National Bureau of Statistics [KNBS] & ICF, 2022; KELIN, 2023).
            </p>

            <p>
              These overlapping vulnerabilities significantly increase girls’ risk of sexual abuse,
              exploitation, and persistent violations of their fundamental rights (Government of
              Kenya, 2023).
            </p>

            {/* Stat Highlight Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="my-8 rounded-r-lg border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-orange-50 p-6 shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">📊</div>
                <div className="flex-1">
                  <p className="mb-3 text-lg font-bold text-red-700">
                    Critical Regional Challenges
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-red-100 bg-white/50 p-3">
                      <p className="text-2xl font-black text-red-700">15.2%</p>
                      <p className="text-xs font-bold uppercase tracking-tighter text-gray-600">
                        HIV Prevalence
                      </p>
                    </div>
                    <div className="rounded-xl border border-red-100 bg-white/50 p-3">
                      <p className="text-2xl font-black text-red-700">23.2%</p>
                      <p className="text-xs font-bold uppercase tracking-tighter text-gray-600">
                        Teen Pregnancy
                      </p>
                    </div>
                    <div className="rounded-xl border border-red-100 bg-white/50 p-3">
                      <p className="text-2xl font-black text-red-700">37%</p>
                      <p className="text-xs font-bold uppercase tracking-tighter text-gray-600">
                        Child Marriage
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-[10px] font-bold uppercase italic tracking-widest text-gray-400">
                    Source: NACC 2023, KNBS 2022, Govt of Kenya 2023
                  </p>
                </div>
              </div>
            </motion.div>

            <p>
              For girls and young women, the consequences are devastating. Poverty often forces them
              into transactional sex simply to access food, remain in school, or
              survive—perpetuating cycles of HIV infection, abuse, and social exclusion.
            </p>
          </motion.div>
        </div>

        {/* THE TURNING POINT - Pull Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative my-12"
        >
          <div className="rounded-2xl bg-gradient-to-br from-wiria-blue-dark to-blue-800 p-8 text-white shadow-xl md:p-10">
            <div className="mb-4 text-6xl text-wiria-yellow opacity-50">"</div>
            <p className="-mt-10 text-xl font-bold leading-relaxed md:text-2xl">
              Communities cannot wait to be rescued. They must be empowered.
            </p>
            <div className="mt-6 h-1 w-20 rounded-full bg-wiria-yellow" />
          </div>
        </motion.div>

        {/* THE SOLUTION - Section 2 */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
              <span className="text-xl">💡</span>
            </div>
            <h4 className="text-lg font-bold text-gray-800">The Birth of WIRIA</h4>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="md:ml-13 ml-0 space-y-5 text-base leading-relaxed text-gray-700 md:text-lg"
          >
            <p>
              In <strong className="text-wiria-blue-dark">2019</strong>, WIRIA—Wellness, Inclusion,
              Rights & Impact Advocacy—was founded as a community-driven, youth-led response to
              generations of neglect. Inspired by grassroots advocacy training, local Community
              Health Advocates came together with one conviction:
            </p>

            {/* Quote Highlight */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="rounded-r-lg border-l-4 border-wiria-yellow bg-gradient-to-r from-yellow-50 to-amber-50 p-5 text-lg font-semibold italic text-gray-800"
            >
              "We are the solution we have been waiting for."
            </motion.div>
          </motion.div>
        </div>

        {/* THE IMPACT - Section 3 */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
              <span className="text-xl">🌟</span>
            </div>
            <h4 className="text-lg font-bold text-gray-800">Today & Tomorrow</h4>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="md:ml-13 ml-0"
          >
            <div className="rounded-r-lg border-l-4 border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg md:p-8">
              <p className="text-lg font-bold leading-relaxed text-green-700 md:text-xl">
                Today, WIRIA stands as a beacon of hope, healing, and transformation. We don't just
                deliver programs—we build movements, restore dignity, and turn pain into power.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Registration Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-16 rounded-xl border-l-4 border-wiria-green-light bg-white bg-gradient-to-r from-green-50 to-white p-6 shadow-lg md:p-8"
        >
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wiria-green-light/20">
              <svg
                className="h-6 w-6 text-wiria-green-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-wiria-blue-dark md:text-2xl">
              Registration Details
            </h3>
          </div>
          <ul className="space-y-3 text-base text-gray-700">
            {REGISTRATION_DETAILS.map((detail) => (
              <li key={detail.label} className="flex items-start gap-3">
                <span className="min-w-[140px] font-semibold text-wiria-blue-dark">
                  {detail.label}:
                </span>
                {detail.value}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
