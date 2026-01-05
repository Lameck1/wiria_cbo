/**
 * Hero Slider Component - Enhanced UX
 * Auto-rotating slider with manual navigation controls
 * Features: Auto-rotation, pause on hover, arrow buttons, dot indicators
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HeroSlide } from '../constants/homeData';
import { useAuthCTA } from '../hooks/useAuthCTA';

interface HeroSliderProps {
    slides: HeroSlide[];
    autoRotateInterval?: number;
}

export function HeroSlider({ slides, autoRotateInterval = 5000 }: HeroSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const authCTA = useAuthCTA();

    // Navigation handlers
    const goToNext = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const goToPrev = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    // Auto-rotate slides (pauses on hover)
    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, autoRotateInterval);

        return () => clearInterval(timer);
    }, [slides.length, autoRotateInterval, isPaused]);

    const slide = slides[currentSlide];

    if (!slide) {
        return null;
    }

    return (
        <section
            id="hero-slider"
            className="relative h-[75vh] min-h-[500px] overflow-hidden group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="hero-slide absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{ background: slide.gradient }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-wiria-blue-dark bg-opacity-60" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-4xl md:text-6xl font-bold leading-tight mb-4"
                        >
                            {slide.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-2 text-lg md:text-xl max-w-3xl"
                        >
                            {slide.subtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="mt-8 flex justify-center"
                        >
                            <Link
                                to={authCTA.href}
                                id="hero-cta"
                                className={authCTA.className}
                            >
                                <span>{authCTA.text}</span>
                                {authCTA.showArrow && (
                                    <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Left Arrow Button */}
            <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Previous slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Right Arrow Button */}
            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Next slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Slide Indicators with Progress */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`relative h-3 rounded-full transition-all overflow-hidden ${index === currentSlide ? 'w-8 bg-wiria-yellow' : 'w-3 bg-white/50 hover:bg-white/70'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        {/* Progress indicator for active slide */}
                        {index === currentSlide && !isPaused && (
                            <motion.div
                                className="absolute inset-0 bg-white/30"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: autoRotateInterval / 1000, ease: 'linear' }}
                                style={{ transformOrigin: 'left' }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Pause indicator */}
            {isPaused && (
                <div className="absolute top-4 right-4 z-20 bg-black/30 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                    Paused
                </div>
            )}
        </section>
    );
}
