/**
 * NoOpeningsView Component
 * Single responsibility: Display when no job openings are available
 * Includes email signup, alternative links, and speculative application option
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function NoOpeningsView() {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Call subscription API in production
        setIsSubscribed(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
        >
            {/* Illustration */}
            <div className="w-32 h-32 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">💼</span>
                </div>
            </div>

            {/* Message */}
            <h3 className="text-2xl font-bold text-wiria-blue-dark mb-3">
                No Open Positions Right Now
            </h3>
            <p className="text-gray-600 max-w-lg mx-auto mb-8">
                We don't have any open positions at the moment, but we're always looking for talented individuals.
                Check back soon or leave your email to get notified when new opportunities arise.
            </p>

            {/* Email Subscription */}
            {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="max-w-md mx-auto mb-8">
                    <div className="flex gap-2 p-2 bg-gray-100 rounded-full">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email for job alerts"
                            required
                            className="flex-1 px-4 py-2 bg-white rounded-full border-0 focus:ring-2 focus:ring-wiria-blue-dark outline-none"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-wiria-blue-dark text-white rounded-full font-semibold hover:bg-wiria-yellow hover:text-wiria-blue-dark transition-all"
                        >
                            Notify Me
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-md mx-auto mb-8">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        <div className="text-left">
                            <p className="font-semibold text-green-800">You're on the list!</p>
                            <p className="text-sm text-green-600">We'll email you when new positions open.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Alternative Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {/* Volunteer/Intern */}
                <Link
                    to="/opportunities"
                    className="group bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                    <div className="text-3xl mb-3">🤝</div>
                    <h4 className="font-bold text-gray-800 mb-1 group-hover:text-green-700 transition-colors">
                        Volunteer or Intern
                    </h4>
                    <p className="text-sm text-gray-600">
                        Explore volunteer and internship opportunities
                    </p>
                </Link>

                {/* Speculative Application */}
                <Link
                    to="/contact"
                    className="group bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                    <div className="text-3xl mb-3">📧</div>
                    <h4 className="font-bold text-gray-800 mb-1 group-hover:text-blue-700 transition-colors">
                        Speculative Application
                    </h4>
                    <p className="text-sm text-gray-600">
                        Send us your CV for future consideration
                    </p>
                </Link>

                {/* Follow Us */}
                <a
                    href="https://www.linkedin.com/company/wiria-cbo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                    <div className="text-3xl mb-3">📱</div>
                    <h4 className="font-bold text-gray-800 mb-1 group-hover:text-purple-700 transition-colors">
                        Follow Us
                    </h4>
                    <p className="text-sm text-gray-600">
                        Stay updated on our social channels
                    </p>
                </a>
            </div>
        </motion.div>
    );
}
