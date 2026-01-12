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
    <section className="overflow-hidden bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="relative mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-4 inline-block rounded-full bg-wiria-blue-dark/5 px-4 py-1.5 text-sm font-bold text-wiria-blue-dark"
          >
            Your Impact Matters
          </motion.div>
          <h2 className="mb-6 text-4xl font-bold text-wiria-blue-dark md:text-5xl">
            See the Difference You Make
          </h2>
          <div className="mx-auto mb-8 h-1.5 w-24 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light" />
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Every shilling you donate goes directly towards fueling our high-impact programs in Homa
            Bay County.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3 lg:gap-12"
        >
          {IMPACT_ITEMS.map((item) => (
            <motion.div
              key={item.amount}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl shadow-gray-200/50"
            >
              <div
                className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${item.color} mb-8 flex items-center justify-center text-4xl shadow-lg ring-4 ring-white transition-transform duration-300 group-hover:rotate-6`}
              >
                {item.icon}
              </div>

              <div className="mb-4">
                <span className="text-3xl font-black text-wiria-blue-dark">
                  KES {item.amountDisplay}
                </span>
              </div>

              <h4 className="mb-4 text-xl font-bold text-gray-800">{item.title}</h4>
              <p className="mb-8 leading-relaxed text-gray-600">{item.description}</p>

              <div className="mt-auto w-full border-t border-gray-100 pt-6 text-sm font-bold text-wiria-blue-dark/40 transition-colors group-hover:text-wiria-yellow">
                HIGH IMPACT PROGRAM
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
