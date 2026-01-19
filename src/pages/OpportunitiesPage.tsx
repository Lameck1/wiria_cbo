/**
 * Opportunities Page

 * Uses shared PageHero component for consistency
 */

import {
  OpportunityHeroStats,
  VolunteerInternshipSection,
  CurrentOpeningsSection,
  BenefitsSection,
  ApplicationTipsSection,
} from '@/features/opportunities';
import { PageHero } from '@/shared/components/sections/PageHero';
import { SectionHeader } from '@/shared/components/sections/SectionHeader';
import { SEO } from '@/shared/components/Seo';

function OpportunitiesPage() {
  return (
    <main>
      <SEO
        title="Opportunities"
        description="Volunteer and internship opportunities at WIRIA CBO. Make a difference in Homa Bay County."
        keywords="Opportunities, Volunteer, Internship, Community Service, Homa Bay"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Opportunities', item: '/opportunities' },
        ]}
      />
      {/* Hero Section - Using shared PageHero */}
      <PageHero
        badge="Volunteer & Intern"
        title="Make a Difference"
        subtitle="Join our team and contribute your skills to transform lives in Homa Bay County"
        backgroundImage="/images/opportunities-hero.png"
      >
        {/* Dynamic Stats */}
        <OpportunityHeroStats />
      </PageHero>

      {/* Main Content Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <SectionHeader
            title="Volunteer & Internship Programs"
            subtitle="We welcome passionate individuals to support our mission in Homa Bay County."
          />

          {/* Volunteer & Internship Info Cards */}
          <VolunteerInternshipSection />

          {/* Current Openings - Dynamic from API with Filters */}
          <CurrentOpeningsSection />

          {/* What You'll Gain - Benefits */}
          <BenefitsSection />
        </div>
      </section>

      {/* Application Tips Section */}
      <ApplicationTipsSection />
    </main>
  );
}

export default OpportunitiesPage;
