/**
 * PageHero Component
 * Reusable hero section for all pages

 */

import { ReactNode } from 'react';

import { motion } from 'framer-motion';

interface PageHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  backgroundImage?: string;
  backgroundOpacity?: number;
  children?: ReactNode;
}

export function PageHero({
  badge,
  title,
  subtitle,
  backgroundImage,
  backgroundOpacity = 20,
  children,
}: PageHeroProps) {
  return (
    <section className="relative bg-gradient-to-r from-wiria-blue-dark to-blue-800 py-24">
      {/* Background Image Overlay */}
      {backgroundImage && (
        <div className={`absolute inset-0 opacity-${backgroundOpacity}`}>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${
                backgroundImage.startsWith('/')
                  ? import.meta.env.BASE_URL + backgroundImage.slice(1)
                  : backgroundImage
              }')`,
            }}
          />
        </div>
      )}

      <div className="container relative z-10 mx-auto px-4 lg:px-6">
        <div className="mx-auto max-w-4xl text-center text-white">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-block rounded-full border border-wiria-yellow/30 bg-wiria-yellow/20 px-4 py-1.5 text-sm font-medium text-wiria-yellow backdrop-blur-sm"
          >
            {badge}
          </motion.span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-5xl font-bold md:text-6xl"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-wiria-green-light md:text-2xl"
          >
            {subtitle}
          </motion.p>

          {/* Optional children (stats, CTAs, etc.) */}
          {children}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
