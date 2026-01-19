export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  gradient: string; // CSS gradient background
  theme: 'health' | 'rights' | 'livelihoods' | 'impact';
  backgroundImage?: string;
}
