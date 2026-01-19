import { useCallback, useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { TIMING } from '@/shared/constants/config';

import { CarouselControls } from './CarouselControls';

interface CarouselRenderConfig {
  source: string;
  index: number;
  className: string;
  altText: string;
  isMotion?: boolean;
  currentIndex: number;
  failedImages: Record<number, boolean>;
  fallbackTitle: string;
  onImageError: (index: number) => void;
}

function renderCarouselImage({
  source,
  index,
  className,
  altText,
  isMotion = false,
  currentIndex,
  failedImages,
  fallbackTitle,
  onImageError,
}: CarouselRenderConfig) {
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
        <span className="px-2 text-xs font-medium text-gray-400">{fallbackTitle}</span>
      </div>
    );
  }

  if (isMotion) {
    return (
      <motion.img
        key={currentIndex}
        src={source}
        alt={altText}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={className}
        onError={() => onImageError(index)}
      />
    );
  }

  return (
    <img
      src={source}
      alt={altText}
      className={`${className} transition-transform duration-700 hover:scale-110`}
      onError={() => onImageError(index)}
    />
  );
}

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
  autoSlideInterval = TIMING.ANIMATION_DURATION * 25,
  aspectRatio = 'aspect-[16/9]',
  showControls = true,
  title = 'Update image',
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const nextSlide = useCallback(() => {
    setCurrentIndex((previous) => (previous + 1) % images.length);
  }, [images.length]);

  const previousSlide = useCallback(() => {
    setCurrentIndex((previous) => (previous - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      previousSlide();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextSlide();
    }
  };

  useEffect(() => {
    if (!autoSlide || isPaused || images.length <= 1) return;

    const interval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(interval);
  }, [autoSlide, isPaused, autoSlideInterval, nextSlide, images.length]);

  const handleImageError = (index: number) => {
    setFailedImages((previous) => ({ ...previous, [index]: true }));
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

  if (images.length === 1) {
    return (
      <div className={`w-full ${aspectRatio} overflow-hidden bg-gray-50`}>
        {renderCarouselImage({
          source: images[0] ?? '',
          index: 0,
          className: 'w-full h-full object-cover',
          altText: title,
          isMotion: false,
          currentIndex,
          failedImages,
          fallbackTitle: title,
          onImageError: handleImageError,
        })}
      </div>
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className={`relative w-full ${aspectRatio} group overflow-hidden bg-gray-50 outline-none focus:ring-2 focus:ring-wiria-blue-dark focus:ring-offset-2`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={title}
    >
      <AnimatePresence initial={false} mode="wait">
        {renderCarouselImage({
          source: images[currentIndex] ?? '',
          index: currentIndex,
          className: 'absolute inset-0 w-full h-full object-cover',
          altText: `${title} - image ${currentIndex + 1}`,
          isMotion: true,
          currentIndex,
          failedImages,
          fallbackTitle: title,
          onImageError: handleImageError,
        })}
      </AnimatePresence>

      {showControls && (
        <CarouselControls
          onPrevious={(event) => {
            event.stopPropagation();
            previousSlide();
          }}
          onNext={(event) => {
            event.stopPropagation();
            nextSlide();
          }}
          onSelect={(index, event) => {
            event.stopPropagation();
            setCurrentIndex(index);
          }}
          currentIndex={currentIndex}
          totalImages={images.length}
        />
      )}
    </div>
  );
}
