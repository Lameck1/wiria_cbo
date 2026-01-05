/**
 * VolunteerInternshipSection Component (Enhanced)
 * Features: CTA buttons, icons, better visual design
 */

import { motion } from 'framer-motion';
import { VOLUNTEER_ACTIVITIES, INTERNSHIP_AREAS } from '../constants/opportunitiesData';

interface InfoCardProps {
    title: string;
    description: string;
    items: string[];
    icon: React.ReactNode;
    ctaText: string;
    ctaAction: () => void;
    gradient: string;
    delay?: number;
}

function InfoCard({ title, description, items, icon, ctaText, ctaAction, gradient, delay = 0 }: InfoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full border border-gray-100 hover:shadow-xl transition-shadow"
        >
            {/* Header with Gradient */}
            <div className={`p-6 ${gradient}`}>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        {icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{title}</h3>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-grow flex flex-col">
                <p className="text-gray-600 mb-6">{description}</p>

                <ul className="space-y-3 mb-6 flex-grow">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700">
                            <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                                ✓
                            </span>
                            {item}
                        </li>
                    ))}
                </ul>

                {/* CTA Button */}
                <button
                    onClick={ctaAction}
                    className="w-full bg-wiria-blue-dark hover:bg-wiria-yellow hover:text-wiria-blue-dark text-white font-semibold py-3 px-6 rounded-full transition-all hover:shadow-md flex items-center justify-center gap-2"
                >
                    {ctaText}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
        </motion.div>
    );
}

interface VolunteerInternshipSectionProps {
    onScrollToOpenings?: (filter?: 'VOLUNTEER' | 'INTERNSHIP') => void;
}

export function VolunteerInternshipSection({ onScrollToOpenings }: VolunteerInternshipSectionProps) {
    const handleVolunteerClick = () => {
        onScrollToOpenings?.('VOLUNTEER');
        // Scroll to openings section
        document.getElementById('current-openings')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleInternshipClick = () => {
        onScrollToOpenings?.('INTERNSHIP');
        document.getElementById('current-openings')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <InfoCard
                title="Volunteer with Us"
                description="Our volunteers are the backbone of our community initiatives. Whether you can spare a few hours a week or want to get involved in a specific project, your contribution is valuable."
                items={VOLUNTEER_ACTIVITIES}
                icon={
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                }
                ctaText="Browse Volunteer Roles"
                ctaAction={handleVolunteerClick}
                gradient="bg-gradient-to-r from-green-500 to-emerald-600"
                delay={0}
            />

            <InfoCard
                title="Internship Program"
                description="Our internship program offers students and recent graduates a chance to gain hands-on experience in the non-profit sector while developing professional skills."
                items={INTERNSHIP_AREAS}
                icon={
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                }
                ctaText="Explore Internships"
                ctaAction={handleInternshipClick}
                gradient="bg-gradient-to-r from-blue-500 to-indigo-600"
                delay={0.1}
            />
        </div>
    );
}
