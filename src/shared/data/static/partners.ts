/**
 * Static Partners Data
 * Fallback data when backend is unavailable
 */

import type { Partner } from '@/features/home/hooks/usePartners';

export const staticPartners: Partner[] = [
    {
        id: 'static-partner-1',
        name: 'Amref Health Africa Kenya',
        logoUrl: '/images/amref_health_africa_kenya.webp',
        websiteUrl: 'https://amref.org',
        type: 'IMPLEMENTING',
        description: 'Africa-led health organization working to achieve lasting health change.',
    },
    {
        id: 'static-partner-2',
        name: 'Kenya Red Cross',
        logoUrl: '/images/redcross_kenya.png',
        websiteUrl: 'https://www.redcross.or.ke',
        type: 'IMPLEMENTING',
        description: 'Partner in emergency response and community resilience.',
    },
    {
        id: 'static-partner-3',
        name: 'Homa Bay County Government',
        logoUrl: '/images/homabay_county_government.png',
        websiteUrl: 'https://www.homabay.go.ke',
        type: 'GOVERNMENT',
        description: 'Our primary government partner for community development initiatives.',
    },
    {
        id: 'static-partner-4',
        name: 'Ministry of Health Kenya',
        logoUrl: '/images/ministry_of_health_kenya_i.png',
        websiteUrl: 'https://www.health.go.ke',
        type: 'GOVERNMENT',
        description: 'Collaboration on community health programs and policy implementation.',
    },
];
