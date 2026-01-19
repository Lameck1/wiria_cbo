import { motion, AnimatePresence } from 'framer-motion';

import type { HeroSlide } from '../types';

interface HeroBackgroundProps {
  currentIndex: number;
  currentSlide: HeroSlide;
}

export function HeroBackground({ currentIndex, currentSlide }: HeroBackgroundProps) {
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        className="absolute inset-0"
      >
        {currentSlide.backgroundImage ? (
          <div className="relative h-full w-full">
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: 'linear' }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentSlide.backgroundImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 md:bg-gradient-to-r md:from-black/80 md:via-black/30 md:to-transparent" />
          </div>
        ) : (
          <div className="h-full w-full" style={{ background: currentSlide.gradient }} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
