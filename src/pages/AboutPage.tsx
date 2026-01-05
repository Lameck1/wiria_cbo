/**
 * About Page - Refactored with Component Composition
 * Matches original HTML implementation with content parity
 */

import { Layout } from '@/shared/components/layout/Layout';
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
        <Layout>
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

                    <div className="container mx-auto px-4 lg:px-6 relative z-10">
                        <div className="max-w-4xl mx-auto text-center text-white">
                            <motion.span
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-block px-4 py-1.5 bg-wiria-yellow/20 text-wiria-yellow rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-wiria-yellow/30"
                            >
                                Established 2019
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-5xl md:text-6xl font-bold mb-6"
                            >
                                About WIRIA
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-xl md:text-2xl text-wiria-green-light"
                            >
                                Our Story, Our Mission, Our Leadership
                            </motion.p>
                        </div>
                    </div>

                    {/* Bottom gradient */}
                    <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent" />
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
        </Layout>
    );
}

export default AboutPage;
