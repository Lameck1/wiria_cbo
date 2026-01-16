/**
 * Static Opportunities Data
 * Fallback data when backend is unavailable
 */

import type { Opportunity } from '@/features/opportunities/hooks/useOpportunities';

const DEFAULT_CREATED_AT = '2024-11-01T00:00:00Z';
const DEFAULT_UPDATED_AT = '2024-11-01T00:00:00Z';

export const staticOpportunities: Opportunity[] = [
  {
    id: 'static-opportunity-1',
    title: 'Community Health Intern',
    type: 'INTERNSHIP',
    category: 'Health',
    duration: '3-6 months',
    location: 'Ndhiwa, Homa Bay County',
    deadline: '2026-01-15',
    summary: 'Gain hands-on experience in community health programs focusing on HIV/TB prevention.',
    description:
      'This internship provides an opportunity for public health students to apply classroom knowledge in real community settings.',
    responsibilities: [
      'Assist in health education sessions in communities',
      'Support data collection and entry for health programs',
      'Participate in outreach activities and health camps',
      'Help prepare community health reports',
    ],
    requirements: [
      'Currently pursuing or recently completed degree in Public Health',
      'Strong interest in community health',
      'Good communication skills in English and Kiswahili',
    ],
    benefits: ['Monthly stipend provided', 'Certificate of completion', 'Practical experience'],
    status: 'ACTIVE',
    createdAt: DEFAULT_CREATED_AT,
    updatedAt: DEFAULT_UPDATED_AT,
  },
  {
    id: 'static-opportunity-2',
    title: 'M&E and Data Assistant Volunteer',
    type: 'VOLUNTEER',
    category: 'Monitoring & Evaluation',
    duration: 'Flexible (minimum 3 months)',
    location: 'Ndhiwa Office (Remote possible)',
    deadline: 'Ongoing',
    summary: 'Help us strengthen our data management and program monitoring systems.',
    description: 'Support WIRIA M&E team in collecting, analyzing, and reporting program data.',
    responsibilities: [
      'Assist in data entry and cleaning',
      'Support preparation of program reports',
      'Help design data collection tools',
      'Create data visualization dashboards',
    ],
    requirements: [
      'Knowledge of Excel and basic statistics',
      'Attention to detail and accuracy',
      'Interest in development programs',
    ],
    benefits: ['Gain practical M&E experience', 'Certificate and reference letter'],
    status: 'ACTIVE',
    createdAt: DEFAULT_CREATED_AT,
    updatedAt: DEFAULT_UPDATED_AT,
  },
  {
    id: 'static-opportunity-3',
    title: 'Communications & Social Media Volunteer',
    type: 'VOLUNTEER',
    category: 'Communications',
    duration: 'Flexible',
    location: 'Remote (with occasional visits to Ndhiwa)',
    deadline: 'Ongoing',
    summary: 'Help us amplify our impact by telling the stories of the communities we serve.',
    description:
      'Manage WIRIA social media presence, create engaging content, and document our programs.',
    responsibilities: [
      'Create and schedule social media posts',
      'Write blog articles and success stories',
      'Capture photos and videos at events',
      'Design graphics for social media',
    ],
    requirements: [
      'Strong writing and storytelling skills',
      'Experience with social media platforms',
      'Basic graphic design skills (Canva, Photoshop)',
    ],
    benefits: [
      'Portfolio building opportunity',
      'Remote flexibility',
      'Certificate of participation',
    ],
    status: 'ACTIVE',
    createdAt: DEFAULT_CREATED_AT,
    updatedAt: DEFAULT_UPDATED_AT,
  },
];
