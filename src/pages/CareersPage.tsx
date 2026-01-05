/**
 * Careers Page
 * Composes feature components following SOLID principles
 * Enhanced with hero stats and scroll-to functionality
 */

import { Layout } from '@/shared/components/layout/Layout';
import { PageHero } from '@/shared/components/sections/PageHero';
import {
    WhyJoinSection,
    CurrentJobsSection,
    ApplicationProcessSection,
    EqualOpportunitySection,
} from '@/features/careers';
import { CareerHeroStats } from '@/features/careers/components/CareerHeroStats';

function CareersPage() {
    return (
        <Layout>
            <main>
                {/* Hero Section - Enhanced with stats */}
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
        </Layout>
    );
}

export default CareersPage;
