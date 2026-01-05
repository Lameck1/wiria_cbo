/**
 * Static Updates Data
 * Fallback data when backend is unavailable
 */

import type { Update } from '@/features/home/hooks/useUpdates';

export const staticUpdates: Update[] = [
    {
        id: 'static-update-1',
        title: 'Youth Empowerment Workshop Engages 120 Participants',
        excerpt: 'Our latest youth empowerment initiative brought together young people from across Homa Bay County.',
        fullContent: 'WIRIA CBO successfully concluded a three-day Youth Empowerment Workshop that attracted 120 enthusiastic young participants aged 18-35 from various sub-counties in Homa Bay. The workshop focused on entrepreneurship skills, digital literacy, leadership development, and reproductive health education. As a result, 15 youth-led business groups have been formed.',
        category: 'COMMUNITY',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop',
        publishedAt: '2024-12-10',
        date: '2024-12-10',
    },
    {
        id: 'static-update-2',
        title: 'New CHW Training Launched in Ndhiwa',
        excerpt: "We've kicked off a new training cohort for 50 Community Health Workers.",
        fullContent: 'WIRIA CBO is proud to announce the launch of a comprehensive Community Health Worker (CHW) training program in Ndhiwa Sub-County. This initiative brings together 50 dedicated community members who will undergo intensive training in HIV/TB/Malaria prevention, sexual and reproductive health education, and community outreach methodologies. The 6-week training program will equip these CHWs with the skills and knowledge needed to serve as vital health ambassadors in their communities.',
        category: 'HEALTH',
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop',
        publishedAt: '2024-11-28',
        date: '2024-11-28',
    },
    {
        id: 'static-update-3',
        title: 'First Harvest from Demo Farm a Success',
        excerpt: 'Our agribusiness training program yields its first successful harvest.',
        fullContent: 'The WIRIA CBO demonstration farm has achieved a remarkable milestone with its first successful harvest season. Participating farmers have cultivated high-value crops including tomatoes, kale, and indigenous vegetables using climate-smart agricultural techniques. The harvest yielded over 2 tons of produce, which was sold through local markets. Participants have reported income increases of up to 60% compared to traditional farming methods.',
        category: 'LIVELIHOODS',
        imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=500&fit=crop',
        publishedAt: '2024-11-15',
        date: '2024-11-15',
    },
    {
        id: 'static-update-4',
        title: 'SGBV Survivors Legal Aid Clinic Held',
        excerpt: 'In partnership with local lawyers, we provided free legal counsel to over 30 individuals.',
        fullContent: 'WIRIA CBO, in collaboration with the Homa Bay County Bar Association, successfully organized a free legal aid clinic focused on supporting survivors of Sexual and Gender-Based Violence. The clinic provided confidential legal consultations to 32 survivors. Four pro-bono lawyers volunteered their time, and we successfully referred 15 cases for continued legal representation.',
        category: 'RIGHTS',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=500&fit=crop',
        publishedAt: '2024-11-05',
        date: '2024-11-05',
    },
];
