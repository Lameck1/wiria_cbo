/**
 * SafeguardingCallout Component
 * Callout section for reporting safeguarding concerns
 * Single Responsibility: Display safeguarding information with CTA
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function SafeguardingCallout() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl"
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-red-800 text-lg mb-1">Need to Report a Concern?</h4>
                    <p className="text-red-700/80 text-sm mb-4">
                        If you have a safeguarding concern related to PSEAH or Child Protection, we have a dedicated confidential reporting system.
                    </p>
                    <Link
                        to="/safeguarding"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-all text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                        Report a Safeguarding Concern
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
