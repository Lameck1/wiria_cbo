/**
 * Home Page
 */

import { Layout } from '@/shared/components/layout/Layout';
import {
  ImpactStatsSection,
  RecentUpdatesSection,
  PartnersSection,
  IMPACT_STATS,
  HeroSlider,
  HERO_SLIDES,
} from '@/features/home';
import { FocusAreasSection } from '@/shared/components/sections/FocusAreasSection';

export function HomePage() {
  return (
    <Layout>
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
    </Layout>
  );
}

export default HomePage;
