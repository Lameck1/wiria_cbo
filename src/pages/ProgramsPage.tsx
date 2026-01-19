/**
 * Programs Page - React patterns + Animations
 * Uses component composition, data separation, and Framer Motion animations
 */

import { CrossCuttingThemesSection } from '@/features/programs/components/CrossCuttingThemesSection';
import { ProgramsCallToActionSection } from '@/features/programs/components/ProgramsCallToActionSection';
import { ProgramsHeroSection } from '@/features/programs/components/ProgramsHeroSection';
import { ProgramsPillarsSection } from '@/features/programs/components/ProgramsPillarsSection';

function ProgramsPage() {
  return (
    <main>
      <ProgramsHeroSection />
      <ProgramsPillarsSection />
      <CrossCuttingThemesSection />
      <ProgramsCallToActionSection />
    </main>
  );
}

export default ProgramsPage;
