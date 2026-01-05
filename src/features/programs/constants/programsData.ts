/**
 * Programs Page Data
 * Centralized data for all strategic pillars - Updated to 4 pillars per director's guidelines
 */

export interface ProgramData {
    id: string;
    title: string;
    subtitle: string;
    color: {
        from: string;
        to: string;
        border: string;
        bg: string;
        text: string;
    };
    icon: 'health' | 'rights' | 'economy' | 'climate' | 'youth';
    highlights: string[];
    approach: {

        title: string;
        description: string;
    };
    impact: string;
    metrics: {
        label: string;
        value: string;
    }[];
    initiatives: {
        title: string;
        description: string;
    }[];
    imageId: string;
}

export const PROGRAMS_DATA: ProgramData[] = [
    {
        id: 'wellness-detail',
        title: 'Wellness',
        subtitle: 'Health Is a Human Right',
        color: {
            from: 'green-500',
            to: 'green-600',
            border: 'green-500',
            bg: 'green-100',
            text: 'green-600',
        },
        icon: 'health',
        highlights: ['HIV, TB, Malaria Prevention', 'Mental Health Support', 'Psychosocial Care for GBV Survivors'],
        approach: {
            title: 'Our Approach',
            description:
                'We equip communities with lifesaving knowledge and care through health literacy, prevention programs, and trauma-informed support services.',
        },
        impact: 'Fewer preventable deaths. Healthier families. Informed choices.',
        metrics: [
            { label: 'Community Members Reached', value: '5,000+' },
            { label: 'Health Awareness Sessions', value: '120+' },
            { label: 'GBV Survivors Supported', value: '300+' },
        ],
        initiatives: [
            {
                title: 'HIV, TB, and Malaria Prevention',
                description:
                    'We conduct community awareness campaigns, distribute preventative materials, and connect individuals with testing and treatment facilities. Our approach is community-led, ensuring cultural sensitivity and effectiveness in reaching vulnerable populations.',
            },
            {
                title: 'Sexual & Reproductive Health (SRH)',
                description:
                    'We provide comprehensive SRH education for adolescents and adults, covering topics from family planning to menstrual hygiene. Our goal is to empower individuals to make informed health decisions and access quality reproductive health services.',
            },
            {
                title: 'Mental Health & Psychosocial Support',
                description:
                    'We provide trauma-informed care and psychosocial support for survivors of gender-based violence, helping individuals heal and rebuild their lives with dignity and hope.',
            },
        ],
        imageId: '1074', // Medical/health context
    },
    {
        id: 'inclusion-detail',
        title: 'Inclusion',
        subtitle: 'No One Left Behind',
        color: {
            from: 'purple-500',
            to: 'purple-600',
            border: 'purple-500',
            bg: 'purple-100',
            text: 'purple-600',
        },
        icon: 'youth',
        highlights: ['Youth-Responsive SRH', 'Disability Inclusion', 'Safe Spaces for All'],
        approach: {
            title: 'Our Mission',
            description:
                'We design programs that honor identity, culture, and lived reality, ensuring everyone has access to services regardless of ability, gender identity, or background.',
        },
        impact: 'Visibility replaces silence. Access replaces exclusion.',
        metrics: [
            { label: 'Youth Reached', value: '2,000+' },
            { label: 'Safe Spaces Created', value: '15' },
            { label: 'Inclusive Programs', value: '25+' },
        ],
        initiatives: [
            {
                title: 'Youth- and Gender-Responsive SRH Services',
                description:
                    'We provide age-appropriate sexual and reproductive health services designed specifically for young people, addressing their unique needs with sensitivity and respect.',
            },
            {
                title: 'Inclusive Programming',
                description:
                    'We ensure persons with disabilities and sexual minorities have equal access to all our programs through inclusive design, accessibility accommodations, and anti-discrimination policies.',
            },
            {
                title: 'Safe Spaces',
                description:
                    'We create safe, judgment-free environments where marginalized communities can heal, learn, and belong without fear of stigma or violence.',
            },
        ],
        imageId: '1015', // Diverse people/community
    },
    {
        id: 'rights-detail',
        title: 'Rights',
        subtitle: 'Dignity Must Be Defended',
        color: {
            from: 'blue-600',
            to: 'blue-700',
            border: 'blue-600',
            bg: 'blue-100',
            text: 'blue-600',
        },
        icon: 'rights',
        highlights: ['Legal Aid for GBV Survivors', 'Human Rights Education', 'Policy Engagement'],
        approach: {
            title: 'Our Commitment',
            description:
                'We help communities claim and protect their rights through legal support, education, and advocacy that holds systems accountable.',
        },
        impact: 'Survivors become advocates. Systems begin to change.',
        metrics: [
            { label: 'Legal Aid Cases', value: '200+' },
            { label: 'Human Rights Trainings', value: '50+' },
            { label: 'Policy Engagements', value: '15' },
        ],
        initiatives: [
            {
                title: 'Legal Aid & Referrals for GBV Survivors',
                description:
                    'In partnership with legal professionals, we provide free legal aid to survivors of gender-based violence, ensuring justice is accessible to all, not just those who can afford it.',
            },
            {
                title: 'Human Rights Education',
                description:
                    'We conduct community sensitization programs that educate people about their fundamental rights and how to claim them, empowering communities with knowledge of the law.',
            },
            {
                title: 'Policy Engagement with Local Leaders',
                description:
                    'We engage with county and local government leaders to advocate for policies that protect vulnerable populations and hold institutions accountable to human rights standards.',
            },
        ],
        imageId: '1060', // Books/education/justice context
    },
    {
        id: 'impact-advocacy-detail',
        title: 'Impact Advocacy',
        subtitle: 'Sustainable Change',
        color: {
            from: 'wiria-yellow',
            to: 'yellow-500',
            border: 'wiria-yellow',
            bg: 'yellow-100',
            text: 'wiria-yellow',
        },
        icon: 'economy',
        highlights: ['Agribusiness & Entrepreneurship', 'Financial Literacy', 'School Bursaries'],
        approach: {
            title: 'Our Strategy',
            description:
                'We invest in long-term resilience by building skills, financial independence, and community-led solutions that create lasting change.',
        },
        impact: 'Dependency gives way to independence. Voices influence policy.',
        metrics: [
            { label: 'Table Banking Members', value: '800+' },
            { label: 'Farmers Trained', value: '250+' },
            { label: 'Bursaries Awarded', value: '120+' },
        ],
        initiatives: [
            {
                title: 'Agribusiness & Entrepreneurship Training',
                description:
                    'We train farmers in modern, sustainable agricultural techniques and connect them with markets for high-value crops. We also support small business development through skills training and mentorship.',
            },
            {
                title: 'Financial Literacy & Savings Groups',
                description:
                    'Our table banking groups provide a reliable source of savings and credit, empowering members to start businesses, pay school fees, and manage emergencies. Members meet regularly to save collectively and access low-interest loans.',
            },
            {
                title: 'School Bursaries for Vulnerable Learners',
                description:
                    'We provide educational support to children from vulnerable families, ensuring that poverty does not deny them the right to education and a brighter future.',
            },
            {
                title: 'Community-Led Research & Advocacy',
                description:
                    'We support communities in conducting their own research to identify needs and advocate for change, ensuring local voices influence policy decisions at every level.',
            },
        ],
        imageId: '1048', // Agriculture/business/growth
    },
];

export const CROSS_CUTTING_THEMES: { title: string; icon: 'health' | 'rights' | 'economy' | 'climate' | 'youth'; description: string }[] = [
    {
        title: 'Climate Action',
        icon: 'climate',
        description:
            'All our programs integrate climate-smart practices, from promoting drought-resistant crops in agriculture to advocating for sustainable resource management. We believe environmental health is community health, and we work to build resilience against climate change impacts.',
    },
    {
        title: 'Youth Inclusion',
        icon: 'youth',
        description:
            'Empowering the next generation is a priority. We ensure young people are included in all our program areas, providing them with leadership opportunities, skills training, and a platform to make their voices heard. Our youth programs prepare tomorrow\'s community leaders today.',
    },
];
