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
            <section className="relative bg-wiria-blue-dark py-28 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                </div>
                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-wiria-yellow/10 rounded-full blur-3xl -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -ml-48 -mb-48" />

                <div className="container mx-auto px-4 lg:px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-5 py-2 bg-wiria-yellow text-wiria-blue-dark rounded-full text-xs font-bold uppercase tracking-widest mb-8 shadow-lg shadow-wiria-yellow/20">
                                Make an Impact
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
                                Your Support <span className="text-wiria-yellow">Saves Lives</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-100 font-medium leading-relaxed max-w-2xl mx-auto">
                                Join us in our mission to empower communities, enhance health, and champion
                                human rights in Homa Bay County.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Donation Section */}
            <section className="py-20 bg-gray-50 relative -mt-10 rounded-t-[3rem] shadow-2xl z-20">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="max-w-3xl mx-auto">
                        <AnimatePresence mode="wait">
                            {/* System Maintenance Notice */}
                            <motion.div
                                key="maintenance"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className="bg-white shadow-2xl rounded-[3rem] overflow-hidden border-none relative group">
                                    {/* Top Branding Accent */}
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-wiria-yellow via-amber-500 to-wiria-yellow opacity-80" />

                                    <CardBody className="p-8 sm:p-16 text-center">
                                        {/* Maintenance Icon */}
                                        <div className="relative inline-block mb-10">
                                            <div className="w-24 h-24 bg-wiria-yellow/10 rounded-3xl flex items-center justify-center text-5xl animate-pulse">
                                                ⚙️
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-wiria-blue-dark text-white rounded-full flex items-center justify-center text-xl border-4 border-white">
                                                !
                                            </div>
                                        </div>

                                        <h2 className="text-3xl md:text-5xl font-black text-wiria-blue-dark mb-6 tracking-tight">
                                            Online Payments <span className="text-wiria-yellow">Under Maintenance</span>
                                        </h2>

                                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                                            To serve you better, we are currently upgrading our M-Pesa and online payment gateway. Direct online donations are temporarily switched off.
                                        </p>

                                        <div className="bg-blue-50/50 rounded-[2rem] p-8 border border-blue-100/50 mb-10">
                                            <p className="text-wiria-blue-dark font-bold text-lg mb-4">
                                                You can still make your impact today!
                                            </p>
                                            <p className="text-gray-500 mb-8 font-medium">
                                                We are currently accepting donations exclusively via **Direct Bank Deposit** to our official Co-operative Bank account.
                                            </p>

                                            {/* CTA Arrow Button */}
                                            <button
                                                onClick={() => document.getElementById('bank-details')?.scrollIntoView({ behavior: 'smooth' })}
                                                className="inline-flex items-center gap-3 bg-wiria-blue-dark text-white font-black py-4 px-10 rounded-2xl hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 group"
                                            >
                                                <span>View Bank Details</span>
                                                <svg className="w-6 h-6 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                </svg>
                                            </button>
                                        </div>

                                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
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
