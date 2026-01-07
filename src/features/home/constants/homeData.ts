/**
 * HomePage Data - Enhanced for WIRIA CBO
 */

export interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    badge: string;
    gradient: string;
    theme: 'health' | 'rights' | 'livelihoods';
}

export interface FocusArea {
    title: string;
    icon: string;
    description: string;
    color: string;
    link: string;
}

export interface ImpactStat {
    label: string;
    value: string;
    target: number;
    description: string;
}

export interface Update {
    id: string;
    title: string;
    date: string;
    category: string;
    excerpt: string;
    content: string;
    image: string;
}

// Enhanced Hero Slides with Contextual Gradients
export const ENHANCED_HERO_SLIDES: HeroSlide[] = [
    {
        id: 1,
        title: 'Born from Pain. Built for Change.',
        subtitle: 'In the heart of Western Kenya, communities face intersecting health and human rights challenges that demand urgent action—particularly for girls and young women. WIRIA emerged as a community-driven response to these overlapping vulnerabilities.',
        badge: '🌟 Our Story',
        gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #f59e0b 100%)', // Blue to Yellow (WIRIA colors)
        theme: 'health',
    },
    {
        id: 2,
        title: 'Championing Rights for All',
        subtitle: 'Advocating for the rights of women, girls, and vulnerable populations through education, empowerment, and community action.',
        badge: '✊ Rights & Advocacy',
        gradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #3b82f6 100%)', // Green to Blue
        theme: 'rights',
    },
    {
        id: 3,
        title: 'Enhancing Livelihoods & Prosperity',
        subtitle: 'Building sustainable futures through agribusiness, table banking, skills training, and economic empowerment programs.',
        badge: '🌾 Economic Empowerment',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #10b981 100%)', // Yellow to Green
        theme: 'livelihoods',
    },
];


export interface Partner {
    name: string;
    logo: string;
    link?: string;
}


// Focus Areas - Updated to match 4 Strategic Pillars
export const FOCUS_AREAS: FocusArea[] = [
    {
        title: 'Wellness',
        icon: '❤️',
        description: 'Combating HIV/TB/Malaria, promoting Sexual and Reproductive Health, and providing mental health support for healthier communities.',
        color: 'bg-green-50 border-green-200 hover:border-green-400',
        link: '/programs#wellness-detail',
    },
    {
        title: 'Inclusion',
        icon: '👥',
        description: 'Ensuring no one is left behind through youth-responsive services, disability inclusion, and safe spaces for all.',
        color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
        link: '/programs#inclusion-detail',
    },
    {
        title: 'Rights',
        icon: '🛡️',
        description: 'Defending dignity through legal aid for GBV survivors, human rights education, and policy engagement.',
        color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
        link: '/programs#rights-detail',
    },
    {
        title: 'Impact Advocacy',
        icon: '💰',
        description: 'Building sustainable livelihoods through agribusiness, financial literacy, school bursaries, and community-led advocacy.',
        color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
        link: '/programs#impact-advocacy-detail',
    },
];

// Impact Stats - Exact from Original
export const IMPACT_STATS: ImpactStat[] = [
    {
        label: 'Registered Members',
        value: '1250',
        target: 1250,
        description: 'Active community members',
    },
    {
        label: 'Community Beneficiaries',
        value: '15000',
        target: 15000,
        description: 'Lives touched since 2019',
    },
    {
        label: 'Years Active (Since 2019)',
        value: '6',
        target: 6,
        description: 'Building healthier communities',
    },
];

// Partners
export const PARTNERS: Partner[] = [
    {
        name: 'Ministry of Health Kenya',
        logo: 'https://via.placeholder.com/150x80?text=MOH+Kenya',
    },
    {
        name: 'County Government Homa Bay',
        logo: 'https://via.placeholder.com/150x80?text=Homa+Bay+County',
    },
    {
        name: 'USAID',
        logo: 'https://via.placeholder.com/150x80?text=USAID',
    },
    {
        name: 'WHO',
        logo: 'https://via.placeholder.com/150x80?text=WHO',
    },
];

export const CTA_CONFIG = {
    title: 'Join Us in Making a Difference',
    subtitle: 'Whether through membership, donations, or volunteering, your support helps us continue our vital work in the community.',
    buttons: [
        {
            label: 'Become a Member',
            link: '/membership',
            variant: 'primary' as const,
        },
        {
            label: 'Donate Now',
            link: '/donations',
            variant: 'outline' as const,
        },
        {
            label: 'Volunteer',
            link: '/opportunities',
            variant: 'ghost' as const,
        },
    ],
};
