/**
 * HomePage - Enhanced Hero Section
 * All sections with contextual gradients representing WIRIA's mission
 */

import { Layout } from '@/shared/components/layout/Layout';
import {
    ImpactStatsSection,
    RecentUpdatesSection,
    PartnersSection,
    IMPACT_STATS,
} from '@/features/home';
import { EnhancedHeroSlider } from '@/features/home/components/EnhancedHeroSlider';
import { ENHANCED_HERO_SLIDES } from '@/features/home/constants/homeData';
import { FocusAreasSection } from '@/shared/components/sections/FocusAreasSection';

/**
 * HomePage Component - Enhanced with contextual hero
 * Sections in order:
 * 1. Enhanced Hero Slider (Gradient backgrounds)
 * 2. Focus Areas (Mission Impact)
 * 3. Impact Stats Counter
 * 4. Recent Updates (database-driven, conditionally displayed)
 * 5. Partners Logo Strip (database-driven)
 */
export function HomePage() {
    return (
        <Layout>
            {/* Enhanced Hero Slider - Contextual gradients */}
            <EnhancedHeroSlider slides={ENHANCED_HERO_SLIDES} />

            {/* Mission Impact Section - Focus Areas */}
            <FocusAreasSection />

            {/* Impact Counter Section */}
            <ImpactStatsSection stats={IMPACT_STATS} />

            {/* Recent Updates Section - Database-driven, conditionally displayed */}
            <RecentUpdatesSection />

            {/* Partners Logo Strip - Database-driven */}
            <PartnersSection />

            {/* Footer is in Layout component */}
        </Layout>
    );
}

export default HomePage;
