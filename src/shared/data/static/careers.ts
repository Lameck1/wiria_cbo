/**
 * Static Careers Data
 * Fallback data when backend is unavailable
 */

import type { Job } from '@/features/careers/hooks/useCareers';

export const staticCareers: Job[] = [
    {
        id: 'static-career-1',
        title: 'Program Officer - Health',
        employmentType: 'FULL_TIME',
        location: 'Ndhiwa Office',
        deadline: '2026-01-31',
        salary: 'Competitive, based on experience',
        summary: 'We are seeking a dynamic Program Officer to lead our community health initiatives focused on HIV/TB/Malaria prevention and Sexual Reproductive Health.',
        description: 'The Program Officer will be responsible for designing, implementing, and monitoring health programs that serve vulnerable communities in Homa Bay County.',
        responsibilities: [
            'Lead implementation of HIV/TB/Malaria prevention programs',
            'Develop and maintain partnerships with health facilities and community structures',
            'Supervise community health volunteers and field staff',
            'Ensure quality data collection and program monitoring',
            'Prepare program reports and donor updates',
            'Coordinate with county health department and partners',
        ],
        requirements: [
            "Bachelor's degree in Public Health, Nursing, or related field",
            'Minimum 3 years experience in community health programs',
            'Knowledge of HIV/TB/Malaria interventions',
            'Strong project management and reporting skills',
            'Excellent communication in English and Kiswahili',
        ],
        desirable: ["Master's degree in Public Health", 'Experience working with CBOs/NGOs'],
        status: 'ACTIVE',
        createdAt: '2024-11-01T00:00:00Z',
        updatedAt: '2024-11-01T00:00:00Z',
    },
    {
        id: 'static-career-2',
        title: 'Finance & Admin Officer',
        employmentType: 'FULL_TIME',
        location: 'Ndhiwa Office',
        deadline: '2026-02-15',
        salary: 'KES 80,000 - 120,000',
        summary: 'Manage organizational finances, grants, budgets, and administrative operations.',
        description: 'The Finance & Admin Officer will oversee all financial and administrative functions of WIRIA CBO.',
        responsibilities: [
            'Prepare and manage organizational budgets',
            'Process payments and maintain financial records',
            'Prepare monthly, quarterly, and annual financial reports',
            'Ensure compliance with donor financial requirements',
            'Manage office administration and procurement',
        ],
        requirements: [
            'CPA (K) or ACCA qualification',
            'Minimum 5 years experience in NGO/CBO finance',
            'Proficiency in QuickBooks or similar accounting software',
            'Excellent Excel and reporting skills',
        ],
        desirable: ['Experience with Global Fund grants'],
        status: 'ACTIVE',
        createdAt: '2024-11-01T00:00:00Z',
        updatedAt: '2024-11-01T00:00:00Z',
    },
];
