/**
 * NoOpeningsView Component

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
    setIsSubscribed(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-12 text-center"
    >
      {/* Illustration */}
      <div className="relative mx-auto mb-6 h-32 w-32">
        <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-blue-100 to-purple-100" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">💼</span>
        </div>
      </div>

      {/* Message */}
      <h3 className="mb-3 text-2xl font-bold text-wiria-blue-dark">No Open Positions Right Now</h3>
      <p className="mx-auto mb-8 max-w-lg text-gray-600">
        We don't have any open positions at the moment, but we're always looking for talented
        individuals. Check back soon or leave your email to get notified when new opportunities
        arise.
      </p>

      {/* Email Subscription */}
      {!isSubscribed ? (
        <form onSubmit={handleSubscribe} className="mx-auto mb-8 max-w-md">
          <div className="flex gap-2 rounded-full bg-gray-100 p-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for job alerts"
              required
              className="flex-1 rounded-full border-0 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-wiria-blue-dark"
            />
            <button
              type="submit"
              className="rounded-full bg-wiria-blue-dark px-6 py-2 font-semibold text-white transition-all hover:bg-wiria-yellow hover:text-wiria-blue-dark"
            >
              Notify Me
            </button>
          </div>
        </form>
      ) : (
        <div className="mx-auto mb-8 max-w-md rounded-xl border border-green-200 bg-green-50 p-4">
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
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
        {/* Volunteer/Intern */}
        <Link
          to="/opportunities"
          className="group rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 transition-all hover:shadow-lg"
        >
          <div className="mb-3 text-3xl">🤝</div>
          <h4 className="mb-1 font-bold text-gray-800 transition-colors group-hover:text-green-700">
            Volunteer or Intern
          </h4>
          <p className="text-sm text-gray-600">Explore volunteer and internship opportunities</p>
        </Link>

        {/* Speculative Application */}
        <Link
          to="/contact"
          className="group rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 transition-all hover:shadow-lg"
        >
          <div className="mb-3 text-3xl">📧</div>
          <h4 className="mb-1 font-bold text-gray-800 transition-colors group-hover:text-blue-700">
            Speculative Application
          </h4>
          <p className="text-sm text-gray-600">Send us your CV for future consideration</p>
        </Link>

        {/* Follow Us */}
        <a
          href="https://www.linkedin.com/company/wiria-cbo"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 transition-all hover:shadow-lg"
        >
          <div className="mb-3 text-3xl">📱</div>
          <h4 className="mb-1 font-bold text-gray-800 transition-colors group-hover:text-purple-700">
            Follow Us
          </h4>
          <p className="text-sm text-gray-600">Stay updated on our social channels</p>
        </a>
      </div>
    </motion.div>
  );
}
