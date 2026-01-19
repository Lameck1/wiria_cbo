/**
 * Programs Page - React patterns + Animations
 * Uses component composition, data separation, and Framer Motion animations
 */

import { CrossCuttingThemesSection } from '@/features/programs/components/CrossCuttingThemesSection';
import { ProgramsCallToActionSection } from '@/features/programs/components/ProgramsCallToActionSection';
import { ProgramsHeroSection } from '@/features/programs/components/ProgramsHeroSection';
import { ProgramsPillarsSection } from '@/features/programs/components/ProgramsPillarsSection';
import { SEO } from '@/shared/components/Seo';

function ProgramsPage() {
  return (
    <main>
      <SEO
        title="Our Programs"
        description="Explore our key program pillars: Health, Education, Economic Empowerment, and more."
        keywords="Programs, Health, Education, Economic Empowerment, WIRIA Projects"
      />
      <ProgramsHeroSection />
      <ProgramsPillarsSection />
      <CrossCuttingThemesSection />
      <ProgramsCallToActionSection />
    </main>
  );
}

export default ProgramsPage;
