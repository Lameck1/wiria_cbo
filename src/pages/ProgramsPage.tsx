/**
 * Programs Page - Refactored with React Best Practices + Premium Animations
 * Uses component composition, data separation, and Framer Motion animations
 */

import { Layout } from '@/shared/components/layout/Layout';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PROGRAMS_DATA, CROSS_CUTTING_THEMES } from '@/features/programs/constants/programsData';
import { ProgramDetail } from '@/features/programs/components/ProgramDetail';
import { ProgramIcon } from '@/features/programs/components/ProgramIcons';
import { useAuth } from '@/features/auth/context/AuthContext';
import { UserRole } from '@/shared/types';

function ProgramsPage() {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(PROGRAMS_DATA[0]?.id || 'health-detail');

    // Handle hash-based navigation from Focus Areas
    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (hash) {
            const matchingProgram = PROGRAMS_DATA.find(p => p.id === hash);
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
        <Layout>
            <main>
                {/*  Hero Section with Animations */}
                <section className="relative bg-gradient-to-r from-wiria-blue-dark to-blue-800 py-24 overflow-hidden">
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
                    <div className="container mx-auto px-4 lg:px-6 relative z-10">
                        <div className="max-w-4xl mx-auto text-center text-white">
                            <motion.span
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="inline-block px-4 py-1.5 bg-wiria-yellow/20 text-wiria-yellow rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-wiria-yellow/30"
                            >
                                {PROGRAMS_DATA.length} Strategic Pillars
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                                className="text-5xl md:text-6xl font-bold mb-6"
                            >
                                Our Programs
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                                className="text-xl md:text-2xl text-wiria-green-light"
                            >
                                Transforming lives through health, rights, and economic empowerment
                            </motion.p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
                </section>

                {/* Strategic Pillars with Tab Interface */}
                <section id="programs-tabs" className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 lg:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-wiria-blue-dark mb-4">Four Strategic Pillars</h2>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: '6rem' }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="h-1 bg-gradient-to-r from-wiria-yellow to-wiria-green-light mx-auto rounded-full mb-6"
                            ></motion.div>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Explore our comprehensive approach to addressing community challenges. Select a pillar below to learn more.
                            </p>
                        </motion.div>

                        {/* Tab Navigation with Animations */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="max-w-4xl mx-auto mb-8 md:mb-10"
                        >
                            <div className="flex bg-white rounded-lg shadow-md overflow-hidden" role="tablist">
                                {PROGRAMS_DATA.map((program, index) => {
                                    const borderColors = ['border-green-500', 'border-purple-500', 'border-blue-600', 'border-wiria-yellow'];
                                    return (
                                        <motion.button
                                            key={program.id}
                                            whileHover={{ y: -2, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{ duration: 0.2 }}
                                            className={`pillar-tab flex-1 px-3 py-3 sm:px-6 sm:py-5 text-center font-semibold transition-all duration-300 border-b-4 ${activeTab === program.id ? `active ${borderColors[index]} bg-gray-50` : 'border-transparent hover:bg-gray-50'
                                                }`}
                                            onClick={() => setActiveTab(program.id)}
                                            role="tab"
                                            aria-selected={activeTab === program.id}
                                            aria-controls={program.id}
                                        >
                                            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                                                <motion.div
                                                    animate={{ rotate: activeTab === program.id ? 360 : 0 }}
                                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                                >
                                                    <ProgramIcon type={program.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </motion.div>
                                                <span className="text-sm sm:text-lg">{program.title.split(' ')[0]}</span>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Program Details with Tab Transition */}
                        <div className="max-w-4xl mx-auto">
                            {PROGRAMS_DATA.map((program) => (
                                activeTab === program.id && (
                                    <ProgramDetail key={program.id} program={program} />
                                )
                            ))}
                        </div>
                    </div>
                </section>

                {/* Cross-Cutting Themes with Animations */}
                <section className="py-16 bg-gradient-to-r from-wiria-blue-dark to-blue-800">
                    <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Cross-Cutting Themes</h2>
                            <p className="text-lg text-wiria-green-light max-w-3xl mx-auto">
                                Our programs integrate critical themes that enhance impact and sustainability
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-8">
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
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)'
                                    }}
                                    className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl text-white cursor-default border border-white/10 transition-colors duration-300"
                                >
                                    <div className="flex items-center mb-6">
                                        <motion.div
                                            whileHover={{ rotate: 12, scale: 1.1 }}
                                            className="bg-white/10 p-3 rounded-xl mr-4"
                                        >
                                            <ProgramIcon type={theme.icon} className="w-10 h-10 text-wiria-green-light" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold tracking-tight">{theme.title}</h3>
                                    </div>
                                    <p className="leading-relaxed text-gray-100 text-lg">{theme.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action with Animations */}
                <section className="py-16 bg-wiria-green-light">
                    <div className="container mx-auto px-4 lg:px-6 text-center max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-wiria-blue-dark mb-4">Get Involved in Our Programs</h2>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: '6rem' }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="h-1 bg-gradient-to-r from-wiria-yellow to-wiria-green-light mx-auto rounded-full mb-6"
                            ></motion.div>
                            <p className="text-lg text-gray-700 mb-8">
                                Whether you're seeking support, want to volunteer, or wish to partner with us, there are many ways to engage with our
                                programs and make a difference in the community.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {isAuthenticated && user?.role === UserRole.MEMBER ? (
                                    <motion.a
                                        href="/member-portal"
                                        whileHover={{ scale: 1.05, y: -4 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-wiria-blue-dark text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl sm:w-64 text-center"
                                    >
                                        Go to Dashboard
                                    </motion.a>
                                ) : (
                                    <motion.a
                                        href="/membership"
                                        whileHover={{ scale: 1.05, y: -4 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-wiria-blue-dark text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl sm:w-64 text-center"
                                    >
                                        Join as a Member
                                    </motion.a>
                                )}
                                <motion.a
                                    href="/opportunities"
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-wiria-yellow text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl sm:w-64 text-center"
                                >
                                    Volunteer With Us
                                </motion.a>
                                <motion.a
                                    href="/contact"
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white text-wiria-blue-dark font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl sm:w-64 text-center"
                                >
                                    Contact Us
                                </motion.a>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}

export default ProgramsPage;
