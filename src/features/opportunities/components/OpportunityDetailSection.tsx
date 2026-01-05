/**
 * OpportunityDetailSection Component
 * Single responsibility: Render a section of opportunity details (responsibilities, requirements, benefits)
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
            <h3 className="flex items-center gap-2 text-lg font-bold text-wiria-blue-dark mb-3">
                <span className={`w-8 h-8 rounded-lg ${iconBgColor} flex items-center justify-center`}>
                    {icon}
                </span>
                {title}
            </h3>

            {listStyle === 'gift' ? (
                <div className="grid md:grid-cols-2 gap-3">
                    {items.map((item, i) => (
                        <div key={i} className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-3">
                            <span className="text-lg mr-3">🎁</span>
                            <span className="text-gray-700 text-sm">{item}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <ul className="space-y-2">
                    {items.map((item, i) => (
                        <li key={i} className="flex items-start text-gray-700">
                            {listStyle === 'numbered' ? (
                                <span className={`w-6 h-6 rounded-full ${iconBgColor} ${listItemColor} flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5`}>
                                    {i + 1}
                                </span>
                            ) : (
                                <span className={`${listItemColor} mr-3 flex-shrink-0`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
