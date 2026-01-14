/**
 * About Page
 */

import { motion } from 'framer-motion';

import {
  OurStorySection,
  MissionVisionSection,
  CoreValuesSection,
  GovernanceSection,
  AboutPartnersSection,
} from '@/features/about';
import { WhoWeServeSection } from '@/shared/components/sections/WhoWeServeSection';

function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-wiria-blue-dark to-blue-800 py-24">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${import.meta.env.BASE_URL}images/about-hero.png')` }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 lg:px-6">
          <div className="mx-auto max-w-4xl text-center text-white">
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-block rounded-full border border-wiria-yellow/30 bg-wiria-yellow/20 px-4 py-1.5 text-sm font-medium text-wiria-yellow backdrop-blur-sm"
            >
              Established 2019
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 text-5xl font-bold md:text-6xl"
            >
              About WIRIA
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-wiria-green-light md:text-2xl"
            >
              Our Story, Our Mission, Our Leadership
            </motion.p>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Our Story Section */}
      <OurStorySection />

      {/* Mission & Vision Section */}
      <MissionVisionSection />

      {/* Who We Serve Section */}
      <WhoWeServeSection />

      {/* Core Values Section */}
      <CoreValuesSection />

      {/* Governance Section */}
      <GovernanceSection />

      {/* Partners Section */}
      <AboutPartnersSection />
    </main>
  );
}

export default AboutPage;
