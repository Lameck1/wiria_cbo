import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function SEO({
  title = 'WIRIA CBO - Wellness, Inclusion, Rights, and Impact Advocacy',
  description = 'WIRIA CBO (Wellness, Inclusion, Rights, and Impact Advocacy) promotes health, upholds human rights, and strengthens community resilience in Homa Bay County, Kenya.',
  keywords = 'WIRIA CBO, Homa Bay CBO, Community Based Organization Kenya, Public Health NGO Kenya, Human Rights Advocacy Kenya, HIV Prevention Homa Bay, GBV Support Kenya, Youth Empowerment Kenya, Wellness Inclusion Rights Impact Advocacy',
  image = '/images/Wiria_CBO_Logo_NEW_IV.png',
  url = typeof window === 'undefined' ? '' : window.location.href,
}: SEOProps) {
  const siteTitle = title === 'WIRIA CBO - Wellness, Inclusion, Rights, and Impact Advocacy' 
    ? title 
    : `${title} | WIRIA CBO`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
