import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import { ProgramDetail } from './ProgramDetail';
import { ProgramIcon } from './ProgramIcons';
import { PROGRAMS_DATA } from '../constants/programsData';

export function ProgramsPillarsSection() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(PROGRAMS_DATA[0]?.id ?? 'health-detail');

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const matchingProgram = PROGRAMS_DATA.find((program) => program.id === hash);
      if (matchingProgram) {
        setActiveTab(matchingProgram.id);
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
            Explore our comprehensive approach to addressing community challenges. Select a pillar
            below to learn more.
          </p>
        </motion.div>

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
                  className={`pillar-tab flex-1 border-b-4 px-3 py-3 text-center font-semibold transition-all duration-300 sm:px-6 sm:py-5 ${
                    activeTab === program.id
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

        <div className="mx-auto max-w-4xl">
          {PROGRAMS_DATA.map(
            (program) =>
              activeTab === program.id && <ProgramDetail key={program.id} program={program} />
          )}
        </div>
      </div>
    </section>
  );
}
