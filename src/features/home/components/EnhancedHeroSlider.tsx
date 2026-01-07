/**
 * Enhanced Hero Slider for WIRIA CBO
 * Features: Contextual gradients, impact badges, dual CTAs, smooth animations
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthCTA } from '../hooks/useAuthCTA';

interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    badge: string;
    gradient: string; // CSS gradient background
    theme: 'health' | 'rights' | 'livelihoods' | 'impact';
    backgroundImage?: string;
}

interface EnhancedHeroSliderProps {
    slides: HeroSlide[];
    autoRotateInterval?: number;
}

const IMPACT_STATS = [
    { label: 'Members', value: '1,250+', icon: '👥' },
    { label: 'Beneficiaries', value: '15K+', icon: '🤝' },
    { label: 'Years Active', value: '6+', icon: '📅' },
];

export function EnhancedHeroSlider({
    slides,
    autoRotateInterval = 6000
}: EnhancedHeroSliderProps) {
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
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, autoRotateInterval);

        return () => clearInterval(interval);
    }, [hasSlides, isPaused, autoRotateInterval, slides.length]);

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    const nextSlide = useCallback(() => {
        if (!hasSlides) return;
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, [hasSlides, slides.length]);

    const prevSlide = useCallback(() => {
        if (!hasSlides) return;
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }, [hasSlides, slides.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [prevSlide, nextSlide]);

    if (!currentSlide) return null;

    return (
        <section
            className="relative h-[75vh] min-h-[500px] overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-label="Hero slider"
        >
            {/* Background Layer - Crossfade transition */}
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
                        <div className="relative w-full h-full">
                            <motion.div
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 6, ease: "linear" }}
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${currentSlide.backgroundImage})` }}
                            />
                            {/* Professional overlay - Gradient from dark to transparent */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 md:bg-gradient-to-r md:from-black/80 md:via-black/30 md:to-transparent" />
                        </div>
                    ) : (
                        <div
                            className="w-full h-full"
                            style={{ background: currentSlide.gradient }}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Content Container - Centered */}
            <div className="relative z-10 h-full flex items-center justify-center">
                <div className="container mx-auto px-6 lg:px-8 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                {/* Badge - Positioned Higher */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex justify-center mb-3"
                                >
                                    <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/30 shadow-lg">
                                        {currentSlide.badge}
                                    </span>
                                </motion.div>

                                {/* Title */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight px-4"
                                    style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
                                >
                                    {currentSlide.title}
                                </motion.h1>

                                {/* Subtitle */}
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-base md:text-lg text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed px-4"
                                    style={{ textShadow: '0 1px 10px rgba(0,0,0,0.2)' }}
                                >
                                    {currentSlide.subtitle}
                                </motion.p>

                                {/* CTA Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex flex-wrap gap-3 justify-center"
                                >
                                    {/* Primary CTA - Auth-aware */}
                                    <Link
                                        to={href}
                                        className={`${className} group px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2`}
                                    >
                                        {text}
                                        {showArrow && (
                                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        )}
                                    </Link>

                                    {/* Secondary CTA */}
                                    <Link
                                        to="/about"
                                        className="px-6 py-3 bg-white/10 backdrop-blur-md text-white border-2 border-white/50 rounded-full font-semibold text-base hover:bg-white/20 hover:border-white transition-all duration-300 inline-flex items-center gap-2 group"
                                    >
                                        Learn Our Story
                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Impact Stats Badges - Floating */}
            <div className="absolute bottom-20 right-8 hidden xl:flex flex-col gap-3 z-20">
                {IMPACT_STATS.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-xl hover:scale-105 transition-transform duration-300 min-w-[140px]"
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

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-all duration-300 hidden md:block"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-all duration-300 hidden md:block"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                            ? 'w-8 bg-white'
                            : 'w-1.5 bg-white/50 hover:bg-white/75'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
