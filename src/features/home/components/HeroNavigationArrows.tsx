interface HeroNavigationArrowsProps {
  onPrevious: () => void;
  onNext: () => void;
}

export function HeroNavigationArrows({ onPrevious, onNext }: HeroNavigationArrowsProps) {
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
