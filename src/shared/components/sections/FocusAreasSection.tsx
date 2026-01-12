/**
 * Focus Areas Section - with Animations
 * Displays 4 main focus areas with icons, hover lift effects, and smooth transitions
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FOCUS_AREAS, type FocusArea } from '@/features/home/constants/homeData';

export function FocusAreasSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-wiria-blue-dark md:text-4xl">
            Our Focus Areas
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '6rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto h-1 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light"
          />
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {FOCUS_AREAS.map((area: FocusArea, index: number) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Link
                to={area.link}
                className="group block rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-wiria-blue-dark/20 hover:shadow-xl"
              >
                {/* Icon Circle with hover effect */}
                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300 group-hover:scale-110 group-hover:from-wiria-yellow/20 group-hover:to-wiria-green-light/20">
                  {/* Wellness Icon */}
                  {area.title === 'Wellness' && (
                    <svg
                      className="h-12 w-12 text-wiria-blue-dark transition-colors group-hover:text-green-600"
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <path d="M250.9 18.9c-23.9 2.99-45.3 30.65-45.3 66.99 0 19.91 6.8 37.41 16.8 49.61l12.2 14.5-18.7 3.5c-13 2.5-22.6 9.5-30.7 20.8-8.5 11.5-14.8 26.9-19.1 45.2-8 32.7-9.9 72.7-9.9 108.2h43.6l11.7 160.5c30.4 7 63.1 6.5 92.3 0l10.7-160.5H356c0-35.7-.5-76.4-7.8-109.7-3.9-17.9-10-33.7-18.2-45.1-8.2-11.1-18.5-17.8-33.3-20.1l-18.9-3 11.9-14.9c9.9-12.1 16.4-29.6 16.4-49.01 0-38.54-24-66.99-50.3-66.99h-4.9zm145 3.59v41.85h-41.8v50.16h41.8v41.6h49.9v-41.6h41.9V64.34h-41.9V22.49h-49.9zM52.92 62.89v30.58H22.39v36.63h30.53v30.4h36.4v-30.4h30.58V93.47H89.32V62.89h-36.4zM92.63 199.7v21.8H70.75v26.3h21.88v21.9h26.27v-21.9h21.8v-26.3h-21.8v-21.8H92.63zm355.07 62.4v21.8h-21.9v26.3h21.9v21.9H474v-21.9h21.8v-26.3H474v-21.8h-26.3zm-307.5 99.4v15h-15v18h15v15h18.1v-15h15v-18h-15v-15h-18.1zm230 45.8v15h-15v18h15v15h18v-15h15v-18h-15v-15h-18zM49.32 431.8v15h-15v18h15v15h18.01v-15h15v-18h-15v-15H49.32z"></path>
                    </svg>
                  )}

                  {/* Inclusion Icon */}
                  {area.title === 'Inclusion' && (
                    <svg
                      className="h-12 w-12 text-wiria-blue-dark transition-colors group-hover:text-purple-600"
                      viewBox="0 0 30 30"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <g transform="translate(0,-289.0625)">
                        <path
                          d="m 18.853516,8.5820312 c -1.152452,0.0017 -2.230942,0.5679424 -2.886719,1.5156248 0.245759,0.621718 0.386719,1.293985 0.386719,1.998047 0,0.693735 -0.175104,1.331591 -0.4375,1.929688 0.648969,0.990797 1.753084,1.58837 2.9375,1.589843 1.942893,4.49e-4 3.518031,-1.574688 3.517578,-3.517578 -6.26e-4,-1.942127 -1.575448,-3.516074 -3.517578,-3.5156248 z M 22,16.345703 19.912109,19.611328 c 0.528723,1.153814 0.838621,2.416765 0.875,3.738281 l 0.02148,0.783203 -0.515625,0.587891 C 19.548375,25.571315 18.67911,26.30872 17.728516,26.933594 18.114724,26.97681 18.506361,27 18.904297,27 22.05905,27 24.881454,25.60556 26.806641,23.40625 26.721561,20.31573 24.843996,17.558273 22,16.345703 Z"
                          transform="translate(0,289.0625)"
                        />
                        <path d="m 10.835941,297.64216 a 3.5167647,3.516759 0 0 0 -3.5167638,3.51676 3.5167647,3.516759 0 0 0 3.5167638,3.51676 3.5167647,3.516759 0 0 0 3.516765,-3.51676 3.5167647,3.516759 0 0 0 -3.516765,-3.51676 z m 3.145856,7.76332 -3.0703,4.80292 -3.1115121,-4.79948 c -2.8464838,1.20791 -4.7285466,3.96325 -4.8183795,7.05412 1.925237,2.20091 4.7480521,3.59746 7.9041346,3.59746 3.154753,0 5.97723,-1.39473 7.902417,-3.59403 -0.08508,-3.09053 -1.962364,-5.84843 -4.80636,-7.06099 z" />
                      </g>
                    </svg>
                  )}

                  {/* Rights Icon */}
                  {area.title === 'Rights' && (
                    <svg
                      className="h-12 w-12 text-wiria-blue-dark transition-colors group-hover:text-blue-600"
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <path d="M24.064 6.583l-3.773 8.375h-1.098l4.024-8.916h-6.213v20.771c1.28 0.047 7.813 2.167 7.813 2.167v1.020h-17.56v-1.089c0 0 6.678-2.099 7.684-2.099v-20.77h-6.015l4.025 8.916h-1.098l-3.773-8.375-3.773 8.375h-1.098l4.048-8.966v-1.034h6.754c0-1.353 0.907-2.458 1.965-2.458 1.119 0 1.965 1.168 1.965 2.458h6.878v0.887l4.116 9.113h-1.098l-3.773-8.375zM13.020 15.979c0 2.693-1.868 5.282-4.939 5.282-3.002 0-4.939-2.589-4.939-5.282-0.001 0.004 9.878 0.004 9.878 0zM19.262 15.979c0 0.005 9.879 0.005 9.879 0 0 2.693-1.868 5.282-4.939 5.282-3.003 0-4.94-2.589-4.94-5.282z" />
                    </svg>
                  )}

                  {/* Impact Advocacy Icon */}
                  {area.title === 'Impact Advocacy' && (
                    <svg
                      className="h-12 w-12 text-wiria-blue-dark transition-colors group-hover:text-wiria-yellow"
                      viewBox="0 0 256 256"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <g>
                        <path d="M161.7,156v-13.4c-1.3-15.5-19.3-15.3-19.3-15.3H114c-20.4,0.4-19.7,15.3-19.7,15.3V156H161.7z" />
                        <path d="M108.7,52.2h3.3l0,15h31.6V52.1l3.4,0v15.2h10.5V49.9c-1.2-13.7-17-13.5-17-13.5H132l-3.4,5.6l-3.4-5.6h-9.7 c-17.9,0.3-17.3,13.5-17.3,13.5v17.3h10.5V52.2z" />
                        <rect x="87.1" y="69.6" width="81.6" height="12" />
                        <circle cx="128.6" cy="19.9" r="12.5" />
                        <path d="M163.6,140.8V156h67.4v-15.2c-1.3-15.5-19.3-15.3-19.3-15.3h-28.4C162.8,125.9,163.6,140.8,163.6,140.8z" />
                        <path d="M198.1,121c7.8,0,14.2-6.4,14.2-14.2c0-7.8-6.3-14.2-14.2-14.2c-7.8,0-14.2,6.3-14.2,14.2C183.9,114.6,190.3,121,198.1,121 z" />
                        <path d="M15.9,162.2v23.5h12.9v62.9h198.3v-62.9c0,0,6.5,0,13,0v-23.5H15.9z" />
                        <path d="M152.1,121l6.9-36.3H96.7l7,36.5c2.8-1.2,5.9-2,9.5-2.3c-2-3-3.2-6.6-3.2-10.5c0-10.5,8.5-19,19-19 c10.5,0,19.1,8.6,19.1,19c0,3.9-1.2,7.5-3.2,10.6C147.1,119.3,149.6,119.9,152.1,121z" />
                        <path d="M92.5,156v-13.4c-1.3-15.5-19.3-15.3-19.3-15.3H44.8c-20.3,0.4-19.6,15.3-19.6,15.3l0,13.4H92.5z" />
                        <circle cx="128.9" cy="108.6" r="14.2" />
                        <circle cx="59.7" cy="108.6" r="14.2" />
                      </g>
                    </svg>
                  )}
                </div>

                <h3 className="mb-3 text-xl font-bold text-wiria-blue-dark transition-colors group-hover:text-wiria-yellow">
                  {area.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">{area.description}</p>

                {/* Learn more indicator */}
                <div className="mt-4 flex items-center justify-center gap-1 text-wiria-blue-dark/60 transition-colors group-hover:text-wiria-yellow">
                  <span className="text-sm font-medium">Learn more</span>
                  <svg
                    className="h-4 w-4 transform transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
