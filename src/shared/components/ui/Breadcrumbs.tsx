import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

/**
 * Item definition for the Breadcrumbs component.
 */
export interface BreadcrumbItem {
  /** The label to display for the breadcrumb. */
  label: string;
  /** The path to navigate to when clicked. */
  path: string;
}

/**
 * Props for the Breadcrumbs component.
 */
interface BreadcrumbsProps {
  /** Array of breadcrumb items to display. */
  items: BreadcrumbItem[];
  /** Optional class name for the navigation container. */
  className?: string;
}

/**
 * Navigation component displaying the path to the current page.
 * Includes Schema.org JSON-LD for SEO.
 */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const baseUrl = window.location.origin;

  // Generate Schema.org JSON-LD
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${baseUrl}${item.path}`,
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <nav aria-label="Breadcrumb">
        <ol className={`flex flex-wrap items-center gap-2 text-sm ${className}`}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.path} className="flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-gray-400" aria-hidden="true">
                    /
                  </span>
                )}
                {isLast ? (
                  <span className="font-semibold text-wiria-blue-dark" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="text-gray-600 transition-colors hover:text-wiria-blue-dark hover:underline"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
