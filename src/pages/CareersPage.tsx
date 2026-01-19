/**
 * Careers Page


 */

import {
  WhyJoinSection,
  CurrentJobsSection,
  ApplicationProcessSection,
  EqualOpportunitySection,
} from '@/features/careers';
import { CareerHeroStats } from '@/features/careers/components/CareerHeroStats';
import { PageHero } from '@/shared/components/sections/PageHero';
import { SEO } from '@/shared/components/Seo';

function CareersPage() {
  return (
    <main>
      <SEO
        title="Careers & Jobs"
        description="Join the WIRIA CBO team. View current job openings and career opportunities."
        keywords="Careers, Jobs, Employment, Hiring, Work with Us"
      />
      {/* Hero Section - with stats */}
      <PageHero
        badge="Join Our Team"
        title="Build Your Career With Purpose"
        subtitle="Join our team of dedicated professionals making a difference in Homa Bay County"
        backgroundImage="/images/careers-hero.png"
      >
        <CareerHeroStats />
      </PageHero>

      {/* Why Work With Us */}
      <WhyJoinSection />

      {/* Current Job Openings */}
      <CurrentJobsSection />

      {/* Application Process */}
      <ApplicationProcessSection />

      {/* Equal Opportunity Statement */}
      <EqualOpportunitySection />
    </main>
  );
}

export default CareersPage;
