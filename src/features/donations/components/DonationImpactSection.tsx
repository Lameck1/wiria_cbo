/**
 * Donation Impact Section Component
 * Shows what different donation amounts provide to the community
 */

import { motion } from 'framer-motion';

interface ImpactCard {
    amount: string;
    amountDisplay: string;
    title: string;
    description: string;
    icon: string;
    color: string;
}

const IMPACT_ITEMS: ImpactCard[] = [
    {
        amount: '500',
        amountDisplay: '500',
        title: 'Education Kits',
        description: 'Provide mentorship kits for 5 youth in our empowerment programs.',
        icon: '📚',
        color: 'from-blue-400 to-blue-600',
    },
    {
        amount: '2000',
        amountDisplay: '2K',
        title: 'Health Services',
        description: 'Supports HIV testing and counseling for 20 community members.',
        icon: '🏥',
        color: 'from-green-400 to-green-600',
    },
    {
        amount: '5000',
        amountDisplay: '5K',
        title: 'Economic Empowerment',
        description: 'Enables business skills training for 10 women in our livelihood program.',
        icon: '⚖️',
        color: 'from-wiria-yellow to-orange-500',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
        },
    },
};

export function DonationImpactSection() {
    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="text-center mb-16 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 bg-wiria-blue-dark/5 text-wiria-blue-dark rounded-full text-sm font-bold mb-4"
                    >
                        Your Impact Matters
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold text-wiria-blue-dark mb-6">
                        See the Difference You Make
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-wiria-yellow to-wiria-green-light mx-auto rounded-full mb-8" />
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Every shilling you donate goes directly towards fueling our high-impact programs in Homa Bay County.
                    </p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto"
                >
                    {IMPACT_ITEMS.map((item) => (
                        <motion.div
                            key={item.amount}
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center group"
                        >
                            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-4xl shadow-lg mb-8 group-hover:rotate-6 transition-transform duration-300 ring-4 ring-white`}>
                                {item.icon}
                            </div>

                            <div className="mb-4">
                                <span className="text-3xl font-black text-wiria-blue-dark">KES {item.amountDisplay}</span>
                            </div>

                            <h4 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h4>
                            <p className="text-gray-600 leading-relaxed mb-8">{item.description}</p>

                            <div className="mt-auto pt-6 border-t border-gray-100 w-full text-sm font-bold text-wiria-blue-dark/40 group-hover:text-wiria-yellow transition-colors">
                                HIGH IMPACT PROGRAM
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
