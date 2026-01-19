import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  schema?: Record<string, unknown>;
  breadcrumbs?: { name: string; item: string }[];
}

const DOMAIN = 'https://wiriacbo.org';

export function SEO({
  title = 'WIRIA CBO - Wellness, Inclusion, Rights, and Impact Advocacy',
  description = 'WIRIA CBO (Wellness, Inclusion, Rights, and Impact Advocacy) promotes health, upholds human rights, and strengthens community resilience in Homa Bay County, Kenya.',
  keywords = 'WIRIA CBO, Homa Bay CBO, Community Based Organization Kenya, Public Health NGO Kenya, Human Rights Advocacy Kenya, HIV Prevention Homa Bay, GBV Support Kenya, Youth Empowerment Kenya, Wellness Inclusion Rights Impact Advocacy',
  image = '/images/Wiria_CBO_Logo_NEW_IV.png',
  url = typeof window === 'undefined' ? '' : window.location.href,
  type = 'website',
  schema,
  breadcrumbs,
}: SEOProps) {
  const siteTitle = title === 'WIRIA CBO - Wellness, Inclusion, Rights, and Impact Advocacy' 
    ? title 
    : `${title} | WIRIA CBO`;

  const fullImageUrl = image.startsWith('http') ? image : `${DOMAIN}${image}`;
  const canonicalUrl = url.startsWith('http') ? url : `${DOMAIN}${url}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}

      {/* Breadcrumb Schema */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((crumb, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: crumb.name,
              item: crumb.item.startsWith('http') ? crumb.item : `${DOMAIN}${crumb.item}`,
            })),
          })}
        </script>
      )}
    </Helmet>
  );
}
