/**
 * Opportunities Page Constants
 * Static data for benefits and application tips sections
 */

export interface Benefit {
    title: string;
    description: string;
}

export interface ApplicationTip {
    title: string;
    description: string;
}

// Benefits for "What You'll Gain" section
export const BENEFITS: Benefit[] = [
    {
        title: 'Hands-on Experience',
        description: 'Real-world project work in community development and public health',
    },
    {
        title: 'Mentorship',
        description: 'Guidance from experienced professionals in the NGO sector',
    },
    {
        title: 'Certificate',
        description: 'Official certification and letter of recommendation upon completion',
    },
    {
        title: 'Impact',
        description: "Make a tangible difference in people's lives and communities",
    },
];

// Application tips data
export const APPLICATION_TIPS: ApplicationTip[] = [
    {
        title: 'Tailor Your Application',
        description: 'Customize your CV and cover letter to highlight relevant skills and experiences for each position.',
    },
    {
        title: 'Show Your Passion',
        description: "Explain why you're interested in our mission and how you can contribute to community development.",
    },
    {
        title: 'Include References',
        description: 'Provide at least two professional or academic references who can speak to your abilities.',
    },
    {
        title: 'Apply Early',
        description: "Don't wait until the deadline. We review applications on a rolling basis and may fill positions early.",
    },
];

// Volunteer activities list
export const VOLUNTEER_ACTIVITIES = [
    'Community health outreach and awareness campaigns.',
    'Mentorship for youth and women groups.',
    'Administrative support at our field office.',
    'Event planning and fundraising support.',
];

// Internship areas list
export const INTERNSHIP_AREAS = [
    'Program Management and M&E.',
    'Communications and Advocacy.',
    'Community Development.',
    'Finance and Administration.',
];
