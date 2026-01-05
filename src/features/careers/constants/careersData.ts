/**
 * Careers Page Constants
 * Single responsibility: Store static data for careers page
 */

export const WHY_JOIN_REASONS = [
    {
        icon: 'book',
        title: 'Professional Growth',
        description: 'Continuous learning opportunities, skills development, and career advancement in the NGO sector.',
    },
    {
        icon: 'users',
        title: 'Meaningful Impact',
        description: 'Work directly with communities and see the tangible results of your efforts in people\'s lives.',
    },
    {
        icon: 'smile',
        title: 'Supportive Culture',
        description: 'Join a collaborative team that values diversity, innovation, and work-life balance.',
    },
] as const;

export const APPLICATION_PROCESS_STEPS = [
    {
        title: 'Review',
        description: 'Read the job description and requirements carefully',
    },
    {
        title: 'Apply',
        description: 'Submit your CV, cover letter, and required documents',
    },
    {
        title: 'Interview',
        description: 'Selected candidates will be invited for interviews',
    },
    {
        title: 'Onboard',
        description: 'Successful candidates join our team',
    },
] as const;

export const JOB_TYPE_LABELS: Record<string, string> = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    CONTRACT: 'Contract',
    CONSULTANCY: 'Consultancy',
};

export const JOB_STATUS_LABELS: Record<string, string> = {
    DRAFT: 'Draft',
    ACTIVE: 'Active',
    CLOSED: 'Closed',
    ARCHIVED: 'Archived',
};
