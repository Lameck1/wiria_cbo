/**
 * Home page data definitions
 */

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  gradient: string;
  theme: 'health' | 'rights' | 'livelihoods' | 'impact';
  backgroundImage?: string;
}

export interface FocusArea {
  title: string;
  icon: string;
  description: string;
  color: string;
  link: string;
}

interface ImpactStat {
  label: string;
  value: string;
  target: number;
  description: string;
}



export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: 'Empowering Communities, Enhancing Lives',
    subtitle:
      'WIRIA CBO is at the forefront of championing health equity, human rights, and sustainable livelihoods for vulnerable populations in Western Kenya.',
    badge: '🌍 Our Mission',
    gradient: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6))',
    backgroundImage:
      'https://res.cloudinary.com/dy0nzibcm/image/upload/v1767812993/600534431_122154771818875978_5799959723367633766_n.jpg_qfnivw.jpg',
    theme: 'impact',
  },
  {
    id: 2,
    title: 'Born from Pain. Built for Change.',
    subtitle:
      'In the heart of Western Kenya, communities face intersecting health, human rights challenges, and economic exclusion that demand urgent action—particularly for girls and young women. WIRIA emerged as a community-driven response to these overlapping vulnerabilities.',
    badge: '🌟 Our Story',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #f59e0b 100%)', // Blue to Yellow (WIRIA colors)
    theme: 'health',
  },
  {
    id: 3,
    title: 'Championing Rights for All',
    subtitle:
      'Advocating for the rights of women, girls, and vulnerable populations through education, empowerment, and community action.',
    badge: '✊ Rights & Advocacy',
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #3b82f6 100%)', // Green to Blue
    theme: 'rights',
  },
  {
    id: 4,
    title: 'Enhancing Livelihoods & Prosperity',
    subtitle:
      'Building sustainable futures through agribusiness, table banking, skills training, and economic empowerment programs.',
    badge: '🌾 Economic Empowerment',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #10b981 100%)', // Yellow to Green
    theme: 'livelihoods',
  },
];

export const FOCUS_AREAS: FocusArea[] = [
  {
    title: 'Wellness',
    icon: '❤️',
    description:
      'Combating HIV/TB/Malaria, promoting Sexual and Reproductive Health, and providing mental health support for healthier communities.',
    color: 'bg-green-50 border-green-200 hover:border-green-400',
    link: '/programs#wellness-detail',
  },
  {
    title: 'Inclusion',
    icon: '👥',
    description:
      'Ensuring no one is left behind through youth-responsive services, disability inclusion, and safe spaces for all.',
    color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    link: '/programs#inclusion-detail',
  },
  {
    title: 'Rights',
    icon: '🛡️',
    description:
      'Defending dignity through legal aid for GBV survivors, human rights education, and policy engagement.',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    link: '/programs#rights-detail',
  },
  {
    title: 'Impact Advocacy',
    icon: '💰',
    description:
      'Building sustainable livelihoods through agribusiness, financial literacy, school bursaries, and community-led advocacy.',
    color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
    link: '/programs#impact-advocacy-detail',
  },
];

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
