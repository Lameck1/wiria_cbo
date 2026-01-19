/**
 * Home Page
 */

import {
  ImpactStatsSection,
  RecentUpdatesSection,
  PartnersSection,
  IMPACT_STATS,
  HeroSlider,
  HERO_SLIDES,
} from '@/features/home';
import { FocusAreasSection } from '@/shared/components/sections/FocusAreasSection';
import { SEO } from '@/shared/components/Seo';

function HomePage() {

  return (
    <>
      <SEO />
      {/* Hero Slider */}
      <HeroSlider slides={HERO_SLIDES} />

      {/* Focus Areas */}
      <FocusAreasSection />

      {/* Impact Counter Section */}
      <ImpactStatsSection stats={IMPACT_STATS} />

      {/* Recent Updates */}
      <RecentUpdatesSection />

      {/* Partners Logo Strip */}
      <PartnersSection />
    </>
  );
}

export default HomePage;
