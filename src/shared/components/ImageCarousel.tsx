import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageCarouselProps {
  images: string[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
  aspectRatio?: string;
  showControls?: boolean;
  title?: string;
}

export function ImageCarousel({
  images,
  autoSlide = true,
  autoSlideInterval = 5000,
  aspectRatio = 'aspect-[16/9]',
  showControls = true,
  title = 'Update image',
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!autoSlide || isPaused || images.length <= 1) return;

    const interval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(interval);
  }, [autoSlide, isPaused, autoSlideInterval, nextSlide, images.length]);

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  if (!images || images.length === 0) {
    return (
      <div
        className={`w-full ${aspectRatio} flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-100`}
      >
        <svg
          className="mb-2 h-12 w-12 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-sm text-gray-400">Image unavailable</span>
      </div>
    );
  }

  const renderImage = (
    src: string,
    index: number,
    className: string,
    isMotion: boolean = false
  ) => {
    if (failedImages[index]) {
      return (
        <div
          className={`${className} flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4 text-center`}
        >
          <svg
            className="mb-2 h-10 w-10 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="px-2 text-xs font-medium text-gray-400">{title}</span>
        </div>
      );
    }

    if (isMotion) {
      return (
        <motion.img
          key={currentIndex}
          src={src}
          alt={`${title} - image ${index + 1}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={className}
          onError={() => handleImageError(index)}
        />
      );
    }

    return (
      <img
        src={src}
        alt={title}
        className={`${className} transition-transform duration-700 hover:scale-110`}
        onError={() => handleImageError(index)}
      />
    );
  };

  if (images.length === 1) {
    return (
      <div className={`w-full ${aspectRatio} overflow-hidden bg-gray-50`}>
        {renderImage(images[0]!, 0, 'w-full h-full object-cover')}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspectRatio} group overflow-hidden bg-gray-50`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} mode="wait">
        {renderImage(
          images[currentIndex]!,
          currentIndex,
          'absolute inset-0 w-full h-full object-cover',
          true
        )}
      </AnimatePresence>

      {showControls && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-black/50 group-hover:opacity-100"
            aria-label="Previous image"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-black/50 group-hover:opacity-100"
            aria-label="Next image"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-5 bg-white' : 'bg-white/40'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
