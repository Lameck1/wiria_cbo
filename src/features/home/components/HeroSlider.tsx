/**
 * Hero Slider for WIRIA CBO
 *
 */

import { useState, useEffect, useCallback } from 'react';

import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';
import { HeroImpactStats } from './HeroImpactStats';
import { HeroIndicators } from './HeroIndicators';
import { HeroNavigationArrows } from './HeroNavigationArrows';
import { useAuthCTA } from '../hooks/useAuthCta';

import type { HeroSlide } from '../types';

interface HeroSliderProps {
  slides: HeroSlide[];
  autoRotateInterval?: number;
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
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className="relative h-[75vh] min-h-[500px] overflow-hidden focus:outline-none focus:ring-2 focus:ring-wiria-yellow focus:ring-inset"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
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

      <HeroImpactStats />

      <HeroNavigationArrows onPrevious={previousSlide} onNext={nextSlide} />

      <HeroIndicators slides={slides} currentIndex={currentIndex} onSelect={goToSlide} />
    </div>
  );
}
