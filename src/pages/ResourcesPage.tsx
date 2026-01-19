/**
 * Resources Page
 * Resources & Transparency - Documents and Tenders
 */

import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import {
  DocumentRepositorySection,
  ActiveTendersSection,
  ResourcesHeroStats,
} from '@/features/resources';
import { PageHero } from '@/shared/components/sections/PageHero';
import { SEO } from '@/shared/components/Seo';

function ResourcesPage() {
  const location = useLocation();

  // Handle hash-based scrolling (e.g., /resources#tenders)
  useEffect(() => {
    if (!location.hash) return;

    // Small delay to ensure the page has rendered
    const timeoutId = setTimeout(() => {
      const elementId = location.hash.slice(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [location.hash]);
  return (
    <main>
      <SEO
        title="Resources & Transparency"
        description="Access WIRIA CBO's key documents, reports, and procurement notices."
        keywords="Resources, Documents, Reports, Tenders, Transparency"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Resources', item: '/resources' },
        ]}
      />
      {/* Hero Section */}
      <PageHero
        badge="Documents & Reports"
        title="Resources & Transparency"
        subtitle="Access our key documents and procurement notices"
        backgroundImage="/images/resources-hero.png"
      >
        <ResourcesHeroStats />
      </PageHero>

      {/* Document Repository */}
      <DocumentRepositorySection />

      {/* Active Tenders */}
      <ActiveTendersSection />
    </main>
  );
}

export default ResourcesPage;
