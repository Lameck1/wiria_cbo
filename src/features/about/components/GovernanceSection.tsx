/**
 * Governance Section
 * Organization structure: 3 levels, Secretariat with Tree View
 */

import { motion } from 'framer-motion';
import { GOVERNANCE_LEVELS, SECRETARIAT_TEAM } from '../constants/aboutData';

export function GovernanceSection() {
    const leadership = SECRETARIAT_TEAM.find(d => d.title === 'Leadership')?.members[0];
    const departments = SECRETARIAT_TEAM.filter(d => d.title !== 'Leadership');

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 lg:px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-wiria-blue-dark mb-6">Our Governance</h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-wiria-yellow to-wiria-green-light mx-auto rounded-full mb-8" />
                    <p className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed">
                        WIRIA CBO maintains a transparent, accountable governance structure with clear leadership from our community members to professional staff.
                    </p>
                </div>

                {/* Governance Levels Overview */}
                <div className="grid md:grid-cols-3 gap-8 mb-32 max-w-6xl mx-auto">
                    {GOVERNANCE_LEVELS.map((level, index) => (
                        <motion.div
                            key={level.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-2xl shadow-lg p-10 text-center group hover:shadow-2xl transition-all duration-300 border border-gray-50"
                        >
                            <div className="flex justify-center mb-8">
                                <div className={`w-20 h-20 ${level.gradient} text-white rounded-3xl flex items-center justify-center font-bold text-3xl shadow-xl group-hover:scale-110 transition-transform`}>
                                    {level.level}
                                </div>
                            </div>
                            <h4 className="font-bold text-2xl text-wiria-blue-dark mb-4">{level.title}</h4>
                            <p className="text-gray-600 text-lg">{level.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Secretariat Org Chart / Tree */}
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 px-4">
                        <h3 className="text-3xl font-bold text-wiria-blue-dark mb-4">WIRIA CBO Secretariat Team</h3>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            Organized to ensure maximum community impact and professional accountability.
                        </p>
                    </div>

                    <div className="relative pt-12">
                        {/* THE TREE ROOT: Executive Director */}
                        {leadership && (
                            <div className="flex flex-col items-center mb-24 relative">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col items-center group relative z-10"
                                >
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-wiria-yellow shadow-2xl mb-6 bg-white transition-transform duration-500 group-hover:scale-110">
                                        <img src={leadership.image} alt={leadership.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-2xl font-bold text-wiria-blue-dark mb-1">{leadership.name}</h4>
                                        {leadership.roles.map(role => (
                                            <p key={role} className="text-wiria-blue-dark/70 font-medium text-sm px-4 py-1 bg-wiria-yellow/10 rounded-full inline-block mt-1">
                                                {role}
                                            </p>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Connecting Line: Root to Branch Point */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-wiria-yellow to-gray-200" />
                            </div>
                        )}

                        {/* THE BRANCHES: Units */}
                        <div className="grid md:grid-cols-3 gap-12 relative">
                            {/* Connecting Line: Branch Point to Branches */}
                            <div className="absolute -top-8 left-[16.6%] right-[16.6%] h-0.5 bg-gray-200 hidden md:block" />

                            {departments.map((dept, deptIdx) => (
                                <div key={dept.title} className="flex flex-col items-center relative">
                                    {/* Vertical Connectors */}
                                    <div className="w-0.5 h-8 bg-gray-200 hidden md:block" />

                                    <div className="w-full">
                                        <div className="text-center mb-12">
                                            <h5 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8 px-4 py-2 border border-gray-100 rounded-lg inline-block">
                                                {dept.title}
                                            </h5>

                                            <div className="flex flex-col items-center gap-12">
                                                {dept.members.map((member, mIdx) => (
                                                    <motion.div
                                                        key={member.name}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        whileInView={{ opacity: 1, scale: 1 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: (deptIdx * 0.2) + (mIdx * 0.1) }}
                                                        className="flex flex-col items-center group"
                                                    >
                                                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 shadow-md mb-4 bg-white transition-all duration-300 group-hover:border-wiria-blue-dark group-hover:shadow-xl group-hover:scale-105">
                                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="text-center">
                                                            <h6 className="font-bold text-wiria-blue-dark text-lg mb-1">{member.name}</h6>
                                                            <div className="flex flex-col items-center gap-1">
                                                                {member.roles.map(role => (
                                                                    <span key={role} className="text-xs text-gray-500 font-medium leading-tight max-w-[180px]">
                                                                        {role}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default GovernanceSection;
