/**
 * ProcessSteps Component
 * Reusable numbered steps for processes (application, how it works, etc.)
 * Single responsibility: Render a horizontal/grid process flow
 */

import { motion } from 'framer-motion';

interface ProcessStep {
    title: string;
    description: string;
}

interface ProcessStepsProps {
    steps: ProcessStep[];
    columns?: 3 | 4 | 5;
}

export function ProcessSteps({ steps, columns = 4 }: ProcessStepsProps) {
    const gridClass = {
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
        5: 'md:grid-cols-5',
    }[columns];

    return (
        <div className={`grid ${gridClass} gap-6`}>
            {steps.map((step, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                >
                    {/* Number Circle */}
                    <div className="bg-wiria-yellow text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                        {index + 1}
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-wiria-blue-dark mb-2">{step.title}</h4>

                    {/* Description */}
                    <p className="text-sm text-gray-600">{step.description}</p>
                </motion.div>
            ))}
        </div>
    );
}
