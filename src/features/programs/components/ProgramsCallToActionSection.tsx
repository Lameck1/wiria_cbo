import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { useAuth } from '@/features/auth/context/useAuth';
import { UserRole } from '@/shared/types';

export function ProgramsCallToActionSection() {
  const { user, isAuthenticated } = useAuth();

  return (
    <section className="bg-wiria-green-light py-16">
      <div className="container mx-auto max-w-4xl px-4 text-center lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-wiria-blue-dark md:text-4xl">
            Get Involved in Our Programs
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '6rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mb-6 h-1 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light"
          ></motion.div>
          <p className="mb-8 text-lg text-gray-700">
            Whether you're seeking support, want to volunteer, or wish to partner with us, there are
            many ways to engage with our programs and make a difference in the community.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            {isAuthenticated && user?.role === UserRole.MEMBER ? (
              <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/member-portal"
                  className="block rounded-full bg-wiria-blue-dark px-8 py-4 text-center font-bold text-white shadow-lg hover:shadow-xl sm:w-64"
                >
                  Go to Dashboard
                </Link>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/membership"
                  className="block rounded-full bg-wiria-blue-dark px-8 py-4 text-center font-bold text-white shadow-lg hover:shadow-xl sm:w-64"
                >
                  Join as a Member
                </Link>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/opportunities"
                className="block rounded-full bg-wiria-yellow px-8 py-4 text-center font-bold text-white shadow-lg hover:shadow-xl sm:w-64"
              >
                Volunteer With Us
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="block rounded-full bg-white px-8 py-4 text-center font-bold text-wiria-blue-dark shadow-lg hover:shadow-xl sm:w-64"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
