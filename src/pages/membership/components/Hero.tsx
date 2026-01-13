import { memo } from 'react';
import { motion } from 'framer-motion';

export const MembershipHero = memo(function MembershipHero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-wiria-blue-dark to-blue-900 py-20 text-white">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-wiria-yellow blur-3xl" />
                <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-400 blur-3xl" />
            </div>
            <div className="container relative z-10 mx-auto px-4 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 text-4xl font-bold md:text-5xl"
                >
                    Become a Member
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mx-auto max-w-2xl text-xl text-gray-200"
                >
                    Join WIRIA CBO and be part of positive change in our community
                </motion.p>
            </div>
        </section>
    );
});
