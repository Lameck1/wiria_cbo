/**
 * Hero Slider for WIRIA CBO

 */

import { useState, useEffect, useCallback } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import { useAuthCTA } from '../hooks/useAuthCta';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  gradient: string; // CSS gradient background
  theme: 'health' | 'rights' | 'livelihoods' | 'impact';
  backgroundImage?: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  autoRotateInterval?: number;
}

const IMPACT_STATS = [
  { label: 'Members', value: '1,250+', icon: '👥' },
  { label: 'Beneficiaries', value: '15K+', icon: '🤝' },
  { label: 'Years Active', value: '6+', icon: '📅' },
];

interface HeroBackgroundProps {
  currentIndex: number;
  currentSlide: HeroSlide;
}

function HeroBackground({ currentIndex, currentSlide }: HeroBackgroundProps) {
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

function HeroContent({ currentIndex, currentSlide, cta }: HeroContentProps) {
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

interface HeroImpactStatsProps {
  stats: typeof IMPACT_STATS;
}

function HeroImpactStats({ stats }: HeroImpactStatsProps) {
  return (
    <div className="absolute bottom-20 right-8 z-20 hidden flex-col gap-3 xl:flex">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + index * 0.1 }}
          className="min-w-[140px] rounded-xl bg-white/95 p-3 shadow-xl backdrop-blur-md transition-transform duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <div className="text-xl font-bold text-wiria-blue-dark">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

interface HeroNavigationArrowsProps {
  onPrevious: () => void;
  onNext: () => void;
}

function HeroNavigationArrows({ onPrevious, onNext }: HeroNavigationArrowsProps) {
  return (
    <>
      <button
        onClick={onPrevious}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/30 md:block"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={onNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/30 md:block"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  );
}

interface HeroIndicatorsProps {
  slides: HeroSlide[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

function HeroIndicators({ slides, currentIndex, onSelect }: HeroIndicatorsProps) {
  return (
    <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
      {slides.map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          aria-label={`Go to slide ${index + 1}`}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            index === currentIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'
          }`}
        />
      ))}
    </div>
  );
}

export function HeroSlider({ slides, autoRotateInterval = 6000 }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { text, href, className, showArrow } = useAuthCTA();

  const hasSlides = slides.length > 0;
  const safeIndex = hasSlides ? Math.min(currentIndex, slides.length - 1) : 0;
  const currentSlide = hasSlides ? slides[safeIndex] : null;

  // Auto-rotation
  useEffect(() => {
    if (!hasSlides) return;
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % slides.length);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [hasSlides, isPaused, autoRotateInterval, slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const nextSlide = useCallback(() => {
    if (!hasSlides) return;
    setCurrentIndex((previous) => (previous + 1) % slides.length);
  }, [hasSlides, slides.length]);

  const previousSlide = useCallback(() => {
    if (!hasSlides) return;
    setCurrentIndex((previous) => (previous - 1 + slides.length) % slides.length);
  }, [hasSlides, slides.length]);

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') previousSlide();
    if (event.key === 'ArrowRight') nextSlide();
  };

  if (!currentSlide) return null;

  return (
    <section
      className="relative h-[75vh] min-h-[500px] overflow-hidden focus:outline-none focus:ring-2 focus:ring-wiria-yellow focus:ring-inset"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Hero slider"
      role="region"
      aria-roledescription="carousel"
    >
      <HeroBackground currentIndex={currentIndex} currentSlide={currentSlide} />

      <HeroContent
        currentIndex={currentIndex}
        currentSlide={currentSlide}
        cta={{ text, href, className, showArrow }}
      />

      <HeroImpactStats stats={IMPACT_STATS} />

      <HeroNavigationArrows onPrevious={previousSlide} onNext={nextSlide} />

      <HeroIndicators slides={slides} currentIndex={currentIndex} onSelect={goToSlide} />
    </section>
  );
}
