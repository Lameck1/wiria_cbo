import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import type { HeroSlide } from '../types';

interface HeroContentProps {
  currentIndex: number;
  currentSlide: HeroSlide;
  cta: {
    text: string;
    href: string;
    className: string;
    showArrow: boolean;
  };
}

export function HeroContent({ currentIndex, currentSlide, cta }: HeroContentProps) {
  const { text, href, className, showArrow } = cta;

  return (
    <div className="relative z-10 flex h-full items-center justify-center">
      <div className="container mx-auto px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-3 flex justify-center"
              >
                <span className="rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-md">
                  {currentSlide.badge}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4 px-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
              >
                {currentSlide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mx-auto mb-8 max-w-2xl px-4 text-base leading-relaxed text-white/95 md:text-lg"
                style={{ textShadow: '0 1px 10px rgba(0,0,0,0.2)' }}
              >
                {currentSlide.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center gap-3"
              >
                <Link
                  to={href}
                  className={`${className} group inline-flex transform items-center gap-2 rounded-full px-6 py-3 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                >
                  {text}
                  {showArrow && (
                    <svg
                      className="h-4 w-4 transform transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  )}
                </Link>

                <Link
                  to="/about"
                  className="group inline-flex items-center gap-2 rounded-full border-2 border-white/50 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white/20"
                >
                  Our Story
                  <svg
                    className="h-4 w-4 transform transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
