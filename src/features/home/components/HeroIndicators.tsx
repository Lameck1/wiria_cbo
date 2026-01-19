import type { HeroSlide } from '../types';

interface HeroIndicatorsProps {
  slides: HeroSlide[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export function HeroIndicators({ slides, currentIndex, onSelect }: HeroIndicatorsProps) {
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
