/**
 * Donations Page - Offline Resilience Version
 * Focuses on Direct Bank Deposits while online systems are under maintenance.
 */

import { Layout } from '@/shared/components/layout/Layout';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { AlternatePaymentMethods } from '@/features/donations/components/AlternatePaymentMethods';
import { DonationImpactSection } from '@/features/donations/components/DonationImpactSection';
import { motion, AnimatePresence } from 'framer-motion';

function DonationsPage() {
  return (
    <Layout>
      {/* Hero Section - Refined Blue Gradient with Pattern */}
      <section className="relative overflow-hidden bg-wiria-blue-dark py-28">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        {/* Decorative Blobs */}
        <div className="absolute right-0 top-0 -mr-48 -mt-48 h-96 w-96 rounded-full bg-wiria-yellow/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-48 -ml-48 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="container relative z-10 mx-auto px-4 lg:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-8 inline-block rounded-full bg-wiria-yellow px-5 py-2 text-xs font-bold uppercase tracking-widest text-wiria-blue-dark shadow-lg shadow-wiria-yellow/20">
                Make an Impact
              </span>
              <h1 className="mb-8 text-5xl font-black tracking-tight text-white md:text-7xl">
                Your Support <span className="text-wiria-yellow">Saves Lives</span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed text-blue-100 md:text-2xl">
                Join us in our mission to empower communities, enhance health, and champion human
                rights in Homa Bay County.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="relative z-20 -mt-10 rounded-t-[3rem] bg-gray-50 py-20 shadow-2xl">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mx-auto max-w-3xl">
            <AnimatePresence mode="wait">
              {/* System Maintenance Notice */}
              <motion.div
                key="maintenance"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="group relative overflow-hidden rounded-[3rem] border-none bg-white shadow-2xl">
                  {/* Top Branding Accent */}
                  <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-wiria-yellow via-amber-500 to-wiria-yellow opacity-80" />

                  <CardBody className="p-8 text-center sm:p-16">
                    {/* Maintenance Icon */}
                    <div className="relative mb-10 inline-block">
                      <div className="flex h-24 w-24 animate-pulse items-center justify-center rounded-3xl bg-wiria-yellow/10 text-5xl">
                        ⚙️
                      </div>
                      <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-wiria-blue-dark text-xl text-white">
                        !
                      </div>
                    </div>

                    <h2 className="mb-6 text-3xl font-black tracking-tight text-wiria-blue-dark md:text-5xl">
                      Online Payments <span className="text-wiria-yellow">Under Maintenance</span>
                    </h2>

                    <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-600">
                      To serve you better, we are currently upgrading our M-Pesa and online payment
                      gateway. Direct online donations are temporarily switched off.
                    </p>

                    <div className="mb-10 rounded-[2rem] border border-blue-100/50 bg-blue-50/50 p-8">
                      <p className="mb-4 text-lg font-bold text-wiria-blue-dark">
                        You can still make your impact today!
                      </p>
                      <p className="mb-8 font-medium text-gray-500">
                        We are currently accepting donations exclusively via **Direct Bank Deposit**
                        to our official Co-operative Bank account.
                      </p>

                      {/* CTA Arrow Button */}
                      <button
                        onClick={() =>
                          document
                            .getElementById('bank-details')
                            ?.scrollIntoView({ behavior: 'smooth' })
                        }
                        className="group inline-flex items-center gap-3 rounded-2xl bg-wiria-blue-dark px-10 py-4 font-black text-white shadow-xl shadow-blue-900/20 transition-all hover:bg-blue-900"
                      >
                        <span>View Bank Details</span>
                        <svg
                          className="h-6 w-6 transition-transform group-hover:translate-y-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </button>
                    </div>

                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                      Online Giving will return soon
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Alternate Payment Methods */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <AlternatePaymentMethods />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <DonationImpactSection />
    </Layout>
  );
}

export default DonationsPage;
