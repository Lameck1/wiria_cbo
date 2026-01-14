/**
 * Programs Page - React patterns + Animations
 * Uses component composition, data separation, and Framer Motion animations
 */

import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';

import { useAuth } from '@/features/auth/context/AuthContext';
import { ProgramDetail } from '@/features/programs/components/ProgramDetail';
import { ProgramIcon } from '@/features/programs/components/ProgramIcons';
import { PROGRAMS_DATA, CROSS_CUTTING_THEMES } from '@/features/programs/constants/programsData';
import { UserRole } from '@/shared/types';

function ProgramsPage() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(PROGRAMS_DATA[0]?.id || 'health-detail');

  // Handle hash-based navigation from Focus Areas
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const matchingProgram = PROGRAMS_DATA.find((p) => p.id === hash);
      if (matchingProgram) {
        setActiveTab(matchingProgram.id);
        // Scroll to the programs section
        setTimeout(() => {
          const element = document.getElementById('programs-tabs');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <main>
      {/* Hero Section with Animations */}
      <section className="relative overflow-hidden bg-gradient-to-r from-wiria-blue-dark to-blue-800 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${import.meta.env.BASE_URL}images/programs-hero.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
        </motion.div>
        <div className="container relative z-10 mx-auto px-4 lg:px-6">
          <div className="mx-auto max-w-4xl text-center text-white">
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-6 inline-block rounded-full border border-wiria-yellow/30 bg-wiria-yellow/20 px-4 py-1.5 text-sm font-medium text-wiria-yellow backdrop-blur-sm"
            >
              {PROGRAMS_DATA.length} Strategic Pillars
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="mb-6 text-5xl font-bold md:text-6xl"
            >
              Our Programs
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
              className="text-xl text-wiria-green-light md:text-2xl"
            >
              Transforming lives through health, rights, and economic empowerment
            </motion.p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Strategic Pillars with Tab Interface */}
      <section id="programs-tabs" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-wiria-blue-dark md:text-4xl">
              Four Strategic Pillars
            </h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '6rem' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto mb-6 h-1 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light"
            ></motion.div>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Explore our comprehensive approach to addressing community challenges. Select a
              pillar below to learn more.
            </p>
          </motion.div>

          {/* Tab Navigation with Animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mb-8 max-w-4xl md:mb-10"
          >
            <div className="flex overflow-hidden rounded-lg bg-white shadow-md" role="tablist">
              {PROGRAMS_DATA.map((program, index) => {
                const borderColors = [
                  'border-green-500',
                  'border-purple-500',
                  'border-blue-600',
                  'border-wiria-yellow',
                ];
                return (
                  <motion.button
                    key={program.id}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className={`pillar-tab flex-1 border-b-4 px-3 py-3 text-center font-semibold transition-all duration-300 sm:px-6 sm:py-5 ${activeTab === program.id
                        ? `active ${borderColors[index]} bg-gray-50`
                        : 'border-transparent hover:bg-gray-50'
                      }`}
                    onClick={() => setActiveTab(program.id)}
                    role="tab"
                    aria-selected={activeTab === program.id}
                    aria-controls={program.id}
                  >
                    <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-2">
                      <motion.div
                        animate={{ rotate: activeTab === program.id ? 360 : 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      >
                        <ProgramIcon type={program.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
                      </motion.div>
                      <span className="text-sm sm:text-lg">{program.title.split(' ')[0]}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Program Details with Tab Transition */}
          <div className="mx-auto max-w-4xl">
            {PROGRAMS_DATA.map(
              (program) =>
                activeTab === program.id && <ProgramDetail key={program.id} program={program} />
            )}
          </div>
        </div>
      </section>

      {/* Cross-Cutting Themes with Animations */}
      <section className="bg-gradient-to-r from-wiria-blue-dark to-blue-800 py-16">
        <div className="container mx-auto max-w-6xl px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Cross-Cutting Themes
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-wiria-green-light">
              Our programs integrate critical themes that enhance impact and sustainability
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {CROSS_CUTTING_THEMES.map((theme, index) => (
              <motion.div
                key={theme.title}
                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{
                  y: -8,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                }}
                className="cursor-default rounded-2xl border border-white/10 bg-white bg-opacity-10 p-8 text-white backdrop-blur-md transition-colors duration-300"
              >
                <div className="mb-6 flex items-center">
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    className="mr-4 rounded-xl bg-white/10 p-3"
                  >
                    <ProgramIcon type={theme.icon} className="h-10 w-10 text-wiria-green-light" />
                  </motion.div>
                  <h3 className="text-2xl font-bold tracking-tight">{theme.title}</h3>
                </div>
                <p className="text-lg leading-relaxed text-gray-100">{theme.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action with Animations */}
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
              Whether you're seeking support, want to volunteer, or wish to partner with us, there
              are many ways to engage with our programs and make a difference in the community.
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
    </main>
  );
}

export default ProgramsPage;
