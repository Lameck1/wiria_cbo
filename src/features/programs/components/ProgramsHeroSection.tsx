import { motion } from 'framer-motion';

import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';

import { PROGRAMS_DATA } from '../constants/programsData';

export function ProgramsHeroSection() {
  return (
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
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Programs', path: '/programs' },
          ]}
          className="mb-8 text-white/80"
        />
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
  );
}
