interface CarouselControlsProps {
  onPrevious: (event: React.MouseEvent) => void;
  onNext: (event: React.MouseEvent) => void;
  onSelect: (index: number, event: React.MouseEvent) => void;
  currentIndex: number;
  totalImages: number;
}

export function CarouselControls({
  onPrevious,
  onNext,
  onSelect,
  currentIndex,
  totalImages,
}: CarouselControlsProps) {
  return (
    <>
      {/* Navigation Arrows */}
      <button
        onClick={onPrevious}
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-black/50 focus:opacity-100 group-hover:opacity-100"
        aria-label="Previous image"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={onNext}
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-black/50 focus:opacity-100 group-hover:opacity-100"
        aria-label="Next image"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {Array.from({ length: totalImages }).map((_, index) => (
          <button
            key={index}
            onClick={(event) => onSelect(index, event)}
            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-5 bg-white' : 'bg-white/40'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
}
