/**
 * OpportunityDetailSection Component

 * Open/Closed: Extensible via props for different list styles
 */

import { ReactNode } from 'react';

interface OpportunityDetailSectionProps {
  title: string;
  items: string[];
  icon: ReactNode;
  iconBgColor: string;
  listStyle?: 'numbered' | 'check' | 'gift';
  listItemColor?: string;
}

export function OpportunityDetailSection({
  title,
  items,
  icon,
  iconBgColor,
  listStyle = 'check',
  listItemColor = 'text-amber-500',
}: OpportunityDetailSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-6">
      <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-wiria-blue-dark">
        <span className={`h-8 w-8 rounded-lg ${iconBgColor} flex items-center justify-center`}>
          {icon}
        </span>
        {title}
      </h3>

      {listStyle === 'gift' ? (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center rounded-lg border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-3"
            >
              <span className="mr-3 text-lg">🎁</span>
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start text-gray-700">
              {listStyle === 'numbered' ? (
                <span
                  className={`h-6 w-6 rounded-full ${iconBgColor} ${listItemColor} mr-3 mt-0.5 flex flex-shrink-0 items-center justify-center text-xs font-bold`}
                >
                  {index + 1}
                </span>
              ) : (
                <span className={`${listItemColor} mr-3 flex-shrink-0`}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
