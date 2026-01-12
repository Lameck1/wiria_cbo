/**
 * About Page Data Constants
 * Centralized data for the About page sections
 */

export interface CoreValue {
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

export interface GovernanceLevel {
  level: number;
  title: string;
  description: string;
  gradient: string;
}

export interface SecretariatMember {
  name: string;
  roles: string[];
  image: string;
}

export interface SecretariatDepartment {
  title: string;
  members: SecretariatMember[];
}

export interface RegistrationDetail {
  label: string;
  value: string;
}

// Core Values - 5 values per director's guidelines
export const CORE_VALUES: Omit<CoreValue, 'icon'>[] = [
  {
    title: 'Inclusivity & Equity',
    description:
      'We reach those furthest behind first, ensuring equal access and opportunity for all vulnerable populations.',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    title: 'Transparency & Accountability',
    description:
      'Every resource entrusted to us matters. We maintain the highest standards of transparency in all our operations.',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Empowerment & Participation',
    description:
      'Communities lead their own transformation. We believe in empowering people, not creating dependency.',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    title: 'Human Rights & Dignity',
    description:
      'Every life has equal worth. We defend the fundamental rights and dignity of all people.',
    iconBg: 'bg-wiria-yellow/20',
    iconColor: 'text-wiria-yellow',
  },
  {
    title: 'Evidence-Informed Action',
    description:
      'Our solutions are grounded in data and lived experience, ensuring real impact for real people.',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
];

// Governance Levels
export const GOVERNANCE_LEVELS: GovernanceLevel[] = [
  {
    level: 1,
    title: 'General Assembly',
    description: 'All registered members - our supreme decision-making body',
    gradient: 'bg-gradient-to-br from-wiria-yellow to-amber-500',
  },
  {
    level: 2,
    title: 'Advisory Board',
    description: 'Strategic oversight and policy direction',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
  },
  {
    level: 3,
    title: 'Secretariat',
    description: 'Professional staff implementing our programs',
    gradient: 'bg-gradient-to-br from-green-500 to-green-600',
  },
];

// Secretariat Team Structure (Organized for Tree View)
export const SECRETARIAT_TEAM: SecretariatDepartment[] = [
  {
    title: 'Leadership',
    members: [
      {
        name: 'Elly Bwana',
        roles: ['Executive Director & Head of Programs'],
        image: '/images/secretariat/elly_bwana.png',
      },
    ],
  },
  {
    title: 'Projects & Implementation Unit',
    members: [
      {
        name: 'Nicholas Mbira',
        roles: ['Program Officer / Field Officer'],
        image: '/images/secretariat/nicholas_mbira.png',
      },
      {
        name: 'Faith Tom',
        roles: ['Monitoring & Evaluation (M&E) Officer'],
        image: '/images/secretariat/faith_tom.png',
      },
      {
        name: 'Risper Amolo',
        roles: ['Social Worker / Counselor'],
        image: '/images/secretariat/risper_amolo.png',
      },
    ],
  },
  {
    title: 'Finance & Administration',
    members: [
      {
        name: 'Dan Otieno',
        roles: ['Finance & Administration Officer', 'Procurement Officer'],
        image: '/images/secretariat/dan_otieno.png',
      },
    ],
  },
  {
    title: 'Communications & Resource Mobilization',
    members: [
      {
        name: 'Lameck Odhiambo',
        roles: ['Communications & Public Relations Officer', 'ICT & Data Management Officer'],
        image: '/images/secretariat/lameck_odhiambo.png',
      },
    ],
  },
];

// Registration Details
export const REGISTRATION_DETAILS: RegistrationDetail[] = [
  { label: 'Legal Status', value: 'Registered Community Based Group' },
  { label: 'Registration', value: 'Department of Social Services, Homa Bay County' },
  { label: 'Location', value: 'Wanyaga Village, Kobita Sub-Location, Ndhiwa Sub-County' },
  { label: 'Postal Address', value: 'P.O. Box 40302-12, Ndhiwa' },
];
