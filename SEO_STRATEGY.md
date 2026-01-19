# WIRIA CBO - SEO Strategy Guide

Achieving the #1 rank on search engines requires a combination of **Technical SEO**, **Content Excellence**, and **Authority Building**. This guide outlines the steps implemented in the codebase and the actions required from the content team.

## 1. Technical SEO (Implemented ✅)

We have optimized the codebase to ensure search engines can crawl and understand your site effectively.

- **Dynamic Sitemap**: A `sitemap.xml` is now automatically generated during the build process, ensuring Google always sees your latest pages.
- **Structured Data (Schema.org)**:
  - **Organization Schema**: Tells Google who you are (Logo, Social Profiles, Contact Info).
  - **Breadcrumb Schema**: Helps Google understand site structure.
  - **WebSite Schema**: Enhances search results with a search box (if eligible).
- **Meta Tags**:
  - Unique `Title` and `Description` for every page.
  - Open Graph (Facebook/LinkedIn) and Twitter Cards for rich social sharing.
  - Canonical URLs to prevent duplicate content issues.
- **Performance**:
  - The site uses Vite + React for fast loading.
  - Code splitting ensures only necessary code is loaded.
  - Images should be optimized (WebP format recommended).

## 2. Content Strategy (Action Required 📝)

Search engines rank pages that best answer user queries.

- **Keyword Research**: Identify what people are searching for (e.g., "NGO Homa Bay", "Community Health Kenya", "Youth Empowerment").
- **High-Quality Content**:
  - Ensure every page has substantial, unique text (at least 300 words).
  - Use Headings (`H1`, `H2`, `H3`) to structure content logically.
  - **Blog/News Section**: Regularly update the "News" or "Resources" section with stories, impact reports, and case studies. Fresh content is a huge ranking factor.
- **Keywords in Metadata**: Update the `SEO` component props in your pages with specific keywords relevant to that page.

## 3. Local SEO (Critical for CBOs 📍)

Since WIRIA CBO operates in Homa Bay, Local SEO is your easiest win.

- **Google Business Profile**: Claim and verify your business on Google Maps. Fill out every detail (Address, Hours, Photos).
- **NAP Consistency**: Ensure Name, Address, and Phone Number are identical across the website, Facebook, LinkedIn, and Google.
- **Reviews**: Encourage partners and beneficiaries to leave 5-star reviews on your Google Business Profile.

## 4. Off-Page SEO (Authority Building 🔗)

Google views links from other reputable sites as "votes" for your site.

- **Backlinks**:
  - Partner with other NGOs, Government bodies, or News outlets and ask them to link to `wiriacbo.org`.
  - Use the "Partners" section to link to them and ask for a reciprocal link.
- **Social Signals**: Share every new update on Facebook, Twitter, and LinkedIn to drive traffic.

## 5. Maintenance 🛠️

- **Run Sitemap Generation**: The sitemap is automatically regenerated when you run `npm run build`.
- **Monitor Performance**: Use Google Search Console to track clicks, impressions, and indexing issues.
- **Audit**: Periodically run `npm run audit:full` to check for broken links or code issues.

---

### How to Add SEO to New Pages

When creating a new page, always use the `SEO` component:

```tsx
import { SEO } from '@/shared/components/Seo';

function NewPage() {
  return (
    <>
      <SEO
        title="Page Title"
        description="A compelling description (150-160 chars) that includes keywords."
        keywords="keyword1, keyword2"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'New Page', item: '/new-page' }
        ]}
      />
      {/* Page Content */}
    </>
  );
}
```
