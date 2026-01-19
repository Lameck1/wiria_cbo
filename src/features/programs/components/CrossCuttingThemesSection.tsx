import { motion } from 'framer-motion';

import { ProgramIcon } from './ProgramIcons';
import { CROSS_CUTTING_THEMES } from '../constants/programsData';

export function CrossCuttingThemesSection() {
  return (
    <section className="bg-gradient-to-r from-wiria-blue-dark to-blue-800 py-16">
      <div className="container mx-auto max-w-6xl px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Cross-Cutting Themes</h2>
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
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
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
  );
}
